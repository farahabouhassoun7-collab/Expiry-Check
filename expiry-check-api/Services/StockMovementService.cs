using ExpiryCheckApi.DTOs;
using ExpiryCheckApi.Interfaces;
using ExpiryCheckApi.Models;

namespace ExpiryCheckApi.Services;

public sealed class StockMovementService(
    IStockMovementRepository stockMovementRepo,
    IInventoryRepository inventoryRepo) : IStockMovementService
{
    public async Task<PagedResult<StockMovementResponse>> GetPagedAsync(StockMovementQueryParams queryParams, CancellationToken ct = default)
    {
        var result = await stockMovementRepo.GetPagedAsync(queryParams, ct);
        var dtos = result.Items.Select(MapToDto).ToList();
        return new PagedResult<StockMovementResponse>(dtos, result.TotalItems, result.Page, result.PageSize, result.TotalPages);
    }

    public async Task<StockMovementResponse?> GetByIdAsync(int id, CancellationToken ct = default)
    {
        var movement = await stockMovementRepo.GetByIdAsync(id, ct);
        return movement is null ? null : MapToDto(movement);
    }

    public async Task<IReadOnlyList<StockMovementResponse>> GetByBatchIdAsync(int batchId, CancellationToken ct = default)
    {
        var movements = await stockMovementRepo.GetByBatchIdAsync(batchId, ct);
        return movements.Select(MapToDto).ToList();
    }

    public async Task<IReadOnlyList<StockMovementResponse>> GetByProductIdAsync(int productId, CancellationToken ct = default)
    {
        var movements = await stockMovementRepo.GetByProductIdAsync(productId, ct);
        return movements.Select(MapToDto).ToList();
    }

    public async Task<StockMovementResponse> RecordMovementAsync(int userId, RecordStockMovementRequest req, CancellationToken ct = default)
    {
        // 1. Verify batch existence
        var batch = await inventoryRepo.GetByIdAsync(req.InventoryBatchId, ct)
            ?? throw new KeyNotFoundException($"Inventory batch with ID {req.InventoryBatchId} was not found.");

        // 2. Validate quantity change
        var prevQty = batch.RemainingQuantity;
        var newQty = prevQty + req.Quantity;

        if (newQty < 0)
            throw new InvalidOperationException($"Insufficient stock remaining ({prevQty}). Cannot reduce by {Math.Abs(req.Quantity)} units.");

        // 3. Update batch remaining quantity and status
        batch.RemainingQuantity = newQty;
        if (newQty == 0)
            batch.Status = "Depleted";
        else if (batch.ExpiryDate <= DateTime.UtcNow)
            batch.Status = "Expired";
        else if (batch.ExpiryDate <= DateTime.UtcNow.AddDays(14))
            batch.Status = "NearExpiry";
        else
            batch.Status = "Active";

        await inventoryRepo.UpdateAsync(batch, ct);

        // 4. Record stock movement entry
        var movement = new StockMovement
        {
            InventoryBatchId = req.InventoryBatchId,
            ProductId = batch.ProductId,
            UserId = userId,
            MovementType = req.MovementType.Trim(),
            Quantity = req.Quantity,
            PreviousQuantity = prevQty,
            NewQuantity = newQty,
            Reason = req.Reason?.Trim(),
            ReferenceNumber = req.ReferenceNumber?.Trim(),
            MovementDate = DateTime.UtcNow,
            CreatedAt = DateTime.UtcNow,
        };

        var created = await stockMovementRepo.CreateAsync(movement, ct);
        var refreshed = await stockMovementRepo.GetByIdAsync(created.Id, ct) ?? created;
        return MapToDto(refreshed);
    }

    private static StockMovementResponse MapToDto(StockMovement sm) => new(
        sm.Id,
        sm.InventoryBatchId,
        sm.InventoryBatch?.BatchNumber ?? "N/A",
        sm.ProductId,
        sm.Product?.SKU ?? "N/A",
        sm.Product?.Title ?? "Unknown Product",
        sm.UserId,
        sm.User != null ? $"{sm.User.FirstName} {sm.User.LastName}".Trim() : "System",
        sm.MovementType,
        sm.Quantity,
        sm.PreviousQuantity,
        sm.NewQuantity,
        sm.Reason,
        sm.ReferenceNumber,
        sm.MovementDate,
        sm.CreatedAt
    );
}

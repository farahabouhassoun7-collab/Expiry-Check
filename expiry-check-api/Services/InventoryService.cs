using ExpiryCheckApi.DTOs;
using ExpiryCheckApi.Interfaces;
using ExpiryCheckApi.Models;

namespace ExpiryCheckApi.Services;

public sealed class InventoryService(
    IInventoryRepository inventoryRepo,
    IProductRepository productRepo) : IInventoryService
{
    public async Task<PagedResult<InventoryBatchResponse>> GetPagedAsync(InventoryQueryParams queryParams, CancellationToken ct = default)
    {
        var result = await inventoryRepo.GetPagedAsync(queryParams, ct);
        var dtos = result.Items.Select(MapToDto).ToList();
        return new PagedResult<InventoryBatchResponse>(dtos, result.TotalItems, result.Page, result.PageSize, result.TotalPages);
    }

    public async Task<InventoryBatchResponse?> GetByIdAsync(int id, CancellationToken ct = default)
    {
        var batch = await inventoryRepo.GetByIdAsync(id, ct);
        return batch is null ? null : MapToDto(batch);
    }

    public async Task<IReadOnlyList<InventoryBatchResponse>> GetByProductIdAsync(int productId, CancellationToken ct = default)
    {
        var batches = await inventoryRepo.GetByProductIdAsync(productId, ct);
        return batches.Select(MapToDto).ToList();
    }

    public async Task<IReadOnlyList<InventoryBatchResponse>> GetExpiringBatchesAsync(int daysThreshold = 30, CancellationToken ct = default)
    {
        var batches = await inventoryRepo.GetExpiringBatchesAsync(daysThreshold, ct);
        return batches.Select(MapToDto).ToList();
    }

    public async Task<IReadOnlyList<InventoryBatchResponse>> GetExpiredBatchesAsync(CancellationToken ct = default)
    {
        var batches = await inventoryRepo.GetExpiredBatchesAsync(ct);
        return batches.Select(MapToDto).ToList();
    }

    public async Task<IReadOnlyList<InventoryBatchResponse>> GetLowStockBatchesAsync(CancellationToken ct = default)
    {
        var batches = await inventoryRepo.GetLowStockBatchesAsync(ct);
        return batches.Select(MapToDto).ToList();
    }

    public async Task<InventoryBatchResponse> CreateAsync(CreateInventoryBatchRequest req, CancellationToken ct = default)
    {
        // 1. Verify product existence
        var product = await productRepo.GetByIdAsync(req.ProductId, ct)
            ?? throw new KeyNotFoundException($"Product with ID {req.ProductId} was not found.");

        // 2. Validate unique BatchNumber per Product
        if (await inventoryRepo.BatchNumberExistsAsync(req.ProductId, req.BatchNumber, null, ct))
            throw new InvalidOperationException($"Batch number '{req.BatchNumber}' already exists for product ID {req.ProductId}.");

        // 3. Business Rule: ExpiryDate must be after ManufacturingDate
        if (req.ManufacturingDate.HasValue && req.ExpiryDate <= req.ManufacturingDate.Value)
            throw new InvalidOperationException("ExpiryDate must be strictly after ManufacturingDate.");

        // 4. Business Rule: RemainingQuantity can never exceed Quantity
        var remainingQty = req.RemainingQuantity ?? req.Quantity;
        if (remainingQty > req.Quantity)
            throw new InvalidOperationException($"RemainingQuantity ({remainingQty}) cannot exceed total Quantity ({req.Quantity}).");

        var status = DetermineStatus(req.ExpiryDate, remainingQty);

        var batch = new InventoryBatch
        {
            ProductId = req.ProductId,
            BatchNumber = req.BatchNumber.Trim(),
            ManufacturingDate = req.ManufacturingDate,
            ExpiryDate = req.ExpiryDate,
            Quantity = req.Quantity,
            RemainingQuantity = remainingQty,
            PurchasePrice = req.PurchasePrice,
            SupplierName = req.SupplierName?.Trim(),
            WarehouseLocation = req.WarehouseLocation?.Trim(),
            Status = status,
            Notes = req.Notes?.Trim(),
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        };

        var created = await inventoryRepo.CreateAsync(batch, ct);
        var refreshed = await inventoryRepo.GetByIdAsync(created.Id, ct) ?? created;
        return MapToDto(refreshed);
    }

    public async Task<InventoryBatchResponse?> UpdateAsync(int id, UpdateInventoryBatchRequest req, CancellationToken ct = default)
    {
        var existing = await inventoryRepo.GetByIdAsync(id, ct);
        if (existing is null) return null;

        // 1. Validate unique BatchNumber per Product
        if (await inventoryRepo.BatchNumberExistsAsync(existing.ProductId, req.BatchNumber, id, ct))
            throw new InvalidOperationException($"Batch number '{req.BatchNumber}' already exists for product ID {existing.ProductId}.");

        // 2. Business Rule: ExpiryDate must be after ManufacturingDate
        if (req.ManufacturingDate.HasValue && req.ExpiryDate <= req.ManufacturingDate.Value)
            throw new InvalidOperationException("ExpiryDate must be strictly after ManufacturingDate.");

        // 3. Business Rule: RemainingQuantity can never exceed Quantity
        if (req.RemainingQuantity > req.Quantity)
            throw new InvalidOperationException($"RemainingQuantity ({req.RemainingQuantity}) cannot exceed total Quantity ({req.Quantity}).");

        var calculatedStatus = DetermineStatus(req.ExpiryDate, req.RemainingQuantity);
        var status = !string.IsNullOrWhiteSpace(req.Status) ? req.Status.Trim() : calculatedStatus;

        existing.BatchNumber = req.BatchNumber.Trim();
        existing.ManufacturingDate = req.ManufacturingDate;
        existing.ExpiryDate = req.ExpiryDate;
        existing.Quantity = req.Quantity;
        existing.RemainingQuantity = req.RemainingQuantity;
        existing.PurchasePrice = req.PurchasePrice;
        existing.SupplierName = req.SupplierName?.Trim();
        existing.WarehouseLocation = req.WarehouseLocation?.Trim();
        existing.Status = status;
        existing.Notes = req.Notes?.Trim();

        await inventoryRepo.UpdateAsync(existing, ct);
        var refreshed = await inventoryRepo.GetByIdAsync(id, ct) ?? existing;
        return MapToDto(refreshed);
    }

    public async Task<bool> DeleteAsync(int id, CancellationToken ct = default)
    {
        var batch = await inventoryRepo.GetByIdAsync(id, ct);
        if (batch is null) return false;

        await inventoryRepo.DeleteAsync(batch, ct);
        return true;
    }

    private static string DetermineStatus(DateTime expiryDate, int remainingQty)
    {
        if (remainingQty <= 0) return "Depleted";
        var now = DateTime.UtcNow;
        if (expiryDate <= now) return "Expired";
        if (expiryDate <= now.AddDays(14)) return "NearExpiry";
        return "Active";
    }

    private static InventoryBatchResponse MapToDto(InventoryBatch b)
    {
        var daysRemaining = (int)Math.Ceiling((b.ExpiryDate - DateTime.UtcNow).TotalDays);

        return new InventoryBatchResponse(
            b.Id,
            b.ProductId,
            b.Product?.SKU ?? "N/A",
            b.Product?.Title ?? "Unknown Product",
            b.Product?.Category?.Name ?? "Uncategorized",
            b.BatchNumber,
            b.ManufacturingDate,
            b.ExpiryDate,
            daysRemaining,
            b.Quantity,
            b.RemainingQuantity,
            b.PurchasePrice,
            b.SupplierName,
            b.WarehouseLocation,
            b.Status,
            b.Notes,
            b.CreatedAt,
            b.UpdatedAt
        );
    }
}

using ExpiryCheckApi.Data;
using ExpiryCheckApi.DTOs;
using ExpiryCheckApi.Interfaces;
using ExpiryCheckApi.Models;
using Microsoft.EntityFrameworkCore;

namespace ExpiryCheckApi.Repositories;

public sealed class StockMovementRepository(AppDbContext db) : IStockMovementRepository
{
    public async Task<PagedResult<StockMovement>> GetPagedAsync(StockMovementQueryParams p, CancellationToken ct = default)
    {
        var query = db.Set<StockMovement>()
                      .Include(sm => sm.InventoryBatch!)
                      .Include(sm => sm.Product!)
                      .Include(sm => sm.User!)
                      .AsNoTracking();

        if (p.ProductId.HasValue)
            query = query.Where(sm => sm.ProductId == p.ProductId.Value);

        if (p.InventoryBatchId.HasValue)
            query = query.Where(sm => sm.InventoryBatchId == p.InventoryBatchId.Value);

        if (p.UserId.HasValue)
            query = query.Where(sm => sm.UserId == p.UserId.Value);

        if (!string.IsNullOrWhiteSpace(p.MovementType))
            query = query.Where(sm => sm.MovementType.ToLower() == p.MovementType.Trim().ToLower());

        if (p.FromDate.HasValue)
            query = query.Where(sm => sm.MovementDate >= p.FromDate.Value);

        if (p.ToDate.HasValue)
            query = query.Where(sm => sm.MovementDate <= p.ToDate.Value);

        query = query.OrderByDescending(sm => sm.MovementDate);

        var totalItems = await query.CountAsync(ct);
        var page = Math.Max(1, p.Page);
        var pageSize = Math.Clamp(p.PageSize, 1, 100);
        var totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);

        var items = await query.Skip((page - 1) * pageSize)
                               .Take(pageSize)
                               .ToListAsync(ct);

        return new PagedResult<StockMovement>(items, totalItems, page, pageSize, totalPages);
    }

    public Task<StockMovement?> GetByIdAsync(int id, CancellationToken ct = default)
        => db.Set<StockMovement>()
             .Include(sm => sm.InventoryBatch!)
             .Include(sm => sm.Product!)
             .Include(sm => sm.User!)
             .AsNoTracking()
             .FirstOrDefaultAsync(sm => sm.Id == id, ct);

    public async Task<IReadOnlyList<StockMovement>> GetByBatchIdAsync(int batchId, CancellationToken ct = default)
        => await db.Set<StockMovement>()
                   .Include(sm => sm.InventoryBatch!)
                   .Include(sm => sm.Product!)
                   .Include(sm => sm.User!)
                   .AsNoTracking()
                   .Where(sm => sm.InventoryBatchId == batchId)
                   .OrderByDescending(sm => sm.MovementDate)
                   .ToListAsync(ct);

    public async Task<IReadOnlyList<StockMovement>> GetByProductIdAsync(int productId, CancellationToken ct = default)
        => await db.Set<StockMovement>()
                   .Include(sm => sm.InventoryBatch!)
                   .Include(sm => sm.Product!)
                   .Include(sm => sm.User!)
                   .AsNoTracking()
                   .Where(sm => sm.ProductId == productId)
                   .OrderByDescending(sm => sm.MovementDate)
                   .ToListAsync(ct);

    public async Task<StockMovement> CreateAsync(StockMovement movement, CancellationToken ct = default)
    {
        db.Set<StockMovement>().Add(movement);
        await db.SaveChangesAsync(ct);
        return movement;
    }
}

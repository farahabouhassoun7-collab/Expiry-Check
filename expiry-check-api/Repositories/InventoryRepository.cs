using ExpiryCheckApi.Data;
using ExpiryCheckApi.DTOs;
using ExpiryCheckApi.Interfaces;
using ExpiryCheckApi.Models;
using Microsoft.EntityFrameworkCore;

namespace ExpiryCheckApi.Repositories;

public sealed class InventoryRepository(AppDbContext db) : IInventoryRepository
{
    public async Task<PagedResult<InventoryBatch>> GetPagedAsync(InventoryQueryParams p, CancellationToken ct = default)
    {
        var query = db.Set<InventoryBatch>()
                      .Include(b => b.Product!)
                      .ThenInclude(p => p.Category!)
                      .AsNoTracking();

        if (p.ProductId.HasValue)
            query = query.Where(b => b.ProductId == p.ProductId.Value);

        if (!string.IsNullOrWhiteSpace(p.BatchNumber))
            query = query.Where(b => b.BatchNumber.ToLower().Contains(p.BatchNumber.Trim().ToLower()));

        if (!string.IsNullOrWhiteSpace(p.Status))
            query = query.Where(b => b.Status.ToLower() == p.Status.Trim().ToLower());

        var now = DateTime.UtcNow;

        if (p.ExpiringWithinDays.HasValue)
        {
            var targetDate = now.AddDays(p.ExpiringWithinDays.Value);
            query = query.Where(b => b.RemainingQuantity > 0 && b.ExpiryDate > now && b.ExpiryDate <= targetDate);
        }

        if (p.ExpiredOnly.HasValue && p.ExpiredOnly.Value)
            query = query.Where(b => b.ExpiryDate <= now);

        if (p.LowStockOnly.HasValue && p.LowStockOnly.Value)
            query = query.Where(b => b.RemainingQuantity > 0 && b.RemainingQuantity <= (b.Product != null ? b.Product.MinStockLevel : 5));

        query = query.OrderBy(b => b.ExpiryDate);

        var totalItems = await query.CountAsync(ct);
        var page = Math.Max(1, p.Page);
        var pageSize = Math.Clamp(p.PageSize, 1, 100);
        var totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);

        var items = await query.Skip((page - 1) * pageSize)
                               .Take(pageSize)
                               .ToListAsync(ct);

        return new PagedResult<InventoryBatch>(items, totalItems, page, pageSize, totalPages);
    }

    public async Task<IReadOnlyList<InventoryBatch>> GetAllAsync(CancellationToken ct = default)
        => await db.Set<InventoryBatch>()
                   .Include(b => b.Product!)
                   .ThenInclude(p => p.Category!)
                   .AsNoTracking()
                   .OrderBy(b => b.ExpiryDate)
                   .ToListAsync(ct);

    public Task<InventoryBatch?> GetByIdAsync(int id, CancellationToken ct = default)
        => db.Set<InventoryBatch>()
             .Include(b => b.Product!)
             .ThenInclude(p => p.Category!)
             .AsNoTracking()
             .FirstOrDefaultAsync(b => b.Id == id, ct);

    public async Task<IReadOnlyList<InventoryBatch>> GetByProductIdAsync(int productId, CancellationToken ct = default)
        => await db.Set<InventoryBatch>()
                   .Include(b => b.Product!)
                   .ThenInclude(p => p.Category!)
                   .AsNoTracking()
                   .Where(b => b.ProductId == productId)
                   .OrderBy(b => b.ExpiryDate)
                   .ToListAsync(ct);

    public Task<InventoryBatch?> GetByProductAndBatchNumberAsync(int productId, string batchNumber, CancellationToken ct = default)
        => db.Set<InventoryBatch>()
             .Include(b => b.Product!)
             .ThenInclude(p => p.Category!)
             .AsNoTracking()
             .FirstOrDefaultAsync(b => b.ProductId == productId && b.BatchNumber.ToLower() == batchNumber.Trim().ToLower(), ct);

    public Task<bool> BatchNumberExistsAsync(int productId, string batchNumber, int? excludeId = null, CancellationToken ct = default)
        => db.Set<InventoryBatch>()
             .AnyAsync(b => b.ProductId == productId &&
                            b.BatchNumber.ToLower() == batchNumber.Trim().ToLower() &&
                            (!excludeId.HasValue || b.Id != excludeId.Value), ct);

    public async Task<IReadOnlyList<InventoryBatch>> GetExpiringBatchesAsync(int daysThreshold = 30, CancellationToken ct = default)
    {
        var now = DateTime.UtcNow;
        var thresholdDate = now.AddDays(daysThreshold);

        return await db.Set<InventoryBatch>()
                       .Include(b => b.Product!)
                       .ThenInclude(p => p.Category!)
                       .AsNoTracking()
                       .Where(b => b.RemainingQuantity > 0 && b.ExpiryDate > now && b.ExpiryDate <= thresholdDate)
                       .OrderBy(b => b.ExpiryDate)
                       .ToListAsync(ct);
    }

    public async Task<IReadOnlyList<InventoryBatch>> GetExpiredBatchesAsync(CancellationToken ct = default)
    {
        var now = DateTime.UtcNow;

        return await db.Set<InventoryBatch>()
                       .Include(b => b.Product!)
                       .ThenInclude(p => p.Category!)
                       .AsNoTracking()
                       .Where(b => b.ExpiryDate <= now)
                       .OrderBy(b => b.ExpiryDate)
                       .ToListAsync(ct);
    }

    public async Task<IReadOnlyList<InventoryBatch>> GetLowStockBatchesAsync(CancellationToken ct = default)
        => await db.Set<InventoryBatch>()
                   .Include(b => b.Product!)
                   .ThenInclude(p => p.Category!)
                   .AsNoTracking()
                   .Where(b => b.RemainingQuantity > 0 && b.RemainingQuantity <= (b.Product != null ? b.Product.MinStockLevel : 5))
                   .OrderBy(b => b.RemainingQuantity)
                   .ToListAsync(ct);

    public async Task<InventoryBatch> CreateAsync(InventoryBatch batch, CancellationToken ct = default)
    {
        db.Set<InventoryBatch>().Add(batch);
        await db.SaveChangesAsync(ct);
        return batch;
    }

    public async Task UpdateAsync(InventoryBatch batch, CancellationToken ct = default)
    {
        batch.UpdatedAt = DateTime.UtcNow;
        db.Set<InventoryBatch>().Update(batch);
        await db.SaveChangesAsync(ct);
    }

    public async Task DeleteAsync(InventoryBatch batch, CancellationToken ct = default)
    {
        db.Set<InventoryBatch>().Remove(batch);
        await db.SaveChangesAsync(ct);
    }
}

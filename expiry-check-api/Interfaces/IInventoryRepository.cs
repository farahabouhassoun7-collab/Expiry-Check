using ExpiryCheckApi.DTOs;
using ExpiryCheckApi.Models;

namespace ExpiryCheckApi.Interfaces;

public interface IInventoryRepository
{
    Task<PagedResult<InventoryBatch>> GetPagedAsync(InventoryQueryParams queryParams, CancellationToken ct = default);
    Task<IReadOnlyList<InventoryBatch>> GetAllAsync(CancellationToken ct = default);
    Task<InventoryBatch?> GetByIdAsync(int id, CancellationToken ct = default);
    Task<IReadOnlyList<InventoryBatch>> GetByProductIdAsync(int productId, CancellationToken ct = default);
    Task<InventoryBatch?> GetByProductAndBatchNumberAsync(int productId, string batchNumber, CancellationToken ct = default);
    Task<bool> BatchNumberExistsAsync(int productId, string batchNumber, int? excludeId = null, CancellationToken ct = default);
    Task<IReadOnlyList<InventoryBatch>> GetExpiringBatchesAsync(int daysThreshold = 30, CancellationToken ct = default);
    Task<IReadOnlyList<InventoryBatch>> GetExpiredBatchesAsync(CancellationToken ct = default);
    Task<IReadOnlyList<InventoryBatch>> GetLowStockBatchesAsync(CancellationToken ct = default);
    Task<InventoryBatch> CreateAsync(InventoryBatch batch, CancellationToken ct = default);
    Task UpdateAsync(InventoryBatch batch, CancellationToken ct = default);
    Task DeleteAsync(InventoryBatch batch, CancellationToken ct = default);
}

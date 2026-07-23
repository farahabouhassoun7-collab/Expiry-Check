using ExpiryCheckApi.DTOs;

namespace ExpiryCheckApi.Interfaces;

public interface IInventoryService
{
    Task<PagedResult<InventoryBatchResponse>> GetPagedAsync(InventoryQueryParams queryParams, CancellationToken ct = default);
    Task<InventoryBatchResponse?> GetByIdAsync(int id, CancellationToken ct = default);
    Task<IReadOnlyList<InventoryBatchResponse>> GetByProductIdAsync(int productId, CancellationToken ct = default);
    Task<IReadOnlyList<InventoryBatchResponse>> GetExpiringBatchesAsync(int daysThreshold = 30, CancellationToken ct = default);
    Task<IReadOnlyList<InventoryBatchResponse>> GetExpiredBatchesAsync(CancellationToken ct = default);
    Task<IReadOnlyList<InventoryBatchResponse>> GetLowStockBatchesAsync(CancellationToken ct = default);
    Task<InventoryBatchResponse> CreateAsync(CreateInventoryBatchRequest request, CancellationToken ct = default);
    Task<InventoryBatchResponse?> UpdateAsync(int id, UpdateInventoryBatchRequest request, CancellationToken ct = default);
    Task<bool> DeleteAsync(int id, CancellationToken ct = default);
}

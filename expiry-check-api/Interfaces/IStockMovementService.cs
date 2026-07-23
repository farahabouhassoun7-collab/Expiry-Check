using ExpiryCheckApi.DTOs;

namespace ExpiryCheckApi.Interfaces;

public interface IStockMovementService
{
    Task<PagedResult<StockMovementResponse>> GetPagedAsync(StockMovementQueryParams queryParams, CancellationToken ct = default);
    Task<StockMovementResponse?> GetByIdAsync(int id, CancellationToken ct = default);
    Task<IReadOnlyList<StockMovementResponse>> GetByBatchIdAsync(int batchId, CancellationToken ct = default);
    Task<IReadOnlyList<StockMovementResponse>> GetByProductIdAsync(int productId, CancellationToken ct = default);
    Task<StockMovementResponse> RecordMovementAsync(int userId, RecordStockMovementRequest request, CancellationToken ct = default);
}

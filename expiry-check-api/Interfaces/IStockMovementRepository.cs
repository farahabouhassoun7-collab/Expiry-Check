using ExpiryCheckApi.DTOs;
using ExpiryCheckApi.Models;

namespace ExpiryCheckApi.Interfaces;

public interface IStockMovementRepository
{
    Task<PagedResult<StockMovement>> GetPagedAsync(StockMovementQueryParams queryParams, CancellationToken ct = default);
    Task<StockMovement?> GetByIdAsync(int id, CancellationToken ct = default);
    Task<IReadOnlyList<StockMovement>> GetByBatchIdAsync(int batchId, CancellationToken ct = default);
    Task<IReadOnlyList<StockMovement>> GetByProductIdAsync(int productId, CancellationToken ct = default);
    Task<StockMovement> CreateAsync(StockMovement movement, CancellationToken ct = default);
}

using ExpiryCheckApi.DTOs;
using ExpiryCheckApi.Models;

namespace ExpiryCheckApi.Interfaces;

public interface IProductRepository
{
    Task<PagedResult<Product>> GetPagedAsync(ProductQueryParams queryParams, CancellationToken ct = default);
    Task<Product?> GetByIdAsync(int id, CancellationToken ct = default);
    Task<Product?> GetBySKUAsync(string sku, CancellationToken ct = default);
    Task<Product?> GetByBarcodeAsync(string barcode, CancellationToken ct = default);
    Task<bool> SKUExistsAsync(string sku, int? excludeId = null, CancellationToken ct = default);
    Task<bool> BarcodeExistsAsync(string barcode, int? excludeId = null, CancellationToken ct = default);
    Task<Product> CreateAsync(Product product, CancellationToken ct = default);
    Task UpdateAsync(Product product, CancellationToken ct = default);
    Task DeleteAsync(Product product, CancellationToken ct = default);
}

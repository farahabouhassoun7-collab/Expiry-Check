using System.ComponentModel.DataAnnotations;

namespace ExpiryCheckApi.DTOs;

/// <summary>
/// Detailed response DTO for a product.
/// </summary>
public record ProductDto(
    int Id,
    string SKU,
    string? Barcode,
    string Title,
    string? Description,
    int CategoryId,
    string CategoryName,
    decimal Price,
    decimal DiscountPercentage,
    decimal CostPrice,
    decimal Rating,
    decimal Weight,
    string Unit,
    string? Brand,
    string[] Tags,
    string? ThumbnailUrl,
    string[] Images,
    int MinStockLevel,
    int ReorderLevel,
    bool IsActive,
    DateTime CreatedAt,
    DateTime UpdatedAt
);

/// <summary>
/// Request DTO for creating a new product.
/// </summary>
public record CreateProductDto(
    [Required, MaxLength(50)] string SKU,
    [MaxLength(100)] string? Barcode,
    [Required, MaxLength(200)] string Title,
    string? Description,
    [Required] int CategoryId,
    [Range(0, 1000000)] decimal Price,
    [Range(0, 100)] decimal DiscountPercentage = 0,
    [Range(0, 1000000)] decimal CostPrice = 0,
    [Range(0, 5)] decimal Rating = 0,
    [Range(0, 10000)] decimal Weight = 0,
    [MaxLength(20)] string Unit = "unit",
    [MaxLength(100)] string? Brand = null,
    string[]? Tags = null,
    [MaxLength(1000)] string? ThumbnailUrl = null,
    string[]? Images = null,
    [Range(0, 10000)] int MinStockLevel = 5,
    [Range(0, 10000)] int ReorderLevel = 10
);

/// <summary>
/// Request DTO for updating an existing product.
/// </summary>
public record UpdateProductDto(
    [Required, MaxLength(50)] string SKU,
    [MaxLength(100)] string? Barcode,
    [Required, MaxLength(200)] string Title,
    string? Description,
    [Required] int CategoryId,
    [Range(0, 1000000)] decimal Price,
    [Range(0, 100)] decimal DiscountPercentage,
    [Range(0, 1000000)] decimal CostPrice,
    [Range(0, 5)] decimal Rating,
    [Range(0, 10000)] decimal Weight,
    [MaxLength(20)] string Unit,
    [MaxLength(100)] string? Brand,
    string[]? Tags,
    [MaxLength(1000)] string? ThumbnailUrl,
    string[]? Images,
    [Range(0, 10000)] int MinStockLevel,
    [Range(0, 10000)] int ReorderLevel,
    bool IsActive
);

/// <summary>
/// Filter &amp; pagination parameters for searching products.
/// </summary>
public class ProductQueryParams
{
    public string? Search { get; set; }
    public int? CategoryId { get; set; }
    public string? Brand { get; set; }
    public decimal? MinPrice { get; set; }
    public decimal? MaxPrice { get; set; }
    public bool? ActiveOnly { get; set; } = true;

    public string SortBy { get; set; } = "title"; // title, price, sku, date
    public bool SortDescending { get; set; } = false;

    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;
}

/// <summary>
/// Generic paginated response wrapper.
/// </summary>
public record PagedResult<T>(
    IReadOnlyList<T> Items,
    int TotalItems,
    int Page,
    int PageSize,
    int TotalPages
);

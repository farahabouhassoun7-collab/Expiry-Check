using System.ComponentModel.DataAnnotations;

namespace ExpiryCheckApi.DTOs;

/// <summary>
/// Response DTO for an inventory batch.
/// </summary>
public record InventoryBatchResponse(
    int Id,
    int ProductId,
    string SKU,
    string ProductName,
    string CategoryName,
    string BatchNumber,
    DateTime? ManufacturingDate,
    DateTime ExpiryDate,
    int DaysRemaining,
    int Quantity,
    int RemainingQuantity,
    decimal PurchasePrice,
    string? SupplierName,
    string? WarehouseLocation,
    string Status,
    string? Notes,
    DateTime CreatedAt,
    DateTime UpdatedAt
);

/// <summary>
/// Request DTO for creating a new inventory batch.
/// </summary>
public record CreateInventoryBatchRequest(
    [Required] int ProductId,
    [Required, MaxLength(100)] string BatchNumber,
    DateTime? ManufacturingDate,
    [Required] DateTime ExpiryDate,
    [Range(1, 1000000)] int Quantity,
    [Range(0, 1000000)] int? RemainingQuantity,
    [Range(0, 1000000)] decimal PurchasePrice = 0,
    [MaxLength(150)] string? SupplierName = null,
    [MaxLength(100)] string? WarehouseLocation = null,
    [MaxLength(2000)] string? Notes = null
);

/// <summary>
/// Request DTO for updating an existing inventory batch.
/// </summary>
public record UpdateInventoryBatchRequest(
    [Required, MaxLength(100)] string BatchNumber,
    DateTime? ManufacturingDate,
    [Required] DateTime ExpiryDate,
    [Range(1, 1000000)] int Quantity,
    [Range(0, 1000000)] int RemainingQuantity,
    [Range(0, 1000000)] decimal PurchasePrice,
    [MaxLength(150)] string? SupplierName,
    [MaxLength(100)] string? WarehouseLocation,
    [MaxLength(30)] string? Status,
    [MaxLength(2000)] string? Notes
);

/// <summary>
/// Query filter parameters for inventory search.
/// </summary>
public class InventoryQueryParams
{
    public int? ProductId { get; set; }
    public string? BatchNumber { get; set; }
    public string? Status { get; set; }
    public int? ExpiringWithinDays { get; set; }
    public bool? ExpiredOnly { get; set; }
    public bool? LowStockOnly { get; set; }

    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;
}

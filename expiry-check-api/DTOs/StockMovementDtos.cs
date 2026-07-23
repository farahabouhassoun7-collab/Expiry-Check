using System.ComponentModel.DataAnnotations;

namespace ExpiryCheckApi.DTOs;

/// <summary>
/// Response DTO for a stock movement audit log entry.
/// </summary>
public record StockMovementResponse(
    int Id,
    int InventoryBatchId,
    string BatchNumber,
    int ProductId,
    string SKU,
    string ProductName,
    int UserId,
    string UserName,
    string MovementType,
    int Quantity,
    int PreviousQuantity,
    int NewQuantity,
    string? Reason,
    string? ReferenceNumber,
    DateTime MovementDate,
    DateTime CreatedAt
);

/// <summary>
/// Request DTO for recording a stock movement.
/// </summary>
public record RecordStockMovementRequest(
    [Required] int InventoryBatchId,
    [Required, MaxLength(30)] string MovementType, // StockIn | StockOut | Adjustment | Waste | Sale | Transfer
    [Required] int Quantity, // Positive to add stock, negative to reduce stock
    [MaxLength(255)] string? Reason = null,
    [MaxLength(100)] string? ReferenceNumber = null
);

/// <summary>
/// Query filter parameters for searching stock movements.
/// </summary>
public class StockMovementQueryParams
{
    public int? ProductId { get; set; }
    public int? InventoryBatchId { get; set; }
    public int? UserId { get; set; }
    public string? MovementType { get; set; }
    public DateTime? FromDate { get; set; }
    public DateTime? ToDate { get; set; }

    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;
}

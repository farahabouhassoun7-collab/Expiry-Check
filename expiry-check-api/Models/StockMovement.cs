namespace ExpiryCheckApi.Models;

/// <summary>
/// Immutable audit ledger tracking every stock check-in, check-out, manual adjustment, waste disposal, or sale.
/// </summary>
public class StockMovement
{
    public int Id { get; set; }

    /// <summary>Foreign key for InventoryBatch.</summary>
    public int InventoryBatchId { get; set; }

    /// <summary>InventoryBatch navigation property.</summary>
    public InventoryBatch? InventoryBatch { get; set; }

    /// <summary>Foreign key for Product.</summary>
    public int ProductId { get; set; }

    /// <summary>Product navigation property.</summary>
    public Product? Product { get; set; }

    /// <summary>Foreign key for User performing movement.</summary>
    public int UserId { get; set; }

    /// <summary>User navigation property.</summary>
    public User? User { get; set; }

    /// <summary>Movement Type: StockIn | StockOut | Adjustment | Waste | Sale | Transfer.</summary>
    public string MovementType { get; set; } = "Adjustment";

    /// <summary>Quantity change amount (positive for additions, negative for reductions).</summary>
    public int Quantity { get; set; }

    /// <summary>Batch remaining quantity prior to this movement.</summary>
    public int PreviousQuantity { get; set; }

    /// <summary>Batch remaining quantity after this movement.</summary>
    public int NewQuantity { get; set; }

    /// <summary>Reason or justification for stock adjustment.</summary>
    public string? Reason { get; set; }

    /// <summary>Optional reference ID (PO number, invoice ID, clearance task ID).</summary>
    public string? ReferenceNumber { get; set; }

    /// <summary>Timestamp when movement occurred.</summary>
    public DateTime MovementDate { get; set; } = DateTime.UtcNow;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

namespace ExpiryCheckApi.Models;

/// <summary>
/// Represents an inventory lot or batch of a product with expiration and location tracking.
/// </summary>
public class InventoryBatch
{
    public int Id { get; set; }

    /// <summary>Foreign key for Product.</summary>
    public int ProductId { get; set; }

    /// <summary>Product navigation property.</summary>
    public Product? Product { get; set; }

    /// <summary>Unique batch/lot number per product.</summary>
    public string BatchNumber { get; set; } = string.Empty;

    /// <summary>Optional manufacturing date.</summary>
    public DateTime? ManufacturingDate { get; set; }

    /// <summary>Expiration date of this batch.</summary>
    public DateTime ExpiryDate { get; set; }

    /// <summary>Initial received batch quantity.</summary>
    public int Quantity { get; set; }

    /// <summary>Current remaining batch quantity available in stock.</summary>
    public int RemainingQuantity { get; set; }

    /// <summary>Purchase / unit cost price paid to supplier.</summary>
    public decimal PurchasePrice { get; set; }

    /// <summary>Supplier or vendor name.</summary>
    public string? SupplierName { get; set; }

    /// <summary>Warehouse shelf / aisle / zone location.</summary>
    public string? WarehouseLocation { get; set; }

    /// <summary>Batch status: Active | NearExpiry | Expired | Depleted | Disposed.</summary>
    public string Status { get; set; } = "Active";

    /// <summary>Additional notes or observation regarding batch condition.</summary>
    public string? Notes { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

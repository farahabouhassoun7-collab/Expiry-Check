namespace ExpiryCheckApi.Models;

/// <summary>
/// Represents a product item in the inventory catalog.
/// Contains pricing, classification, SKU, barcode, and safety thresholds.
/// </summary>
public class Product
{
    public int Id { get; set; }

    /// <summary>Stock Keeping Unit (SKU) — unique identifier for inventory management.</summary>
    public string SKU { get; set; } = string.Empty;

    /// <summary>EAN / UPC Barcode number for barcode scanning.</summary>
    public string? Barcode { get; set; }

    /// <summary>Product display title.</summary>
    public string Title { get; set; } = string.Empty;

    /// <summary>Detailed description of the product.</summary>
    public string? Description { get; set; }

    /// <summary>Category foreign key.</summary>
    public int CategoryId { get; set; }

    /// <summary>Category navigation property.</summary>
    public Category? Category { get; set; }

    /// <summary>Selling price per unit.</summary>
    public decimal Price { get; set; }

    /// <summary>Discount percentage currently applied (0 - 100).</summary>
    public decimal DiscountPercentage { get; set; }

    /// <summary>Cost price per unit paid to supplier.</summary>
    public decimal CostPrice { get; set; }

    /// <summary>Rating average (0.0 to 5.0).</summary>
    public decimal Rating { get; set; }

    /// <summary>Weight in kilograms (or unit quantity).</summary>
    public decimal Weight { get; set; }

    /// <summary>Unit of measurement (e.g. 'unit', 'kg', 'g', 'pack', 'box').</summary>
    public string Unit { get; set; } = "unit";

    /// <summary>Brand or manufacturer name.</summary>
    public string? Brand { get; set; }

    /// <summary>Comma-separated tags for filtering (e.g. 'organic, dairy, short-dated').</summary>
    public string? Tags { get; set; }

    /// <summary>Primary image URL / thumbnail.</summary>
    public string? ThumbnailUrl { get; set; }

    /// <summary>JSON array of additional gallery image URLs.</summary>
    public string? ImagesJson { get; set; }

    /// <summary>Minimum inventory safety threshold before low stock trigger.</summary>
    public int MinStockLevel { get; set; } = 5;

    /// <summary>Recommended reorder stock level.</summary>
    public int ReorderLevel { get; set; } = 10;

    /// <summary>Whether the product is currently active in the catalog.</summary>
    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

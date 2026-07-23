namespace ExpiryCheckApi.Models;

/// <summary>
/// Represents a product category (e.g. Dairy, Fresh Produce, Meat &amp; Seafood, Bakery).
/// Supports hierarchical parent-child category structures.
/// </summary>
public class Category
{
    public int Id { get; set; }

    /// <summary>Display name of the category.</summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>Unique URL-safe slug for navigation and filtering.</summary>
    public string Slug { get; set; } = string.Empty;

    /// <summary>Optional category description.</summary>
    public string? Description { get; set; }

    /// <summary>Parent category ID for nested subcategories (null if top-level).</summary>
    public int? ParentCategoryId { get; set; }

    /// <summary>Parent category navigation property.</summary>
    public Category? ParentCategory { get; set; }

    /// <summary>Child subcategories navigation property.</summary>
    public ICollection<Category> SubCategories { get; set; } = new List<Category>();

    /// <summary>Products in this category navigation property.</summary>
    public ICollection<Product> Products { get; set; } = new List<Product>();

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

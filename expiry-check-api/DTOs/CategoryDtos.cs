using System.ComponentModel.DataAnnotations;

namespace ExpiryCheckApi.DTOs;

/// <summary>
/// Response DTO representing a category.
/// </summary>
public record CategoryDto(
    int Id,
    string Name,
    string Slug,
    string? Description,
    int? ParentCategoryId,
    string? ParentCategoryName,
    bool IsActive,
    DateTime CreatedAt,
    DateTime UpdatedAt
);

/// <summary>
/// Request DTO for creating a new product category.
/// </summary>
public record CreateCategoryDto(
    [Required, MaxLength(100)] string Name,
    [MaxLength(100)] string? Slug,
    [MaxLength(500)] string? Description,
    int? ParentCategoryId
);

/// <summary>
/// Request DTO for updating an existing category.
/// </summary>
public record UpdateCategoryDto(
    [Required, MaxLength(100)] string Name,
    [MaxLength(100)] string? Slug,
    [MaxLength(500)] string? Description,
    int? ParentCategoryId,
    bool IsActive
);

using System.Text.Json;
using System.Text.RegularExpressions;
using ExpiryCheckApi.DTOs;
using ExpiryCheckApi.Interfaces;
using ExpiryCheckApi.Models;

namespace ExpiryCheckApi.Services;

public sealed class CategoryService(ICategoryRepository categoryRepo) : ICategoryService
{
    public async Task<IReadOnlyList<CategoryDto>> GetAllAsync(bool activeOnly = false, CancellationToken ct = default)
    {
        var categories = await categoryRepo.GetAllAsync(activeOnly, ct);
        return categories.Select(MapToDto).ToList();
    }

    public async Task<CategoryDto?> GetByIdAsync(int id, CancellationToken ct = default)
    {
        var category = await categoryRepo.GetByIdAsync(id, ct);
        return category is null ? null : MapToDto(category);
    }

    public async Task<CategoryDto> CreateAsync(CreateCategoryDto dto, CancellationToken ct = default)
    {
        var slug = GenerateSlug(string.IsNullOrWhiteSpace(dto.Slug) ? dto.Name : dto.Slug);

        if (await categoryRepo.SlugExistsAsync(slug, null, ct))
            slug = $"{slug}-{Guid.NewGuid().ToString()[..6]}";

        var category = new Category
        {
            Name = dto.Name.Trim(),
            Slug = slug,
            Description = dto.Description?.Trim(),
            ParentCategoryId = dto.ParentCategoryId,
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        };

        var created = await categoryRepo.CreateAsync(category, ct);
        var refreshed = await categoryRepo.GetByIdAsync(created.Id, ct) ?? created;
        return MapToDto(refreshed);
    }

    public async Task<CategoryDto?> UpdateAsync(int id, UpdateCategoryDto dto, CancellationToken ct = default)
    {
        var existing = await categoryRepo.GetByIdAsync(id, ct);
        if (existing is null) return null;

        var slug = GenerateSlug(string.IsNullOrWhiteSpace(dto.Slug) ? dto.Name : dto.Slug);
        if (await categoryRepo.SlugExistsAsync(slug, id, ct))
            slug = $"{slug}-{Guid.NewGuid().ToString()[..6]}";

        existing.Name = dto.Name.Trim();
        existing.Slug = slug;
        existing.Description = dto.Description?.Trim();
        existing.ParentCategoryId = dto.ParentCategoryId;
        existing.IsActive = dto.IsActive;

        await categoryRepo.UpdateAsync(existing, ct);
        var refreshed = await categoryRepo.GetByIdAsync(id, ct) ?? existing;
        return MapToDto(refreshed);
    }

    public async Task<bool> DeleteAsync(int id, CancellationToken ct = default)
    {
        var category = await categoryRepo.GetByIdAsync(id, ct);
        if (category is null) return false;

        await categoryRepo.DeleteAsync(category, ct);
        return true;
    }

    private static CategoryDto MapToDto(Category c) => new(
        c.Id,
        c.Name,
        c.Slug,
        c.Description,
        c.ParentCategoryId,
        c.ParentCategory?.Name,
        c.IsActive,
        c.CreatedAt,
        c.UpdatedAt
    );

    private static string GenerateSlug(string text)
    {
        var str = text.ToLowerInvariant().Trim();
        str = Regex.Replace(str, @"[^a-z0-9\s-]", "");
        str = Regex.Replace(str, @"\s+", "-").Trim('-');
        return string.IsNullOrEmpty(str) ? "category" : str;
    }
}

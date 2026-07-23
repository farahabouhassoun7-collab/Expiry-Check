using System.Text.Json;
using ExpiryCheckApi.DTOs;
using ExpiryCheckApi.Interfaces;
using ExpiryCheckApi.Models;

namespace ExpiryCheckApi.Services;

public sealed class ProductService(
    IProductRepository productRepo,
    ICategoryRepository categoryRepo) : IProductService
{
    public async Task<PagedResult<ProductDto>> GetPagedAsync(ProductQueryParams queryParams, CancellationToken ct = default)
    {
        var result = await productRepo.GetPagedAsync(queryParams, ct);
        var dtos = result.Items.Select(MapToDto).ToList();
        return new PagedResult<ProductDto>(dtos, result.TotalItems, result.Page, result.PageSize, result.TotalPages);
    }

    public async Task<ProductDto?> GetByIdAsync(int id, CancellationToken ct = default)
    {
        var product = await productRepo.GetByIdAsync(id, ct);
        return product is null ? null : MapToDto(product);
    }

    public async Task<ProductDto?> GetBySKUAsync(string sku, CancellationToken ct = default)
    {
        var product = await productRepo.GetBySKUAsync(sku, ct);
        return product is null ? null : MapToDto(product);
    }

    public async Task<ProductDto?> GetByBarcodeAsync(string barcode, CancellationToken ct = default)
    {
        var product = await productRepo.GetByBarcodeAsync(barcode, ct);
        return product is null ? null : MapToDto(product);
    }

    public async Task<ProductDto> CreateAsync(CreateProductDto dto, CancellationToken ct = default)
    {
        if (await productRepo.SKUExistsAsync(dto.SKU, null, ct))
            throw new InvalidOperationException($"Product with SKU '{dto.SKU}' already exists.");

        if (!string.IsNullOrWhiteSpace(dto.Barcode) && await productRepo.BarcodeExistsAsync(dto.Barcode, null, ct))
            throw new InvalidOperationException($"Product with Barcode '{dto.Barcode}' already exists.");

        var category = await categoryRepo.GetByIdAsync(dto.CategoryId, ct)
            ?? throw new KeyNotFoundException($"Category with Id {dto.CategoryId} was not found.");

        var tagsString = dto.Tags is { Length: > 0 } ? string.Join(",", dto.Tags.Select(t => t.Trim())) : null;
        var imagesJson = dto.Images is { Length: > 0 } ? JsonSerializer.Serialize(dto.Images) : null;

        var product = new Product
        {
            SKU = dto.SKU.Trim(),
            Barcode = string.IsNullOrWhiteSpace(dto.Barcode) ? null : dto.Barcode.Trim(),
            Title = dto.Title.Trim(),
            Description = dto.Description?.Trim(),
            CategoryId = dto.CategoryId,
            Price = dto.Price,
            DiscountPercentage = dto.DiscountPercentage,
            CostPrice = dto.CostPrice,
            Rating = dto.Rating,
            Weight = dto.Weight,
            Unit = string.IsNullOrWhiteSpace(dto.Unit) ? "unit" : dto.Unit.Trim(),
            Brand = dto.Brand?.Trim(),
            Tags = tagsString,
            ThumbnailUrl = dto.ThumbnailUrl?.Trim(),
            ImagesJson = imagesJson,
            MinStockLevel = dto.MinStockLevel,
            ReorderLevel = dto.ReorderLevel,
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        };

        var created = await productRepo.CreateAsync(product, ct);
        var refreshed = await productRepo.GetByIdAsync(created.Id, ct) ?? created;
        return MapToDto(refreshed);
    }

    public async Task<ProductDto?> UpdateAsync(int id, UpdateProductDto dto, CancellationToken ct = default)
    {
        var existing = await productRepo.GetByIdAsync(id, ct);
        if (existing is null) return null;

        if (await productRepo.SKUExistsAsync(dto.SKU, id, ct))
            throw new InvalidOperationException($"Product with SKU '{dto.SKU}' already exists.");

        if (!string.IsNullOrWhiteSpace(dto.Barcode) && await productRepo.BarcodeExistsAsync(dto.Barcode, id, ct))
            throw new InvalidOperationException($"Product with Barcode '{dto.Barcode}' already exists.");

        var category = await categoryRepo.GetByIdAsync(dto.CategoryId, ct)
            ?? throw new KeyNotFoundException($"Category with Id {dto.CategoryId} was not found.");

        var tagsString = dto.Tags is { Length: > 0 } ? string.Join(",", dto.Tags.Select(t => t.Trim())) : null;
        var imagesJson = dto.Images is { Length: > 0 } ? JsonSerializer.Serialize(dto.Images) : null;

        existing.SKU = dto.SKU.Trim();
        existing.Barcode = string.IsNullOrWhiteSpace(dto.Barcode) ? null : dto.Barcode.Trim();
        existing.Title = dto.Title.Trim();
        existing.Description = dto.Description?.Trim();
        existing.CategoryId = dto.CategoryId;
        existing.Price = dto.Price;
        existing.DiscountPercentage = dto.DiscountPercentage;
        existing.CostPrice = dto.CostPrice;
        existing.Rating = dto.Rating;
        existing.Weight = dto.Weight;
        existing.Unit = string.IsNullOrWhiteSpace(dto.Unit) ? "unit" : dto.Unit.Trim();
        existing.Brand = dto.Brand?.Trim();
        existing.Tags = tagsString;
        existing.ThumbnailUrl = dto.ThumbnailUrl?.Trim();
        existing.ImagesJson = imagesJson;
        existing.MinStockLevel = dto.MinStockLevel;
        existing.ReorderLevel = dto.ReorderLevel;
        existing.IsActive = dto.IsActive;

        await productRepo.UpdateAsync(existing, ct);
        var refreshed = await productRepo.GetByIdAsync(id, ct) ?? existing;
        return MapToDto(refreshed);
    }

    public async Task<bool> DeleteAsync(int id, CancellationToken ct = default)
    {
        var product = await productRepo.GetByIdAsync(id, ct);
        if (product is null) return false;

        await productRepo.DeleteAsync(product, ct);
        return true;
    }

    private static ProductDto MapToDto(Product p)
    {
        var tags = !string.IsNullOrWhiteSpace(p.Tags)
            ? p.Tags.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
            : Array.Empty<string>();

        string[] images = Array.Empty<string>();
        if (!string.IsNullOrWhiteSpace(p.ImagesJson))
        {
            try
            {
                images = JsonSerializer.Deserialize<string[]>(p.ImagesJson) ?? Array.Empty<string>();
            }
            catch
            {
                images = Array.Empty<string>();
            }
        }

        return new ProductDto(
            p.Id,
            p.SKU,
            p.Barcode,
            p.Title,
            p.Description,
            p.CategoryId,
            p.Category?.Name ?? "Uncategorized",
            p.Price,
            p.DiscountPercentage,
            p.CostPrice,
            p.Rating,
            p.Weight,
            p.Unit,
            p.Brand,
            tags,
            p.ThumbnailUrl,
            images,
            p.MinStockLevel,
            p.ReorderLevel,
            p.IsActive,
            p.CreatedAt,
            p.UpdatedAt
        );
    }
}

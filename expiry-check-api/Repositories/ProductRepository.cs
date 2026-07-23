using ExpiryCheckApi.Data;
using ExpiryCheckApi.DTOs;
using ExpiryCheckApi.Interfaces;
using ExpiryCheckApi.Models;
using Microsoft.EntityFrameworkCore;

namespace ExpiryCheckApi.Repositories;

public sealed class ProductRepository(AppDbContext db) : IProductRepository
{
    public async Task<PagedResult<Product>> GetPagedAsync(ProductQueryParams p, CancellationToken ct = default)
    {
        var query = db.Products
                      .Include(pr => pr.Category)
                      .AsNoTracking();

        if (p.ActiveOnly.HasValue && p.ActiveOnly.Value)
            query = query.Where(pr => pr.IsActive);

        if (!string.IsNullOrWhiteSpace(p.Search))
        {
            var search = p.Search.Trim().ToLower();
            query = query.Where(pr => pr.Title.ToLower().Contains(search) ||
                                      pr.SKU.ToLower().Contains(search) ||
                                      (pr.Barcode != null && pr.Barcode.ToLower().Contains(search)) ||
                                      (pr.Brand != null && pr.Brand.ToLower().Contains(search)) ||
                                      (pr.Tags != null && pr.Tags.ToLower().Contains(search)));
        }

        if (p.CategoryId.HasValue)
            query = query.Where(pr => pr.CategoryId == p.CategoryId.Value);

        if (!string.IsNullOrWhiteSpace(p.Brand))
            query = query.Where(pr => pr.Brand != null && pr.Brand.ToLower() == p.Brand.Trim().ToLower());

        if (p.MinPrice.HasValue)
            query = query.Where(pr => pr.Price >= p.MinPrice.Value);

        if (p.MaxPrice.HasValue)
            query = query.Where(pr => pr.Price <= p.MaxPrice.Value);

        // Sorting
        query = (p.SortBy.ToLower(), p.SortDescending) switch
        {
            ("price", true)   => query.OrderByDescending(pr => pr.Price),
            ("price", false)  => query.OrderBy(pr => pr.Price),
            ("sku", true)     => query.OrderByDescending(pr => pr.SKU),
            ("sku", false)    => query.OrderBy(pr => pr.SKU),
            ("date", true)    => query.OrderByDescending(pr => pr.CreatedAt),
            ("date", false)   => query.OrderBy(pr => pr.CreatedAt),
            ("title", true)   => query.OrderByDescending(pr => pr.Title),
            _                 => query.OrderBy(pr => pr.Title),
        };

        var totalItems = await query.CountAsync(ct);

        var page = Math.Max(1, p.Page);
        var pageSize = Math.Clamp(p.PageSize, 1, 100);
        var totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);

        var items = await query.Skip((page - 1) * pageSize)
                               .Take(pageSize)
                               .ToListAsync(ct);

        return new PagedResult<Product>(items, totalItems, page, pageSize, totalPages);
    }

    public Task<Product?> GetByIdAsync(int id, CancellationToken ct = default)
        => db.Products
             .Include(pr => pr.Category)
             .AsNoTracking()
             .FirstOrDefaultAsync(pr => pr.Id == id, ct);

    public Task<Product?> GetBySKUAsync(string sku, CancellationToken ct = default)
        => db.Products
             .Include(pr => pr.Category)
             .AsNoTracking()
             .FirstOrDefaultAsync(pr => pr.SKU.ToLower() == sku.Trim().ToLower(), ct);

    public Task<Product?> GetByBarcodeAsync(string barcode, CancellationToken ct = default)
        => db.Products
             .Include(pr => pr.Category)
             .AsNoTracking()
             .FirstOrDefaultAsync(pr => pr.Barcode != null && pr.Barcode.ToLower() == barcode.Trim().ToLower(), ct);

    public Task<bool> SKUExistsAsync(string sku, int? excludeId = null, CancellationToken ct = default)
        => db.Products
             .AnyAsync(pr => pr.SKU.ToLower() == sku.Trim().ToLower() && (!excludeId.HasValue || pr.Id != excludeId.Value), ct);

    public Task<bool> BarcodeExistsAsync(string barcode, int? excludeId = null, CancellationToken ct = default)
        => db.Products
             .AnyAsync(pr => pr.Barcode != null && pr.Barcode.ToLower() == barcode.Trim().ToLower() && (!excludeId.HasValue || pr.Id != excludeId.Value), ct);

    public async Task<Product> CreateAsync(Product product, CancellationToken ct = default)
    {
        db.Products.Add(product);
        await db.SaveChangesAsync(ct);
        return product;
    }

    public async Task UpdateAsync(Product product, CancellationToken ct = default)
    {
        product.UpdatedAt = DateTime.UtcNow;
        db.Products.Update(product);
        await db.SaveChangesAsync(ct);
    }

    public async Task DeleteAsync(Product product, CancellationToken ct = default)
    {
        db.Products.Remove(product);
        await db.SaveChangesAsync(ct);
    }
}

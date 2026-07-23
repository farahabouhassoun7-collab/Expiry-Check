using ExpiryCheckApi.Data;
using ExpiryCheckApi.Interfaces;
using ExpiryCheckApi.Models;
using Microsoft.EntityFrameworkCore;

namespace ExpiryCheckApi.Repositories;

public sealed class CategoryRepository(AppDbContext db) : ICategoryRepository
{
    public async Task<IReadOnlyList<Category>> GetAllAsync(bool activeOnly = false, CancellationToken ct = default)
    {
        var query = db.Categories
                      .Include(c => c.ParentCategory)
                      .AsNoTracking();

        if (activeOnly)
            query = query.Where(c => c.IsActive);

        return await query.OrderBy(c => c.Name).ToListAsync(ct);
    }

    public Task<Category?> GetByIdAsync(int id, CancellationToken ct = default)
        => db.Categories
             .Include(c => c.ParentCategory)
             .Include(c => c.SubCategories)
             .AsNoTracking()
             .FirstOrDefaultAsync(c => c.Id == id, ct);

    public Task<Category?> GetBySlugAsync(string slug, CancellationToken ct = default)
        => db.Categories
             .Include(c => c.ParentCategory)
             .AsNoTracking()
             .FirstOrDefaultAsync(c => c.Slug.ToLower() == slug.ToLower(), ct);

    public Task<bool> SlugExistsAsync(string slug, int? excludeId = null, CancellationToken ct = default)
        => db.Categories
             .AnyAsync(c => c.Slug.ToLower() == slug.ToLower() && (!excludeId.HasValue || c.Id != excludeId.Value), ct);

    public async Task<Category> CreateAsync(Category category, CancellationToken ct = default)
    {
        db.Categories.Add(category);
        await db.SaveChangesAsync(ct);
        return category;
    }

    public async Task UpdateAsync(Category category, CancellationToken ct = default)
    {
        category.UpdatedAt = DateTime.UtcNow;
        db.Categories.Update(category);
        await db.SaveChangesAsync(ct);
    }

    public async Task DeleteAsync(Category category, CancellationToken ct = default)
    {
        db.Categories.Remove(category);
        await db.SaveChangesAsync(ct);
    }
}

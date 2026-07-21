using ExpiryCheckApi.Data;
using ExpiryCheckApi.Interfaces;
using ExpiryCheckApi.Models;
using Microsoft.EntityFrameworkCore;

namespace ExpiryCheckApi.Repositories;

/// <summary>
/// EF Core implementation of <see cref="IUserRepository"/>.
/// All database access lives here — no business logic.
/// </summary>
public sealed class UserRepository(AppDbContext db) : IUserRepository
{
    /// <inheritdoc/>
    public Task<User?> GetByEmailAsync(string email, CancellationToken ct = default)
        => db.Users
             .AsNoTracking()
             .FirstOrDefaultAsync(u => u.Email.ToLower() == email.ToLower(), ct);

    /// <inheritdoc/>
    public Task<User?> GetByIdAsync(int id, CancellationToken ct = default)
        => db.Users
             .AsNoTracking()
             .FirstOrDefaultAsync(u => u.Id == id, ct);

    /// <inheritdoc/>
    public Task<bool> EmailExistsAsync(string email, CancellationToken ct = default)
        => db.Users
             .AnyAsync(u => u.Email.ToLower() == email.ToLower(), ct);

    /// <inheritdoc/>
    public async Task<User> CreateAsync(User user, CancellationToken ct = default)
    {
        db.Users.Add(user);
        await db.SaveChangesAsync(ct);
        return user;
    }

    /// <inheritdoc/>
    public async Task UpdateAsync(User user, CancellationToken ct = default)
    {
        db.Users.Update(user);
        await db.SaveChangesAsync(ct);
    }
}

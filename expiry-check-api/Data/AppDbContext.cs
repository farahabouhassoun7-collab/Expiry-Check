using ExpiryCheckApi.Models;
using Microsoft.EntityFrameworkCore;

namespace ExpiryCheckApi.Data;

/// <summary>
/// Entity Framework Core database context for the ExpiryCheck application.
/// </summary>
public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // ── Users table ─────────────────────────────────────────────
        builder.Entity<User>(entity =>
        {
            entity.ToTable("Users");

            entity.HasKey(u => u.Id);

            entity.Property(u => u.Email)
                  .IsRequired()
                  .HasMaxLength(256);

            entity.HasIndex(u => u.Email)
                  .IsUnique();

            entity.Property(u => u.FirstName)
                  .IsRequired()
                  .HasMaxLength(100);

            entity.Property(u => u.LastName)
                  .IsRequired()
                  .HasMaxLength(100);

            entity.Property(u => u.PasswordHash)
                  .IsRequired();

            entity.Property(u => u.Role)
                  .IsRequired()
                  .HasMaxLength(50)
                  .HasDefaultValue("Employee");

            entity.Property(u => u.CreatedAt)
                  .HasDefaultValueSql("GETUTCDATE()");

            entity.Property(u => u.UpdatedAt)
                  .HasDefaultValueSql("GETUTCDATE()");

            entity.Property(u => u.IsActive)
                  .HasDefaultValue(true);
        });
    }
}

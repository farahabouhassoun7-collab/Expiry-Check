using ExpiryCheckApi.Models;
using Microsoft.EntityFrameworkCore;

namespace ExpiryCheckApi.Data;

/// <summary>
/// Entity Framework Core database context for the ExpiryCheck application.
/// </summary>
public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Product> Products => Set<Product>();
    public DbSet<InventoryBatch> InventoryBatches => Set<InventoryBatch>();
    public DbSet<StockMovement> StockMovements => Set<StockMovement>();

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

        // ── Categories table ─────────────────────────────────────────
        builder.Entity<Category>(entity =>
        {
            entity.ToTable("Categories");

            entity.HasKey(c => c.Id);

            entity.Property(c => c.Name)
                  .IsRequired()
                  .HasMaxLength(100);

            entity.Property(c => c.Slug)
                  .IsRequired()
                  .HasMaxLength(100);

            entity.HasIndex(c => c.Slug)
                  .IsUnique();

            entity.Property(c => c.Description)
                  .HasMaxLength(500);

            entity.Property(c => c.IsActive)
                  .HasDefaultValue(true);

            entity.Property(c => c.CreatedAt)
                  .HasDefaultValueSql("GETUTCDATE()");

            entity.Property(c => c.UpdatedAt)
                  .HasDefaultValueSql("GETUTCDATE()");

            entity.HasOne(c => c.ParentCategory)
                  .WithMany(c => c.SubCategories)
                  .HasForeignKey(c => c.ParentCategoryId)
                  .OnDelete(DeleteBehavior.NoAction);
        });

        // ── Products table ───────────────────────────────────────────
        builder.Entity<Product>(entity =>
        {
            entity.ToTable("Products");

            entity.HasKey(p => p.Id);

            entity.Property(p => p.SKU)
                  .IsRequired()
                  .HasMaxLength(50);

            entity.HasIndex(p => p.SKU)
                  .IsUnique();

            entity.Property(p => p.Barcode)
                  .HasMaxLength(100);

            entity.HasIndex(p => p.Barcode)
                  .IsUnique()
                  .HasFilter("[Barcode] IS NOT NULL");

            entity.Property(p => p.Title)
                  .IsRequired()
                  .HasMaxLength(200);

            entity.HasIndex(p => p.Title);

            entity.Property(p => p.Price)
                  .HasColumnType("decimal(18,2)")
                  .HasDefaultValue(0.00m);

            entity.Property(p => p.DiscountPercentage)
                  .HasColumnType("decimal(5,2)")
                  .HasDefaultValue(0.00m);

            entity.Property(p => p.CostPrice)
                  .HasColumnType("decimal(18,2)")
                  .HasDefaultValue(0.00m);

            entity.Property(p => p.Rating)
                  .HasColumnType("decimal(3,2)")
                  .HasDefaultValue(0.00m);

            entity.Property(p => p.Weight)
                  .HasColumnType("decimal(18,3)")
                  .HasDefaultValue(0.000m);

            entity.Property(p => p.Unit)
                  .IsRequired()
                  .HasMaxLength(20)
                  .HasDefaultValue("unit");

            entity.Property(p => p.Brand)
                  .HasMaxLength(100);

            entity.Property(p => p.Tags)
                  .HasMaxLength(500);

            entity.Property(p => p.ThumbnailUrl)
                  .HasMaxLength(1000);

            entity.Property(p => p.MinStockLevel)
                  .HasDefaultValue(5);

            entity.Property(p => p.ReorderLevel)
                  .HasDefaultValue(10);

            entity.Property(p => p.IsActive)
                  .HasDefaultValue(true);

            entity.Property(p => p.CreatedAt)
                  .HasDefaultValueSql("GETUTCDATE()");

            entity.Property(p => p.UpdatedAt)
                  .HasDefaultValueSql("GETUTCDATE()");

            entity.HasOne(p => p.Category)
                  .WithMany(c => c.Products)
                  .HasForeignKey(p => p.CategoryId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        // ── InventoryBatches table ───────────────────────────────────
        builder.Entity<InventoryBatch>(entity =>
        {
            entity.ToTable("InventoryBatches");

            entity.HasKey(b => b.Id);

            entity.Property(b => b.BatchNumber)
                  .IsRequired()
                  .HasMaxLength(100);

            entity.HasIndex(b => new { b.ProductId, b.BatchNumber })
                  .IsUnique();

            entity.Property(b => b.Quantity)
                  .IsRequired();

            entity.Property(b => b.RemainingQuantity)
                  .IsRequired();

            entity.Property(b => b.PurchasePrice)
                  .HasColumnType("decimal(18,2)")
                  .HasDefaultValue(0.00m);

            entity.Property(b => b.SupplierName)
                  .HasMaxLength(150);

            entity.Property(b => b.WarehouseLocation)
                  .HasMaxLength(100);

            entity.Property(b => b.Status)
                  .IsRequired()
                  .HasMaxLength(30)
                  .HasDefaultValue("Active");

            entity.Property(b => b.Notes)
                  .HasMaxLength(2000);

            entity.Property(b => b.CreatedAt)
                  .HasDefaultValueSql("GETUTCDATE()");

            entity.Property(b => b.UpdatedAt)
                  .HasDefaultValueSql("GETUTCDATE()");

            entity.HasOne(b => b.Product)
                  .WithMany()
                  .HasForeignKey(b => b.ProductId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // ── StockMovements table ─────────────────────────────────────
        builder.Entity<StockMovement>(entity =>
        {
            entity.ToTable("StockMovements");

            entity.HasKey(sm => sm.Id);

            entity.Property(sm => sm.MovementType)
                  .IsRequired()
                  .HasMaxLength(30)
                  .HasDefaultValue("Adjustment");

            entity.Property(sm => sm.Reason)
                  .HasMaxLength(255);

            entity.Property(sm => sm.ReferenceNumber)
                  .HasMaxLength(100);

            entity.Property(sm => sm.MovementDate)
                  .HasDefaultValueSql("GETUTCDATE()");

            entity.Property(sm => sm.CreatedAt)
                  .HasDefaultValueSql("GETUTCDATE()");

            entity.HasIndex(sm => sm.ProductId);
            entity.HasIndex(sm => sm.InventoryBatchId);
            entity.HasIndex(sm => sm.UserId);
            entity.HasIndex(sm => sm.MovementDate);

            entity.HasOne(sm => sm.InventoryBatch)
                  .WithMany()
                  .HasForeignKey(sm => sm.InventoryBatchId)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(sm => sm.Product)
                  .WithMany()
                  .HasForeignKey(sm => sm.ProductId)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(sm => sm.User)
                  .WithMany()
                  .HasForeignKey(sm => sm.UserId)
                  .OnDelete(DeleteBehavior.Restrict);
        });
    }
}

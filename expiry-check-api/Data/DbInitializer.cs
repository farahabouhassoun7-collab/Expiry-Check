using ExpiryCheckApi.Models;

namespace ExpiryCheckApi.Data;

/// <summary>
/// Database initializer that seeds default categories, products, and inventory batches if the DB is empty.
/// </summary>
public static class DbInitializer
{
    public static async Task SeedAsync(AppDbContext db)
    {
        // ── 1. Seed Categories ──────────────────────────────────────────
        if (!db.Categories.Any())
        {
            var categories = new List<Category>
            {
                new() { Name = "Dairy & Eggs", Slug = "dairy-eggs", Description = "Fresh dairy products, cheeses, yogurts, and eggs" },
                new() { Name = "Bakery & Pastry", Slug = "bakery-pastry", Description = "Artisan breads, pastries, and baked goods" },
                new() { Name = "Fresh Produce", Slug = "fresh-produce", Description = "Organic fruits, vegetables, and leafy greens" },
                new() { Name = "Meat & Seafood", Slug = "meat-seafood", Description = "Fresh meats, poultry, and seafood fillets" },
                new() { Name = "Pantry & Oils", Slug = "pantry-oils", Description = "Olive oils, condiments, and dry grains" },
            };

            db.Categories.AddRange(categories);
            await db.SaveChangesAsync();
        }

        var catDairy = db.Categories.FirstOrDefault(c => c.Slug == "dairy-eggs");
        var catBakery = db.Categories.FirstOrDefault(c => c.Slug == "bakery-pastry");
        var catProduce = db.Categories.FirstOrDefault(c => c.Slug == "fresh-produce");
        var catMeat = db.Categories.FirstOrDefault(c => c.Slug == "meat-seafood");
        var catPantry = db.Categories.FirstOrDefault(c => c.Slug == "pantry-oils");

        // ── 2. Seed Products ────────────────────────────────────────────
        if (!db.Products.Any() && catDairy != null)
        {
            var products = new List<Product>
            {
                new()
                {
                    SKU = "DG-293",
                    Barcode = "7622210001010",
                    Title = "Organic Greek Yogurt 500g",
                    Description = "Creamy, traditional organic Greek yogurt packed with protein.",
                    CategoryId = catDairy.Id,
                    Price = 4.99m,
                    DiscountPercentage = 15m,
                    CostPrice = 2.50m,
                    Rating = 4.8m,
                    Weight = 0.5m,
                    Unit = "pack",
                    Brand = "GreenFields",
                    Tags = "organic,dairy,yogurt,protein",
                    ThumbnailUrl = "https://images.unsplash.com/photo-1488477181946-6428a0291777",
                    ImagesJson = "[\"https://images.unsplash.com/photo-1488477181946-6428a0291777\"]",
                    MinStockLevel = 15,
                    ReorderLevel = 30,
                    IsActive = true,
                },
                new()
                {
                    SKU = "BK-441",
                    Barcode = "7622210002027",
                    Title = "Artisan Sourdough Bread",
                    Description = "Naturally fermented sourdough bread with a crispy crust and tender crumb.",
                    CategoryId = catBakery?.Id ?? catDairy.Id,
                    Price = 3.50m,
                    DiscountPercentage = 20m,
                    CostPrice = 1.20m,
                    Rating = 4.9m,
                    Weight = 0.6m,
                    Unit = "loaf",
                    Brand = "BakeHouse",
                    Tags = "bakery,sourdough,artisan,fresh",
                    ThumbnailUrl = "https://images.unsplash.com/photo-1509440159596-0249088772ff",
                    ImagesJson = "[\"https://images.unsplash.com/photo-1509440159596-0249088772ff\"]",
                    MinStockLevel = 10,
                    ReorderLevel = 20,
                    IsActive = true,
                },
                new()
                {
                    SKU = "SF-102",
                    Barcode = "7622210003034",
                    Title = "Atlantic Salmon Fillets 400g",
                    Description = "Freshly caught Atlantic salmon fillets, rich in Omega-3.",
                    CategoryId = catMeat?.Id ?? catDairy.Id,
                    Price = 14.99m,
                    DiscountPercentage = 25m,
                    CostPrice = 8.50m,
                    Rating = 4.7m,
                    Weight = 0.4m,
                    Unit = "pack",
                    Brand = "OceanFresh",
                    Tags = "seafood,salmon,fresh,fish",
                    ThumbnailUrl = "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2",
                    ImagesJson = "[\"https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2\"]",
                    MinStockLevel = 5,
                    ReorderLevel = 12,
                    IsActive = true,
                },
                new()
                {
                    SKU = "OO-882",
                    Barcode = "7622210004041",
                    Title = "Extra Virgin Olive Oil 750ml",
                    Description = "Cold-pressed extra virgin olive oil from Mediterranean olives.",
                    CategoryId = catPantry?.Id ?? catDairy.Id,
                    Price = 12.99m,
                    DiscountPercentage = 0m,
                    CostPrice = 7.00m,
                    Rating = 4.9m,
                    Weight = 0.75m,
                    Unit = "bottle",
                    Brand = "OliveGrove",
                    Tags = "pantry,oil,olive,mediterranean",
                    ThumbnailUrl = "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5",
                    ImagesJson = "[\"https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5\"]",
                    MinStockLevel = 8,
                    ReorderLevel = 15,
                    IsActive = true,
                },
                new()
                {
                    SKU = "FP-309",
                    Barcode = "7622210005058",
                    Title = "Organic Hydroponic Strawberries 250g",
                    Description = "Sweet and juicy hydroponic strawberries grown without pesticides.",
                    CategoryId = catProduce?.Id ?? catDairy.Id,
                    Price = 3.99m,
                    DiscountPercentage = 10m,
                    CostPrice = 1.80m,
                    Rating = 4.6m,
                    Weight = 0.25m,
                    Unit = "box",
                    Brand = "GreenFarm",
                    Tags = "fruit,organic,strawberries,fresh",
                    ThumbnailUrl = "https://images.unsplash.com/photo-1464965911861-746a04b4bca6",
                    ImagesJson = "[\"https://images.unsplash.com/photo-1464965911861-746a04b4bca6\"]",
                    MinStockLevel = 12,
                    ReorderLevel = 25,
                    IsActive = true,
                },
                new()
                {
                    SKU = "MK-101",
                    Barcode = "7622210006065",
                    Title = "Grass-Fed Whole Milk 1L",
                    Description = "Pure pasteurized whole milk from grass-fed cows.",
                    CategoryId = catDairy.Id,
                    Price = 2.49m,
                    DiscountPercentage = 0m,
                    CostPrice = 1.10m,
                    Rating = 4.8m,
                    Weight = 1.0m,
                    Unit = "liter",
                    Brand = "GreenFields",
                    Tags = "dairy,milk,whole,fresh",
                    ThumbnailUrl = "https://images.unsplash.com/photo-1550583724-b2692b85b150",
                    ImagesJson = "[\"https://images.unsplash.com/photo-1550583724-b2692b85b150\"]",
                    MinStockLevel = 20,
                    ReorderLevel = 40,
                    IsActive = true,
                }
            };

            db.Products.AddRange(products);
            await db.SaveChangesAsync();
        }

        // ── 3. Seed Inventory Batches ───────────────────────────────────
        if (!db.InventoryBatches.Any())
        {
            var pGreekYogurt = db.Products.FirstOrDefault(p => p.SKU == "DG-293");
            var pSourdough   = db.Products.FirstOrDefault(p => p.SKU == "BK-441");
            var pSalmon      = db.Products.FirstOrDefault(p => p.SKU == "SF-102");
            var pStrawberries = db.Products.FirstOrDefault(p => p.SKU == "FP-309");
            var pMilk        = db.Products.FirstOrDefault(p => p.SKU == "MK-101");

            var now = DateTime.UtcNow;

            var batches = new List<InventoryBatch>();

            if (pGreekYogurt != null)
            {
                batches.Add(new InventoryBatch
                {
                    ProductId = pGreekYogurt.Id,
                    BatchNumber = "LOT-GY-2026-A",
                    ManufacturingDate = now.AddDays(-10),
                    ExpiryDate = now.AddDays(3), // Expiring in 3 days (Critical / Near Expiry)
                    Quantity = 200,
                    RemainingQuantity = 45,
                    PurchasePrice = 2.50m,
                    SupplierName = "GreenFields Dairy",
                    WarehouseLocation = "Fridge Unit 1 - Shelf A",
                    Status = "NearExpiry",
                    Notes = "Near expiry batch — recommended for clearance bundle"
                });
            }

            if (pSourdough != null)
            {
                batches.Add(new InventoryBatch
                {
                    ProductId = pSourdough.Id,
                    BatchNumber = "LOT-BK-2026-B",
                    ManufacturingDate = now.AddDays(-2),
                    ExpiryDate = now.AddDays(1), // Expiring tomorrow
                    Quantity = 50,
                    RemainingQuantity = 12,
                    PurchasePrice = 1.20m,
                    SupplierName = "BakeHouse Co",
                    WarehouseLocation = "Bakery Counter 2",
                    Status = "NearExpiry",
                    Notes = "End-of-day 50% discount trigger candidate"
                });
            }

            if (pSalmon != null)
            {
                batches.Add(new InventoryBatch
                {
                    ProductId = pSalmon.Id,
                    BatchNumber = "LOT-SF-2026-C",
                    ManufacturingDate = now.AddDays(-5),
                    ExpiryDate = now.AddDays(2), // Expiring in 2 days
                    Quantity = 40,
                    RemainingQuantity = 8,
                    PurchasePrice = 8.50m,
                    SupplierName = "OceanFresh Ltd",
                    WarehouseLocation = "Chilled Display 3",
                    Status = "NearExpiry",
                    Notes = "Immediate markdown recommended"
                });
            }

            if (pStrawberries != null)
            {
                batches.Add(new InventoryBatch
                {
                    ProductId = pStrawberries.Id,
                    BatchNumber = "LOT-FP-2026-D",
                    ManufacturingDate = now.AddDays(-4),
                    ExpiryDate = now.AddDays(5),
                    Quantity = 80,
                    RemainingQuantity = 22,
                    PurchasePrice = 1.80m,
                    SupplierName = "GreenFarm Hydroponics",
                    WarehouseLocation = "Produce Rack 1",
                    Status = "NearExpiry",
                    Notes = "High priority seasonal produce"
                });
            }

            if (pMilk != null)
            {
                batches.Add(new InventoryBatch
                {
                    ProductId = pMilk.Id,
                    BatchNumber = "LOT-MK-2026-E",
                    ManufacturingDate = now.AddDays(-3),
                    ExpiryDate = now.AddDays(18), // Healthy batch
                    Quantity = 150,
                    RemainingQuantity = 120,
                    PurchasePrice = 1.10m,
                    SupplierName = "GreenFields Dairy",
                    WarehouseLocation = "Walk-in Cooler B",
                    Status = "Active",
                    Notes = "Fresh stock batch"
                });
            }

            db.InventoryBatches.AddRange(batches);
            await db.SaveChangesAsync();
        }
    }
}

using ExpiryCheckApi.Data;
using Microsoft.EntityFrameworkCore;

namespace ExpiryCheckApi.Services.Background;

/// <summary>
/// Background Hosted Service that periodically scans database inventory batches,
/// automatically updates expired status, and logs warning alerts for near-expiry items.
/// </summary>
public sealed class ExpiryCheckBackgroundService(
    IServiceProvider serviceProvider,
    ILogger<ExpiryCheckBackgroundService> logger) : BackgroundService
{
    private readonly TimeSpan _checkInterval = TimeSpan.FromHours(6); // Scans every 6 hours

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        logger.LogInformation("🚀 ExpiryCheck Background Monitoring Service started.");

        while (!stoppingToken.IsCancellationRequested)
        {
            try {
                await PerformExpiryCheckAsync(stoppingToken);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "❌ Error occurred during background expiry check task.");
            }

            await Task.Delay(_checkInterval, stoppingToken);
        }

        logger.LogInformation("🛑 ExpiryCheck Background Monitoring Service stopped.");
    }

    private async Task PerformExpiryCheckAsync(CancellationToken ct)
    {
        using var scope = serviceProvider.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        var now = DateTime.UtcNow;

        // 1. Find batches that have expired but are not yet marked as 'Expired'
        var expiredBatches = await db.InventoryBatches
            .Where(b => b.ExpiryDate <= now && b.Status != "Expired")
            .ToListAsync(ct);

        if (expiredBatches.Count > 0)
        {
            foreach (var batch in expiredBatches)
            {
                batch.Status = "Expired";
                batch.UpdatedAt = now;
            }

            await db.SaveChangesAsync(ct);
            logger.LogWarning("⚠️ Marked {Count} inventory batches as 'Expired'.", expiredBatches.Count);
        }

        // 2. Count critical batches (expiring in <= 3 days)
        var criticalThreshold = now.AddDays(3);
        var criticalCount = await db.InventoryBatches
            .CountAsync(b => b.ExpiryDate > now && b.ExpiryDate <= criticalThreshold && b.RemainingQuantity > 0, ct);

        if (criticalCount > 0)
        {
            logger.LogWarning("🔔 Alert: {Count} batches are expiring within 3 days!", criticalCount);
        }
    }
}

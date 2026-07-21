using System.Net;
using System.Text.Json;

namespace ExpiryCheckApi.Middleware;

/// <summary>
/// Global exception handler — returns a consistent JSON error envelope
/// instead of leaking stack traces to clients.
/// </summary>
public sealed class ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
{
    public async Task InvokeAsync(HttpContext ctx)
    {
        try
        {
            await next(ctx);
        }
        catch (InvalidOperationException ex)
        {
            // Business rule violations (e.g. duplicate email) → 409 Conflict
            logger.LogWarning(ex, "Business rule violation: {Message}", ex.Message);
            await WriteErrorAsync(ctx, HttpStatusCode.Conflict, ex.Message);
        }
        catch (UnauthorizedAccessException ex)
        {
            logger.LogWarning(ex, "Unauthorized: {Message}", ex.Message);
            await WriteErrorAsync(ctx, HttpStatusCode.Unauthorized, ex.Message);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Unhandled exception");
            await WriteErrorAsync(ctx, HttpStatusCode.InternalServerError,
                "An unexpected error occurred. Please try again later.");
        }
    }

    // ── Helper ───────────────────────────────────────────────────

    private static Task WriteErrorAsync(HttpContext ctx, HttpStatusCode status, string message)
    {
        ctx.Response.ContentType = "application/json";
        ctx.Response.StatusCode  = (int)status;

        var body = JsonSerializer.Serialize(new
        {
            success   = false,
            statusCode = (int)status,
            message,
            timestamp  = DateTime.UtcNow,
        });

        return ctx.Response.WriteAsync(body);
    }
}

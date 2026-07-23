using System.Security.Claims;
using ExpiryCheckApi.DTOs;
using ExpiryCheckApi.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ExpiryCheckApi.Controllers;

/// <summary>
/// Stock Movements &amp; Audit Ledger API for logging and tracking inventory check-ins, check-outs, adjustments, and waste.
/// </summary>
[ApiController]
[Route("api/stock-movements")]
[Produces("application/json")]
[Authorize]
public sealed class StockMovementsController(IStockMovementService stockMovementService) : ControllerBase
{
    /// <summary>Get paginated stock movement audit log with filters.</summary>
    /// <param name="queryParams">Filter and pagination parameters.</param>
    /// <param name="ct">Cancellation token.</param>
    /// <response code="200">Paginated list of stock movements.</response>
    [HttpGet]
    [AllowAnonymous]
    [ProducesResponseType(typeof(PagedResult<StockMovementResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetPaged([FromQuery] StockMovementQueryParams queryParams, CancellationToken ct)
    {
        var result = await stockMovementService.GetPagedAsync(queryParams, ct);
        return Ok(result);
    }

    /// <summary>Get stock movement entry by ID.</summary>
    /// <param name="id">Stock movement ID.</param>
    /// <param name="ct">Cancellation token.</param>
    /// <response code="200">Movement details.</response>
    /// <response code="404">Movement not found.</response>
    [HttpGet("{id:int}")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(StockMovementResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(int id, CancellationToken ct)
    {
        var movement = await stockMovementService.GetByIdAsync(id, ct);
        return movement is null ? NotFound(new { message = $"Stock movement entry with ID {id} not found." }) : Ok(movement);
    }

    /// <summary>Get stock movements for a specific inventory batch.</summary>
    /// <param name="batchId">Inventory Batch ID.</param>
    /// <param name="ct">Cancellation token.</param>
    /// <response code="200">List of batch stock movements.</response>
    [HttpGet("batch/{batchId:int}")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(IReadOnlyList<StockMovementResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetByBatchId(int batchId, CancellationToken ct)
    {
        var movements = await stockMovementService.GetByBatchIdAsync(batchId, ct);
        return Ok(movements);
    }

    /// <summary>Get stock movements for a specific product.</summary>
    /// <param name="productId">Product ID.</param>
    /// <param name="ct">Cancellation token.</param>
    /// <response code="200">List of product stock movements.</response>
    [HttpGet("product/{productId:int}")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(IReadOnlyList<StockMovementResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetByProductId(int productId, CancellationToken ct)
    {
        var movements = await stockMovementService.GetByProductIdAsync(productId, ct);
        return Ok(movements);
    }

    /// <summary>Record a stock movement and automatically adjust batch quantity.</summary>
    /// <param name="request">Stock movement details.</param>
    /// <param name="ct">Cancellation token.</param>
    /// <response code="201">Stock movement recorded successfully.</response>
    /// <response code="400">Validation error or insufficient stock.</response>
    [HttpPost]
    [Authorize(Roles = "Admin,Manager,Employee")]
    [ProducesResponseType(typeof(StockMovementResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> RecordMovement([FromBody] RecordStockMovementRequest request, CancellationToken ct)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        int userId = int.TryParse(userIdClaim, out var parsedId) ? parsedId : 1;

        try
        {
            var created = await stockMovementService.RecordMovementAsync(userId, request, ct);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (KeyNotFoundException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}

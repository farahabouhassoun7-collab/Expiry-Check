using ExpiryCheckApi.DTOs;
using ExpiryCheckApi.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ExpiryCheckApi.Controllers;

/// <summary>
/// Inventory and Expiry Tracking API for managing batch quantities, expiration dates, and low-stock alerts.
/// </summary>
[ApiController]
[Route("api/inventory")]
[Produces("application/json")]
[Authorize]
public sealed class InventoryController(IInventoryService inventoryService) : ControllerBase
{
    /// <summary>Get paginated inventory batches with filters.</summary>
    /// <param name="queryParams">Filter and pagination parameters.</param>
    /// <param name="ct">Cancellation token.</param>
    /// <response code="200">Paginated list of inventory batches.</response>
    [HttpGet]
    [AllowAnonymous]
    [ProducesResponseType(typeof(PagedResult<InventoryBatchResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetPaged([FromQuery] InventoryQueryParams queryParams, CancellationToken ct)
    {
        var result = await inventoryService.GetPagedAsync(queryParams, ct);
        return Ok(result);
    }

    /// <summary>Get inventory batch by ID.</summary>
    /// <param name="id">Inventory batch ID.</param>
    /// <param name="ct">Cancellation token.</param>
    /// <response code="200">Batch details.</response>
    /// <response code="404">Batch not found.</response>
    [HttpGet("{id:int}")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(InventoryBatchResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(int id, CancellationToken ct)
    {
        var batch = await inventoryService.GetByIdAsync(id, ct);
        return batch is null ? NotFound(new { message = $"Inventory batch with ID {id} not found." }) : Ok(batch);
    }

    /// <summary>Get all inventory batches for a specific product.</summary>
    /// <param name="productId">Product ID.</param>
    /// <param name="ct">Cancellation token.</param>
    /// <response code="200">List of product batches.</response>
    [HttpGet("product/{productId:int}")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(IReadOnlyList<InventoryBatchResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetByProductId(int productId, CancellationToken ct)
    {
        var batches = await inventoryService.GetByProductIdAsync(productId, ct);
        return Ok(batches);
    }

    /// <summary>Get inventory batches expiring within a threshold number of days (default 30 days).</summary>
    /// <param name="days">Threshold days until expiry.</param>
    /// <param name="ct">Cancellation token.</param>
    /// <response code="200">List of expiring inventory batches.</response>
    [HttpGet("expiring")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(IReadOnlyList<InventoryBatchResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetExpiring([FromQuery] int days = 30, CancellationToken ct = default)
    {
        var batches = await inventoryService.GetExpiringBatchesAsync(days, ct);
        return Ok(batches);
    }

    /// <summary>Get expired inventory batches (ExpiryDate &lt;= NOW).</summary>
    /// <param name="ct">Cancellation token.</param>
    /// <response code="200">List of expired inventory batches.</response>
    [HttpGet("expired")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(IReadOnlyList<InventoryBatchResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetExpired(CancellationToken ct)
    {
        var batches = await inventoryService.GetExpiredBatchesAsync(ct);
        return Ok(batches);
    }

    /// <summary>Get inventory batches with low remaining stock levels.</summary>
    /// <param name="ct">Cancellation token.</param>
    /// <response code="200">List of low-stock inventory batches.</response>
    [HttpGet("low-stock")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(IReadOnlyList<InventoryBatchResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetLowStock(CancellationToken ct)
    {
        var batches = await inventoryService.GetLowStockBatchesAsync(ct);
        return Ok(batches);
    }

    /// <summary>Create a new inventory batch for a product.</summary>
    /// <param name="request">Batch creation details.</param>
    /// <param name="ct">Cancellation token.</param>
    /// <response code="201">Batch created successfully.</response>
    /// <response code="400">Validation error or business rule violation.</response>
    [HttpPost]
    [Authorize(Roles = "Admin,Manager")]
    [ProducesResponseType(typeof(InventoryBatchResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create([FromBody] CreateInventoryBatchRequest request, CancellationToken ct)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            var created = await inventoryService.CreateAsync(request, ct);
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

    /// <summary>Update an existing inventory batch.</summary>
    /// <param name="id">Inventory batch ID.</param>
    /// <param name="request">Batch update details.</param>
    /// <param name="ct">Cancellation token.</param>
    /// <response code="200">Batch updated successfully.</response>
    /// <response code="400">Validation error or business rule violation.</response>
    /// <response code="404">Batch not found.</response>
    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin,Manager")]
    [ProducesResponseType(typeof(InventoryBatchResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateInventoryBatchRequest request, CancellationToken ct)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            var updated = await inventoryService.UpdateAsync(id, request, ct);
            return updated is null ? NotFound(new { message = $"Inventory batch with ID {id} not found." }) : Ok(updated);
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

    /// <summary>Delete an inventory batch.</summary>
    /// <param name="id">Inventory batch ID.</param>
    /// <param name="ct">Cancellation token.</param>
    /// <response code="204">Batch deleted successfully.</response>
    /// <response code="404">Batch not found.</response>
    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin,Manager")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(int id, CancellationToken ct)
    {
        var deleted = await inventoryService.DeleteAsync(id, ct);
        return deleted ? NoContent() : NotFound(new { message = $"Inventory batch with ID {id} not found." });
    }
}

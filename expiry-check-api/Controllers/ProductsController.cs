using ExpiryCheckApi.DTOs;
using ExpiryCheckApi.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ExpiryCheckApi.Controllers;

/// <summary>
/// Product Management API supporting CRUD operations, searching, filtering, and barcode lookup.
/// </summary>
[ApiController]
[Route("api/products")]
[Produces("application/json")]
[Authorize]
public sealed class ProductsController(IProductService productService) : ControllerBase
{
    /// <summary>Get paginated list of products with search and filtering.</summary>
    /// <param name="queryParams">Query and pagination parameters.</param>
    /// <param name="ct">Cancellation token.</param>
    /// <response code="200">Paginated list of products.</response>
    [HttpGet]
    [AllowAnonymous]
    [ProducesResponseType(typeof(PagedResult<ProductDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetPaged([FromQuery] ProductQueryParams queryParams, CancellationToken ct)
    {
        var result = await productService.GetPagedAsync(queryParams, ct);
        return Ok(result);
    }

    /// <summary>Get product by ID.</summary>
    /// <param name="id">Product ID.</param>
    /// <param name="ct">Cancellation token.</param>
    /// <response code="200">Product details.</response>
    /// <response code="404">Product not found.</response>
    [HttpGet("{id:int}")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ProductDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(int id, CancellationToken ct)
    {
        var product = await productService.GetByIdAsync(id, ct);
        return product is null ? NotFound(new { message = $"Product with ID {id} not found." }) : Ok(product);
    }

    /// <summary>Get product by SKU.</summary>
    /// <param name="sku">Product Stock Keeping Unit.</param>
    /// <param name="ct">Cancellation token.</param>
    /// <response code="200">Product details.</response>
    /// <response code="404">Product with given SKU not found.</response>
    [HttpGet("sku/{sku}")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ProductDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetBySKU(string sku, CancellationToken ct)
    {
        var product = await productService.GetBySKUAsync(sku, ct);
        return product is null ? NotFound(new { message = $"Product with SKU '{sku}' not found." }) : Ok(product);
    }

    /// <summary>Get product by barcode scanner lookup.</summary>
    /// <param name="barcode">Product EAN/UPC barcode number.</param>
    /// <param name="ct">Cancellation token.</param>
    /// <response code="200">Product details.</response>
    /// <response code="404">Product with given barcode not found.</response>
    [HttpGet("barcode/{barcode}")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ProductDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetByBarcode(string barcode, CancellationToken ct)
    {
        var product = await productService.GetByBarcodeAsync(barcode, ct);
        return product is null ? NotFound(new { message = $"Product with barcode '{barcode}' not found." }) : Ok(product);
    }

    /// <summary>Create a new product.</summary>
    /// <param name="dto">Product creation model.</param>
    /// <param name="ct">Cancellation token.</param>
    /// <response code="201">Product created successfully.</response>
    /// <response code="400">Validation error or duplicate SKU/barcode.</response>
    [HttpPost]
    [Authorize(Roles = "Admin,Manager")]
    [ProducesResponseType(typeof(ProductDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create([FromBody] CreateProductDto dto, CancellationToken ct)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            var created = await productService.CreateAsync(dto, ct);
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

    /// <summary>Update an existing product.</summary>
    /// <param name="id">Product ID.</param>
    /// <param name="dto">Product update model.</param>
    /// <param name="ct">Cancellation token.</param>
    /// <response code="200">Product updated successfully.</response>
    /// <response code="400">Validation error or duplicate SKU/barcode.</response>
    /// <response code="404">Product not found.</response>
    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin,Manager")]
    [ProducesResponseType(typeof(ProductDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateProductDto dto, CancellationToken ct)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            var updated = await productService.UpdateAsync(id, dto, ct);
            return updated is null ? NotFound(new { message = $"Product with ID {id} not found." }) : Ok(updated);
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

    /// <summary>Delete a product.</summary>
    /// <param name="id">Product ID.</param>
    /// <param name="ct">Cancellation token.</param>
    /// <response code="204">Product deleted.</response>
    /// <response code="404">Product not found.</response>
    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin,Manager")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(int id, CancellationToken ct)
    {
        var deleted = await productService.DeleteAsync(id, ct);
        return deleted ? NoContent() : NotFound(new { message = $"Product with ID {id} not found." });
    }
}

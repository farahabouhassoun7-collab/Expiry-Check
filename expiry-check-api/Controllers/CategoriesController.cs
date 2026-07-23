using ExpiryCheckApi.DTOs;
using ExpiryCheckApi.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ExpiryCheckApi.Controllers;

/// <summary>
/// Product Categories API for managing category classification.
/// </summary>
[ApiController]
[Route("api/categories")]
[Produces("application/json")]
[Authorize]
public sealed class CategoriesController(ICategoryService categoryService) : ControllerBase
{
    /// <summary>Get all categories.</summary>
    /// <param name="activeOnly">If true, returns active categories only.</param>
    /// <param name="ct">Cancellation token.</param>
    /// <response code="200">List of categories.</response>
    [HttpGet]
    [AllowAnonymous]
    [ProducesResponseType(typeof(IReadOnlyList<CategoryDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll([FromQuery] bool activeOnly = false, CancellationToken ct = default)
    {
        var categories = await categoryService.GetAllAsync(activeOnly, ct);
        return Ok(categories);
    }

    /// <summary>Get category by ID.</summary>
    /// <param name="id">Category ID.</param>
    /// <param name="ct">Cancellation token.</param>
    /// <response code="200">Category details.</response>
    /// <response code="404">Category not found.</response>
    [HttpGet("{id:int}")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(CategoryDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(int id, CancellationToken ct)
    {
        var category = await categoryService.GetByIdAsync(id, ct);
        return category is null ? NotFound(new { message = $"Category with ID {id} not found." }) : Ok(category);
    }

    /// <summary>Create a new category.</summary>
    /// <param name="dto">Category creation model.</param>
    /// <param name="ct">Cancellation token.</param>
    /// <response code="201">Category created successfully.</response>
    /// <response code="400">Invalid validation rules.</response>
    [HttpPost]
    [Authorize(Roles = "Admin,Manager")]
    [ProducesResponseType(typeof(CategoryDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create([FromBody] CreateCategoryDto dto, CancellationToken ct)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var created = await categoryService.CreateAsync(dto, ct);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    /// <summary>Update an existing category.</summary>
    /// <param name="id">Category ID.</param>
    /// <param name="dto">Category update model.</param>
    /// <param name="ct">Cancellation token.</param>
    /// <response code="200">Category updated successfully.</response>
    /// <response code="404">Category not found.</response>
    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin,Manager")]
    [ProducesResponseType(typeof(CategoryDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateCategoryDto dto, CancellationToken ct)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var updated = await categoryService.UpdateAsync(id, dto, ct);
        return updated is null ? NotFound(new { message = $"Category with ID {id} not found." }) : Ok(updated);
    }

    /// <summary>Delete a category.</summary>
    /// <param name="id">Category ID.</param>
    /// <param name="ct">Cancellation token.</param>
    /// <response code="204">Category deleted.</response>
    /// <response code="404">Category not found.</response>
    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin,Manager")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(int id, CancellationToken ct)
    {
        var deleted = await categoryService.DeleteAsync(id, ct);
        return deleted ? NoContent() : NotFound(new { message = $"Category with ID {id} not found." });
    }
}

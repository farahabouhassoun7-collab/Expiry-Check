using ExpiryCheckApi.DTOs;
using ExpiryCheckApi.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ExpiryCheckApi.Controllers;

/// <summary>
/// Handles user registration and authentication.
/// Business logic is fully delegated to <see cref="IAuthService"/>.
/// </summary>
[ApiController]
[Route("api/auth")]
[Produces("application/json")]
public sealed class AuthController(IAuthService authService) : ControllerBase
{
    /// <summary>Register a new user account.</summary>
    /// <response code="201">User created successfully — returns JWT token.</response>
    /// <response code="409">Email already registered.</response>
    /// <response code="400">Validation errors.</response>
    [HttpPost("register")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(AuthResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Register(
        [FromBody] RegisterRequest request,
        CancellationToken ct)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var response = await authService.RegisterAsync(request, ct);
        return CreatedAtAction(nameof(Me), new { }, response);
    }

    /// <summary>Authenticate with email and password — returns a JWT token.</summary>
    /// <response code="200">Login successful — returns JWT token.</response>
    /// <response code="401">Invalid email or password.</response>
    [HttpPost("login")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(AuthResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Login(
        [FromBody] LoginRequest request,
        CancellationToken ct)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var response = await authService.LoginAsync(request, ct);

        if (response is null)
            return Unauthorized(new { success = false, message = "Invalid email or password." });

        return Ok(response);
    }

    /// <summary>Returns the currently authenticated user's profile. Requires Bearer token.</summary>
    /// <response code="200">Current user info.</response>
    /// <response code="401">Not authenticated.</response>
    [HttpGet("me")]
    [Authorize]
    [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public IActionResult Me()
    {
        var userId    = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        var userEmail = User.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value
                     ?? User.FindFirst("email")?.Value;
        var userRole  = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;
        var userName  = User.FindFirst(System.Security.Claims.ClaimTypes.Name)?.Value;

        return Ok(new
        {
            success = true,
            user = new { id = userId, name = userName, email = userEmail, role = userRole }
        });
    }
}

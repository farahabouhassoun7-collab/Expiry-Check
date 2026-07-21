using System.ComponentModel.DataAnnotations;

namespace ExpiryCheckApi.DTOs;

/// <summary>Request body for POST /api/auth/register</summary>
public class RegisterRequest
{
    [Required, MaxLength(100)]
    public string FirstName { get; set; } = string.Empty;

    [Required, MaxLength(100)]
    public string LastName  { get; set; } = string.Empty;

    [Required, EmailAddress, MaxLength(256)]
    public string Email    { get; set; } = string.Empty;

    [Required, MinLength(8), MaxLength(128)]
    public string Password { get; set; } = string.Empty;

    /// <summary>Optional role override — defaults to Employee.</summary>
    public string Role { get; set; } = "Employee";
}

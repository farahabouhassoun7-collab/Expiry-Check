namespace ExpiryCheckApi.Models;

/// <summary>
/// Represents an application user (store employee or manager).
/// </summary>
public class User
{
    public int Id { get; set; }

    public string FirstName { get; set; } = string.Empty;

    public string LastName  { get; set; } = string.Empty;

    /// <summary>Unique email address used for authentication.</summary>
    public string Email { get; set; } = string.Empty;

    /// <summary>BCrypt-hashed password — never store plain text.</summary>
    public string PasswordHash { get; set; } = string.Empty;

    /// <summary>User role: Admin | Manager | Employee</summary>
    public string Role { get; set; } = "Employee";

    public DateTime CreatedAt  { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt  { get; set; } = DateTime.UtcNow;

    public bool IsActive { get; set; } = true;
}

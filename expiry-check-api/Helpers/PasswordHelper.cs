using Microsoft.AspNetCore.Identity;

namespace ExpiryCheckApi.Helpers;

/// <summary>
/// Utility wrapper around ASP.NET Core <see cref="PasswordHasher{T}"/>.
/// Passwords are NEVER stored in plain text.
/// </summary>
public static class PasswordHelper
{
    private static readonly PasswordHasher<object> _hasher = new();

    /// <summary>Hash a plain-text password using PBKDF2.</summary>
    public static string HashPassword(string plainText)
        => _hasher.HashPassword(null!, plainText);

    /// <summary>Verify a plain-text password against a stored hash.</summary>
    public static bool VerifyPassword(string hash, string plainText)
    {
        var result = _hasher.VerifyHashedPassword(null!, hash, plainText);
        return result != PasswordVerificationResult.Failed;
    }
}

using ExpiryCheckApi.Models;

namespace ExpiryCheckApi.Interfaces;

/// <summary>Contract for generating JWT tokens.</summary>
public interface IJwtTokenGenerator
{
    /// <summary>Generate a signed JWT token for the given user.</summary>
    (string Token, DateTime ExpiresAt) GenerateToken(User user);
}

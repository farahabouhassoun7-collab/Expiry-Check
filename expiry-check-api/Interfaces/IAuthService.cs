using ExpiryCheckApi.DTOs;

namespace ExpiryCheckApi.Interfaces;

/// <summary>Business logic contract for authentication operations.</summary>
public interface IAuthService
{
    /// <summary>Register a new user. Throws if email already exists.</summary>
    Task<AuthResponse> RegisterAsync(RegisterRequest request, CancellationToken ct = default);

    /// <summary>Authenticate user and return JWT token. Returns null on invalid credentials.</summary>
    Task<AuthResponse?> LoginAsync(LoginRequest request, CancellationToken ct = default);
}

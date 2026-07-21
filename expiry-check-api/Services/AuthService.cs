using ExpiryCheckApi.DTOs;
using ExpiryCheckApi.Helpers;
using ExpiryCheckApi.Interfaces;
using ExpiryCheckApi.Models;

namespace ExpiryCheckApi.Services;

/// <summary>
/// Implements authentication business logic.
/// Controllers call this service — no EF/DB code lives here.
/// </summary>
public sealed class AuthService(
    IUserRepository    userRepository,
    IJwtTokenGenerator tokenGenerator,
    ILogger<AuthService> logger) : IAuthService
{
    /// <inheritdoc/>
    public async Task<AuthResponse> RegisterAsync(RegisterRequest request, CancellationToken ct = default)
    {
        // 1. Guard: duplicate email
        if (await userRepository.EmailExistsAsync(request.Email, ct))
            throw new InvalidOperationException($"Email '{request.Email}' is already registered.");

        // 2. Create user entity with hashed password
        var user = new User
        {
            FirstName    = request.FirstName.Trim(),
            LastName     = request.LastName.Trim(),
            Email        = request.Email.Trim().ToLower(),
            PasswordHash = PasswordHelper.HashPassword(request.Password),
            Role         = request.Role,
            CreatedAt    = DateTime.UtcNow,
            UpdatedAt    = DateTime.UtcNow,
            IsActive     = true,
        };

        // 3. Persist
        await userRepository.CreateAsync(user, ct);
        logger.LogInformation("New user registered: {Email} (Role: {Role})", user.Email, user.Role);

        // 4. Issue token
        return BuildAuthResponse(user);
    }

    /// <inheritdoc/>
    public async Task<AuthResponse?> LoginAsync(LoginRequest request, CancellationToken ct = default)
    {
        // 1. Lookup user
        var user = await userRepository.GetByEmailAsync(request.Email, ct);

        if (user is null || !user.IsActive)
        {
            logger.LogWarning("Login failed — user not found or inactive: {Email}", request.Email);
            return null;
        }

        // 2. Verify password
        if (!PasswordHelper.VerifyPassword(user.PasswordHash, request.Password))
        {
            logger.LogWarning("Login failed — invalid password for: {Email}", request.Email);
            return null;
        }

        logger.LogInformation("User logged in: {Email}", user.Email);
        return BuildAuthResponse(user);
    }

    // ── Private helpers ──────────────────────────────────────────

    private AuthResponse BuildAuthResponse(User user)
    {
        var (token, expiresAt) = tokenGenerator.GenerateToken(user);

        return new AuthResponse
        {
            Token     = token,
            ExpiresAt = expiresAt,
            User      = new UserDto
            {
                Id        = user.Id,
                FirstName = user.FirstName,
                LastName  = user.LastName,
                Email     = user.Email,
                Role      = user.Role,
                IsActive  = user.IsActive,
                CreatedAt = user.CreatedAt,
            },
        };
    }
}

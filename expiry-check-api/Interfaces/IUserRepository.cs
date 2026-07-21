using ExpiryCheckApi.Models;

namespace ExpiryCheckApi.Interfaces;

/// <summary>Data-access contract for User entities.</summary>
public interface IUserRepository
{
    Task<User?> GetByEmailAsync(string email, CancellationToken ct = default);
    Task<User?> GetByIdAsync(int id,          CancellationToken ct = default);
    Task<bool>  EmailExistsAsync(string email,CancellationToken ct = default);
    Task<User>  CreateAsync(User user,        CancellationToken ct = default);
    Task        UpdateAsync(User user,        CancellationToken ct = default);
}

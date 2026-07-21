namespace ExpiryCheckApi.Configurations;

/// <summary>Strongly-typed JWT settings — bound from appsettings.json</summary>
public class JwtSettings
{
    public string Secret          { get; set; } = string.Empty;
    public string Issuer          { get; set; } = string.Empty;
    public string Audience        { get; set; } = string.Empty;
    public int    ExpiryInMinutes { get; set; } = 60;
}

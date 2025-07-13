using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace API.Services;

public class TokenService
{
    private readonly IConfiguration _config;

    public TokenService(IConfiguration config)
    {
        _config = config;
    }

    public string GenerateToken(string userId, string userName)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
#pragma warning disable CA2208 // Instantiate argument exceptions correctly
        var keyString = _config["JWTSettings:SecretKey"]
        ?? throw new ArgumentNullException("JWT Secret Key is not configured");
#pragma warning restore CA2208 // Instantiate argument exceptions correctly
        Console.WriteLine($"Actual key being used: {keyString}");

        if (Encoding.UTF8.GetByteCount(keyString) < 32)
        {
            throw new ArgumentException("JWT secret key must be at least 256 bits (32 characters)");
        }

        var key = Encoding.ASCII.GetBytes(keyString);
        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, userId),
            new (ClaimTypes.Name, userName),
        };

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddDays(1),
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }



}

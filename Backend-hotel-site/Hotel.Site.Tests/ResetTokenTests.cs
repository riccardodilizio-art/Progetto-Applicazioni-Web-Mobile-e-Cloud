using FluentAssertions;
using System.Security.Cryptography;
using Xunit;

namespace Hotel.Site.Tests;

public class ResetTokenTests
{
    // Replica dei metodi privati di AuthController per testarli
    private static string GenerateSecureToken()
    {
        var bytes = RandomNumberGenerator.GetBytes(32);
        return Convert.ToBase64String(bytes)
            .Replace("+", "-").Replace("/", "_").TrimEnd('=');
    }

    private static string HashToken(string token)
    {
        using var sha = SHA256.Create();
        var hash = sha.ComputeHash(System.Text.Encoding.UTF8.GetBytes(token));
        return Convert.ToHexString(hash);
    }

    [Fact]
    public void GenerateSecureToken_ProducesUrlSafeToken()
    {
        var token = GenerateSecureToken();

        token.Should().NotBeNullOrWhiteSpace();
        token.Should().NotContain("+");
        token.Should().NotContain("/");
        token.Should().NotEndWith("=");
        token.Length.Should().BeGreaterThan(30);
    }

    [Fact]
    public void HashToken_IsDeterministic()
    {
        var token = "my-test-token";
        HashToken(token).Should().Be(HashToken(token));
    }

    [Fact]
    public void HashToken_DifferentInputsGiveDifferentHashes()
    {
        HashToken("a").Should().NotBe(HashToken("b"));
    }

    [Fact]
    public void GenerateSecureToken_ShouldBeUnique()
    {
        var tokens = Enumerable.Range(0, 100).Select(_ => GenerateSecureToken()).ToHashSet();
        tokens.Count.Should().Be(100);
    }
}

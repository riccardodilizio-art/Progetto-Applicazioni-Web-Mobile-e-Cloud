using FluentAssertions;
using Hotel.Site.Infrastructure.Services;
using Xunit;

namespace Hotel.Site.Tests;

public class PasswordHasherTests
{
    private readonly BCryptPasswordHasher _hasher = new();

    [Fact]
    public void Hash_And_Verify_ShouldSucceed_ForCorrectPassword()
    {
        var hash = _hasher.Hash("MyPassword123");
        _hasher.Verify("MyPassword123", hash).Should().BeTrue();
    }

    [Fact]
    public void Verify_ShouldFail_ForWrongPassword()
    {
        var hash = _hasher.Hash("MyPassword123");
        _hasher.Verify("Wrong", hash).Should().BeFalse();
    }

    [Fact]
    public void Hash_ShouldProduceDifferentValues_ForSameInput()
    {
        var h1 = _hasher.Hash("same");
        var h2 = _hasher.Hash("same");
        h1.Should().NotBe(h2); // salt diverso ogni volta
    }
}

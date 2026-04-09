using Hotel.Site.Core.Entities;

namespace Hotel.Site.Application.Abstractions.Services;

public interface IJwtTokenService
{
    string GenerateToken(User user);
}

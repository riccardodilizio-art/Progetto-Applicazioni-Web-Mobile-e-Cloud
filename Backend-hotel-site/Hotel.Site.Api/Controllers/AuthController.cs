using Hotel.Site.Api.DTOs.auth.Request;
using Hotel.Site.Api.DTOs.auth.Response;
using Hotel.Site.Application.Abstractions.Services;
using Hotel.Site.Core.Entities;
using Hotel.Site.Core.Entities.Enums;
using Microsoft.AspNetCore.Mvc;

namespace Hotel.Site.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IJwtTokenService _jwtTokenService;

    public AuthController(
        IUserService userService,
        IPasswordHasher passwordHasher,
        IJwtTokenService jwtTokenService)
    {
        _userService = userService;
        _passwordHasher = passwordHasher;
        _jwtTokenService = jwtTokenService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var user = await _userService.GetUserByEmailAsync(request.Email);
        if (user == null || !_passwordHasher.Verify(request.Password, user.Password))
            return Unauthorized(new { message = "Email o password errati" });

        var token = _jwtTokenService.GenerateToken(user);

        return Ok(new AuthResponse(
            user.IdUser, user.Nome, user.Cognome, user.Email, user.Ruolo.ToString(), token
        ));
    }

    [HttpPost("admin/login")]
    public async Task<IActionResult> AdminLogin([FromBody] LoginRequest request)
    {
        var user = await _userService.GetUserByEmailAsync(request.Email);
        if (user == null || !_passwordHasher.Verify(request.Password, user.Password))
            return Unauthorized(new { message = "Email o password errati" });

        if (user.Ruolo != Role.ADMIN)
            return Forbid();

        var token = _jwtTokenService.GenerateToken(user);

        return Ok(new AuthResponse(
            user.IdUser, user.Nome, user.Cognome, user.Email, user.Ruolo.ToString(), token
        ));
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        var existing = await _userService.GetUserByEmailAsync(request.Email);
        if (existing != null)
            return Conflict(new { message = "Email già registrata" });

        var user = new User
        {
            IdUser = Guid.NewGuid(),
            Nome = request.Nome,
            Cognome = request.Cognome,
            Email = request.Email,
            Password = _passwordHasher.Hash(request.Password),
            NumeroTelefono = request.NumeroTelefono,
            Ruolo = Role.CLIENT,
            DataCreazione = DateTime.UtcNow
        };

        await _userService.AddUserAsync(user);

        var token = _jwtTokenService.GenerateToken(user);

        return Created("", new AuthResponse(
            user.IdUser, user.Nome, user.Cognome, user.Email, user.Ruolo.ToString(), token
        ));
    }
}

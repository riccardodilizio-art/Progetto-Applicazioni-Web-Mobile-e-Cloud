using Hotel.Site.Api.DTOs.auth.Response;
using Hotel.Site.Application.Abstractions.Services;
using Hotel.Site.Core.Entities;
using Hotel.Site.Core.Entities.Enums;
using Microsoft.AspNetCore.Mvc;
using Hotel.Site.Api.DTOs.auth.Request;

namespace Hotel.Site.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IUserService _userService;

    public AuthController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var user = await _userService.GetUserByEmailAsync(request.Email);
        if (user == null || user.Password != request.Password)
            return Unauthorized(new { message = "Email o password errati" });

        return Ok(new AuthResponse(
            user.IdUser, user.Nome, user.Cognome, user.Email, user.Ruolo.ToString()
        ));
    }

    [HttpPost("admin/login")]
    public async Task<IActionResult> AdminLogin([FromBody] LoginRequest request)
    {
        var user = await _userService.GetUserByEmailAsync(request.Email);
        if (user == null || user.Password != request.Password)
            return Unauthorized(new { message = "Email o password errati" });

        if (user.Ruolo != Role.ADMIN)
            return Forbid();

        return Ok(new AuthResponse(
            user.IdUser, user.Nome, user.Cognome, user.Email, user.Ruolo.ToString()
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
            Password = request.Password, // In futuro: hashare con BCrypt
            NumeroTelefono = request.NumeroTelefono,
            Ruolo = Role.CLIENT,
            DataCreazione = DateTime.UtcNow
        };

        await _userService.AddUserAsync(user);

        return Created("", new AuthResponse(
            user.IdUser, user.Nome, user.Cognome, user.Email, user.Ruolo.ToString()
        ));
    }
}

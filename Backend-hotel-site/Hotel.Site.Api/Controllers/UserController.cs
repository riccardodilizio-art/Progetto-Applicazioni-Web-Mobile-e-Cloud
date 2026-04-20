using System.Security.Claims;
using Hotel.Site.Api.DTOs.Users.Request;
using Hotel.Site.Api.DTOs.Users.Response;
using Hotel.Site.Application.Abstractions.Services;
using Hotel.Site.Core.Entities.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Hotel.Site.Api.Controllers;

[ApiController]
[Route("api/users")]
[Authorize]
public class UserController : ControllerBase
{
    private readonly IUserService _userService;

    public UserController(IUserService userService) => _userService = userService;

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        if (!IsSelfOrAdmin(id)) return Forbid();
        var user = await _userService.GetUserByIdAsync(id);
        if (user == null) return NotFound();
        return Ok(MapToResponse(user));
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateUserRequest request)
    {
        if (!IsSelfOrAdmin(id)) return Forbid();

        var user = await _userService.GetUserByIdAsync(id);
        if (user == null) return NotFound();

        if (request.Nome != null) user.Nome = request.Nome.Trim();
        if (request.Cognome != null) user.Cognome = request.Cognome.Trim();
        if (request.NumeroTelefono != null) user.NumeroTelefono = request.NumeroTelefono.Trim();

        await _userService.EditUserAsync(user);
        return Ok(MapToResponse(user));
    }

    private bool IsSelfOrAdmin(Guid userId)
    {
        if (User.IsInRole(Role.ADMIN.ToString())) return true;
        var claim = User.FindFirst(ClaimTypes.NameIdentifier);
        return claim != null && Guid.Parse(claim.Value) == userId;
    }

    private static UserResponse MapToResponse(Core.Entities.User u) =>
        new(u.IdUser, u.Nome, u.Cognome, u.Email, u.NumeroTelefono, u.Ruolo.ToString());
}

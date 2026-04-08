using Hotel.Site.Api.DTOs.Menu.Response;
using Hotel.Site.Application.Abstractions.Services;
using Hotel.Site.Core.Entities.Enums;
using Microsoft.AspNetCore.Mvc;

namespace Hotel.Site.Api.Controllers;

[ApiController]
[Route("api/menus")]
public class MenuController : ControllerBase
{
    private readonly IMenuService _menuService;

    public MenuController(IMenuService menuService)
    {
        _menuService = menuService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var menus = await _menuService.GetAllMenusAsync();
        var response = menus.Select(MapToResponse);
        return Ok(response);
    }

    [HttpGet("{giorno}")]
    public async Task<IActionResult> GetByDay(string giorno)
    {
        if (!Enum.TryParse<DayOfWeeks>(giorno, true, out var day))
            return BadRequest(new { message = "Giorno non valido" });

        var menu = await _menuService.GetMenuByDayAsync(day);
        if (menu == null) return NotFound();
        return Ok(MapToResponse(menu));
    }

    private static MenuResponse MapToResponse(Core.Entities.Menu m) => new(
        m.IdMenu,
        m.GiornoSettimana.ToString(),
        m.Piatti.Where(d => d.TipoPiatto == DishType.PRIMO).Select(d => new DishResponse(
            d.IdDish, d.Nome, d.Descrizione, d.Categoria.ToString(), d.TipoPiatto.ToString()
        )).ToList(),
        m.Piatti.Where(d => d.TipoPiatto == DishType.SECONDO).Select(d => new DishResponse(
            d.IdDish, d.Nome, d.Descrizione, d.Categoria.ToString(), d.TipoPiatto.ToString()
        )).ToList()
    );
}

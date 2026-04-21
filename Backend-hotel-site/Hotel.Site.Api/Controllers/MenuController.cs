using Hotel.Site.Api.DTOs.Menu.Request;
using Hotel.Site.Api.DTOs.Menu.Response;
using Hotel.Site.Application.Abstractions.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Hotel.Site.Core.Entities.Enums;
using DayOfWeek = Hotel.Site.Core.Entities.Enums.DayOfWeek;

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

    /// <summary>Elenco di tutte le portate del menu (pubblico).</summary>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<MenuResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll()
    {
        var menus = await _menuService.GetAllMenusAsync();
        var response = menus.Select(MapToResponse);
        return Ok(response);
    }

    /// <summary>Dettaglio di una singola portata.</summary>
    [HttpGet("{giorno}")]
    [ProducesResponseType(typeof(MenuResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetByDay(string giorno)
    {
        if (!Enum.TryParse<DayOfWeek>(giorno, true, out var day))
            return BadRequest(new { message = "Giorno non valido" });

        var menu = await _menuService.GetMenuByDayAsync(day);
        if (menu == null) return NotFound();
        return Ok(MapToResponse(menu));
    }

    /// <summary>Crea una nuova portata (admin).</summary>
    [HttpPost]
    [Authorize(Roles = "ADMIN")]
    [ProducesResponseType(typeof(MenuResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create([FromBody] MenuRequest request)
    {
        if (!Enum.TryParse<DayOfWeek>(request.Giorno, true, out var giorno))
            return BadRequest(new { message = "Giorno non valido" });

        // Un solo menu per giorno
        var existing = await _menuService.GetMenuByDayAsync(giorno);
        if (existing != null)
            return Conflict(new { message = $"Esiste già un menu per {giorno}" });

        var piatti = new List<Core.Entities.Dish>();
        foreach (var dto in request.Piatti ?? new List<DishRequest>())
        {
            if (!Enum.TryParse<DishCategory>(dto.Categoria, true, out var categoria))
                return BadRequest(new { message = $"Categoria piatto non valida: {dto.Categoria}" });
            if (!Enum.TryParse<DishType>(dto.TipoPiatto, true, out var tipo))
                return BadRequest(new { message = $"Tipo piatto non valido: {dto.TipoPiatto}" });

            piatti.Add(new Core.Entities.Dish
            {
                IdDish = Guid.NewGuid(),
                Nome = dto.Nome,
                Descrizione = dto.Descrizione,
                Categoria = categoria,
                TipoPiatto = tipo,
            });
        }

        if (piatti.Count(p => p.TipoPiatto == DishType.PRIMO) < 1)
            return BadRequest(new { message = "Il menu deve contenere almeno un primo piatto." });

        if (piatti.Count(p => p.TipoPiatto == DishType.SECONDO) < 1)
            return BadRequest(new { message = "Il menu deve contenere almeno un secondo piatto." });


        var menu = new Core.Entities.Menu
        {
            IdMenu = Guid.NewGuid(),
            GiornoSettimana = giorno,
        };
        foreach (var p in piatti)
        {
            p.MenuId = menu.IdMenu;
            menu.Piatti.Add(p);
        }

        await _menuService.AddMenuAsync(menu);
        return Created($"/api/menus/{menu.IdMenu}", MapToResponse(menu));
    }
    /// <summary>Aggiorna una portata esistente (admin).</summary>
    [HttpPut("{id:guid}")]
    [Authorize(Roles = "ADMIN")]
    [ProducesResponseType(typeof(MenuResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(Guid id, [FromBody] MenuRequest request)
    {
        if (!Enum.TryParse<DayOfWeek>(request.Giorno, true, out var giorno))
            return BadRequest(new { message = "Giorno non valido" });

        // Se il giorno cambia, verifico che non sia già occupato da un altro menu
        var sameDay = await _menuService.GetMenuByDayAsync(giorno);
        if (sameDay != null && sameDay.IdMenu != id)
            return Conflict(new { message = $"Esiste già un altro menu per {giorno}" });

        var piatti = new List<Core.Entities.Dish>();
        foreach (var dto in request.Piatti ?? new List<DishRequest>())
        {
            if (!Enum.TryParse<DishCategory>(dto.Categoria, true, out var categoria))
                return BadRequest(new { message = $"Categoria piatto non valida: {dto.Categoria}" });
            if (!Enum.TryParse<DishType>(dto.TipoPiatto, true, out var tipo))
                return BadRequest(new { message = $"Tipo piatto non valido: {dto.TipoPiatto}" });

            piatti.Add(new Core.Entities.Dish
            {
                Nome = dto.Nome,
                Descrizione = dto.Descrizione,
                Categoria = categoria,
                TipoPiatto = tipo,
            });
        }

        if (piatti.Count(p => p.TipoPiatto == DishType.PRIMO) < 1)
            return BadRequest(new { message = "Il menu deve contenere almeno un primo piatto." });

        if (piatti.Count(p => p.TipoPiatto == DishType.SECONDO) < 1)
            return BadRequest(new { message = "Il menu deve contenere almeno un secondo piatto." });


        var updated = await _menuService.UpdateMenuAsync(id, giorno, piatti);
        if (updated == null) return NotFound();
        return Ok(MapToResponse(updated));
    }

    /// <summary>Cancella una portata (admin).</summary>
    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "ADMIN")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(Guid id)
    {
        var existing = await _menuService.GetMenuByIdAsync(id);
        if (existing == null) return NotFound();

        await _menuService.DeleteMenuAsync(id);
        return NoContent();
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

using System.Security.Claims;
using Hotel.Site.Api.DTOs.Dinner.Request;
using Hotel.Site.Api.DTOs.Dinner.Response;
using Hotel.Site.Application.Abstractions.Services;
using Hotel.Site.Core.Entities;
using Hotel.Site.Core.Entities.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Hotel.Site.Api.Controllers;

[ApiController]
[Route("api/dinner-reservations")]
// Verificare che esista una RoomReservation con questo CodiceCena
// Se non esiste → return BadRequest("Codice cena non valido")
// Se la prenotazione e' ANNULLATA → return BadRequest("Prenotazione annullata")

public class DinnerReservationController : ControllerBase
{
    private readonly IDinnerReservationService _dinnerReservationService;
    private readonly IDinnerOrderService _dinnerOrderService;
    private readonly IRoomReservationService _roomReservationService;

    public DinnerReservationController(
        IDinnerReservationService dinnerReservationService,
        IDinnerOrderService dinnerOrderService,
        IRoomReservationService roomReservationService)
    {
        _dinnerReservationService = dinnerReservationService;
        _dinnerOrderService = dinnerOrderService;
        _roomReservationService = roomReservationService;
    }

    [HttpGet("{id:guid}")]
    [Authorize]
    public async Task<IActionResult> GetById(Guid id)
    {
        var reservation = await _dinnerReservationService.GetDinnerReservationByIdAsync(id);
        if (reservation == null) return NotFound();

        if (!await IsDinnerCodeOwnedByCurrentUserOrAdmin(reservation.CodiceCena))
            return Forbid();

        return Ok(MapToResponse(reservation));
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create([FromBody] DinnerReservationRequest request)
    {
        if (!await IsDinnerCodeOwnedByCurrentUserOrAdmin(request.CodiceCena))
            return Forbid();

        var reservation = new DinnerReservation
        {
            Id = Guid.NewGuid(),
            CodiceCena = request.CodiceCena,
            Data = request.Data,
            NumeroCoperti = request.NumeroCoperti,
            StatoPrenotazione = DinnerState.BOZZA,
            DataCreazione = DateTime.UtcNow
        };

        foreach (var o in request.Ordini)
        {
            reservation.Ordini.Add(new DinnerOrder
            {
                Id = Guid.NewGuid(),
                DinnerReservationId = reservation.Id,
                NumeroCoperto = o.NumeroCoperto,
                Primo = o.Primo,
                Secondo = o.Secondo
            });
        }

        await _dinnerReservationService.AddDinnerReservationAsync(reservation);
        return Created($"/api/dinner-reservations/{reservation.Id}", MapToResponse(reservation));
    }

    private Guid GetCurrentUserId()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier)
            ?? throw new UnauthorizedAccessException("User id claim mancante");
        return Guid.Parse(claim.Value);
    }

    private async Task<bool> IsDinnerCodeOwnedByCurrentUserOrAdmin(string codiceCena)
    {
        if (User.IsInRole(Role.ADMIN.ToString())) return true;

        var userId = GetCurrentUserId();
        var userRoomReservations = await _roomReservationService.GetRoomReservationsByUserIdAsync(userId);
        return userRoomReservations.Any(r => r.CodiceCena == codiceCena);
    }

    private static DinnerReservationResponse MapToResponse(DinnerReservation r) => new(
        r.Id,
        r.CodiceCena,
        r.Data,
        r.NumeroCoperti,
        r.StatoPrenotazione.ToString(),
        r.Ordini.Select(o => new DinnerOrderResponse(
            o.Id, o.NumeroCoperto, o.Primo, o.Secondo
        )).ToList()
    );
}

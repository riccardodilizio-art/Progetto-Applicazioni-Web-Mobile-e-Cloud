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
public class DinnerReservationController : ControllerBase
{
    private readonly IDinnerReservationService _dinnerReservationService;
    private readonly IRoomReservationService _roomReservationService;

    public DinnerReservationController(
        IDinnerReservationService dinnerReservationService,
        IRoomReservationService roomReservationService)
    {
        _dinnerReservationService = dinnerReservationService;
        _roomReservationService = roomReservationService;
    }

    [HttpGet("by-code/{codiceCena}")]
    public async Task<IActionResult> GetByCode(string codiceCena, [FromQuery] int numeroCamera)
    {
        var roomReservation = await _roomReservationService.GetRoomReservationByCodiceCenaAsync(codiceCena);

        if (roomReservation == null || roomReservation.Room == null)
            return NotFound(new { message = "Codice cena non valido" });

        if (roomReservation.Room.NumeroCamera != numeroCamera)
            return BadRequest(new { message = "Numero camera non corrispondente" });

        if (roomReservation.Stato == State.ANNULLATO)
            return BadRequest(new { message = "Prenotazione camera annullata" });

        var dinnerReservation = await _dinnerReservationService.GetDinnerReservationByCodiceCenaAsync(codiceCena);
        if (dinnerReservation == null) return NotFound(new { message = "Nessuna prenotazione cena trovata" });

        return Ok(MapToResponse(dinnerReservation));
    }

    [HttpPatch("{id:guid}/status")]
    [Authorize(Roles = "ADMIN")]
    public async Task<IActionResult> UpdateStatus(Guid id, [FromBody] DinnerReservationStatusRequest request)
    {
        if (!Enum.TryParse<DinnerState>(request.Stato, true, out var nuovoStato))
            return BadRequest(new { message = "Stato non valido" });

        var updated = await _dinnerReservationService.UpdateDinnerReservationStatusAsync(id, nuovoStato);
        if (updated == null) return NotFound();

        return Ok(MapToResponse(updated));
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] DinnerReservationRequest request)
    {
        var roomReservation = await _roomReservationService.GetRoomReservationByCodiceCenaAsync(request.CodiceCena);

        if (roomReservation == null || roomReservation.Room == null)
            return BadRequest(new { message = "Codice cena non valido" });

        if (roomReservation.Room.NumeroCamera != request.NumeroCamera)
            return BadRequest(new { message = "Numero camera non corrispondente" });

        if (roomReservation.Stato == State.ANNULLATO)
            return BadRequest(new { message = "Prenotazione camera annullata" });

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
        return Created($"/api/dinner-reservations/by-code/{reservation.CodiceCena}", MapToResponse(reservation));
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

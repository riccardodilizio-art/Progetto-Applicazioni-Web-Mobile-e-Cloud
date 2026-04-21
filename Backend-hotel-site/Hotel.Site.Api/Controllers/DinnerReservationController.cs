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

    /// <summary>Elenco di tutte le prenotazioni cena (admin).</summary>
    [HttpGet]
    [Authorize(Roles = "ADMIN")]
    [ProducesResponseType(typeof(IEnumerable<DinnerReservationAdminResponse>), StatusCodes.Status200OK)]

    public async Task<IActionResult> GetAll()
    {
        var dinners = (await _dinnerReservationService.GetAllDinnerReservationsAsync()).ToList();

        // Batch lookup: una sola query per risolvere numero camera e email utente
        // sfruttando il CodiceCena come chiave (DinnerReservation non ha FK diretta a User/Room)
        var codici = dinners.Select(d => d.CodiceCena).Distinct().ToList();
        var roomByCodice = (await _roomReservationService.GetRoomReservationsByCodiciCenaAsync(codici))
            .ToDictionary(r => r.CodiceCena);

        var response = dinners.Select(d =>
        {
            roomByCodice.TryGetValue(d.CodiceCena, out var room);
            return MapToAdminResponse(d, room);
        });


        return Ok(response);
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

    /// <summary>Aggiorna lo stato di una prenotazione cena (admin).</summary>
    [HttpPatch("{id:guid}/status")]
    [Authorize(Roles = "ADMIN")]
    [ProducesResponseType(typeof(DinnerReservationAdminResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateStatus(Guid id, [FromBody] DinnerReservationStatusRequest request)
    {
        if (!Enum.TryParse<DinnerState>(request.Stato, true, out var nuovoStato))
            return BadRequest(new { message = "Stato non valido" });

        var updated = await _dinnerReservationService.UpdateDinnerReservationStatusAsync(id, nuovoStato);
        if (updated == null) return NotFound();

        var room = await _roomReservationService.GetRoomReservationByCodiceCenaAsync(updated.CodiceCena);
        return Ok(MapToAdminResponse(updated, room));
    }




    /// <summary>Crea una prenotazione cena associata a una prenotazione camera tramite il codice cena.</summary>
    /// <response code="201">Prenotazione creata</response>
    /// <response code="400">Dati non validi (es. numero ospiti fuori range)</response>
    /// <response code="404">Codice cena non trovato</response>
    [HttpPost]
    [Authorize]
    [ProducesResponseType(typeof(DinnerReservationResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
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
    /// <summary>Cancella una prenotazione cena.</summary>
    [HttpDelete("{id:guid}")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(Guid id)
    {
        var existing = await _dinnerReservationService.GetDinnerReservationByIdAsync(id);
        if (existing == null) return NotFound();

        await _dinnerReservationService.DeleteDinnerReservationAsync(id);
        return NoContent();
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
    private static DinnerReservationAdminResponse MapToAdminResponse(DinnerReservation d, RoomReservation? room) => new(
    d.Id,
    d.CodiceCena,
    room?.Room?.NumeroCamera,
    room?.User?.Email,
    d.Data,
    d.NumeroCoperti,
    d.StatoPrenotazione.ToString(),
    d.Ordini
        .OrderBy(o => o.NumeroCoperto)
        .Select(o => new DinnerOrderResponse(o.Id, o.NumeroCoperto, o.Primo, o.Secondo))
        .ToList()
);

}

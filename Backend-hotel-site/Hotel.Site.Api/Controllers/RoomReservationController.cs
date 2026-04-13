using System.Security.Claims;
using Hotel.Site.Api.DTOs.Reservations.Request;
using Hotel.Site.Api.DTOs.Reservations.Response;
using Hotel.Site.Application.Abstractions.Services;
using Hotel.Site.Core.Entities;
using Hotel.Site.Core.Entities.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Hotel.Site.Api.Controllers;

[ApiController]
[Route("api/reservations")]
public class RoomReservationController : ControllerBase
{
    private readonly IRoomReservationService _reservationService;

    public RoomReservationController(IRoomReservationService reservationService)
    {
        _reservationService = reservationService;
    }

    [HttpGet("user/{userId:guid}")]
    [Authorize]
    public async Task<IActionResult> GetByUser(Guid userId)
    {
        if (!IsSelfOrAdmin(userId)) return Forbid();

        var reservations = await _reservationService.GetRoomReservationsByUserIdAsync(userId);
        var response = reservations.Select(MapToResponse);
        return Ok(response);
    }

    [HttpGet("{id:guid}")]
    [Authorize]
    public async Task<IActionResult> GetById(Guid id)
    {
        var reservation = await _reservationService.GetRoomReservationByIdAsync(id);
        if (reservation == null) return NotFound();

        if (!IsSelfOrAdmin(reservation.IdUser)) return Forbid();

        return Ok(MapToResponse(reservation));
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create([FromBody] RoomReservationRequest request)
    {
        var currentUserId = GetCurrentUserId();
        var nights = request.CheckOut.DayNumber - request.CheckIn.DayNumber;
        if (nights <= 0) return BadRequest(new { message = "CheckOut deve essere successivo a CheckIn" });

        var overlap = await _reservationService.HasOverlappingReservationAsync(
            request.IdRoom, request.CheckIn, request.CheckOut);
        if (overlap)
            return Conflict(new { message = "La camera è già prenotata per le date selezionate" });

        var reservation = new RoomReservation
        {
            IdRoomReservation = Guid.NewGuid(),
            IdUser = currentUserId,
            IdRoom = request.IdRoom,
            CheckIn = request.CheckIn,
            CheckOut = request.CheckOut,
            PrezzoPerNotte = request.PrezzoPerNotte,
            PrezzoTotale = nights * request.PrezzoPerNotte,
            CodiceCena = GenerateDinnerCode(),
            Stato = State.IN_ATTESA,
            DataPrenotazione = DateTime.UtcNow
        };

        await _reservationService.AddRoomReservationAsync(reservation);
        return Created($"/api/reservations/{reservation.IdRoomReservation}", MapToResponse(reservation));
    }

    [HttpPatch("{id:guid}/status")]
    [Authorize(Roles = "ADMIN")]
    public async Task<IActionResult> UpdateStatus(Guid id, [FromBody] RoomReservationStatusRequest request)
    {
        if (!Enum.TryParse<State>(request.Stato, true, out var nuovoStato))
            return BadRequest(new { message = "Stato non valido" });

        var updated = await _reservationService.UpdateRoomReservationStatusAsync(id, nuovoStato);
        if (updated == null) return NotFound();

        return Ok(MapToResponse(updated));
    }



    [HttpDelete("{id:guid}")]
    [Authorize]
    public async Task<IActionResult> Delete(Guid id)
    {
        var reservation = await _reservationService.GetRoomReservationByIdAsync(id);
        if (reservation == null) return NotFound();

        if (!IsSelfOrAdmin(reservation.IdUser)) return Forbid();

        await _reservationService.DeleteRoomReservationAsync(id);
        return NoContent();
    }

    private Guid GetCurrentUserId()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier)
            ?? throw new UnauthorizedAccessException("User id claim mancante");
        return Guid.Parse(claim.Value);
    }

    private bool IsSelfOrAdmin(Guid userId)
    {
        if (User.IsInRole(Role.ADMIN.ToString())) return true;
        return GetCurrentUserId() == userId;
    }

    private static string GenerateDinnerCode()
    {
        return Random.Shared.Next(10000, 99999).ToString();
    }


    private static RoomReservationResponse MapToResponse(RoomReservation r) => new(
        r.IdRoomReservation,
        r.IdUser,
        r.IdRoom,
        r.Room?.Nome ?? "",
        r.CodiceCena,
        r.CheckIn,
        r.CheckOut,
        r.NumeroNotti,
        r.PrezzoPerNotte,
        r.PrezzoTotale,
        r.Stato.ToString(),
        r.DataPrenotazione
    );
}

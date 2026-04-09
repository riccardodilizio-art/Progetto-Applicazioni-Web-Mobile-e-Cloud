using Hotel.Site.Api.DTOs.Reservations.Request;
using Hotel.Site.Api.DTOs.Reservations.Response;
using Hotel.Site.Application.Abstractions.Services;
using Hotel.Site.Core.Entities;
using Hotel.Site.Core.Entities.Enums;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

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
    public async Task<IActionResult> GetByUser(Guid userId)
    {
        var reservations = await _reservationService.GetRoomReservationsByUserIdAsync(userId);
        var response = reservations.Select(MapToResponse);
        return Ok(response);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var reservation = await _reservationService.GetRoomReservationByIdAsync(id);
        if (reservation == null) return NotFound();
        return Ok(MapToResponse(reservation));
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create([FromBody] RoomReservationRequest request)
    {
        var nights = request.CheckOut.DayNumber - request.CheckIn.DayNumber;

        var reservation = new RoomReservation
        {
            IdRoomReservation = Guid.NewGuid(),
            IdUser = request.IdUser,
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

    [HttpDelete("{id:guid}")]
    [Authorize]
    public async Task<IActionResult> Delete(Guid id)
    {
        await _reservationService.DeleteRoomReservationAsync(id);
        return NoContent();
    }

    private static string GenerateDinnerCode()
    {
        return new Random().Next(10000, 99999).ToString();
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

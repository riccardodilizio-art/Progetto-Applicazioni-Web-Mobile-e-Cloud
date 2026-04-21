using Hotel.Site.Api.DTOs.Common.Response;
using Hotel.Site.Api.DTOs.Reservations.Request;
using Hotel.Site.Api.DTOs.Reservations.Response;
using Hotel.Site.Application.Abstractions.Services;
using Hotel.Site.Application.Abstractions.UnitOfWork;
using Hotel.Site.Core.Entities;
using Hotel.Site.Core.Entities.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Hotel.Site.Api.Controllers;

[ApiController]
[Route("api/reservations")]
public class RoomReservationController : ControllerBase
{
    private readonly IRoomReservationService _reservationService;
    private readonly IPaymentService _paymentService;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<RoomReservationController> _logger;


    public RoomReservationController(
    IRoomReservationService reservationService,
    IPaymentService paymentService,
    IUnitOfWork unitOfWork,
    ILogger<RoomReservationController> logger)
    {
        _reservationService = reservationService;
        _paymentService = paymentService;
        _unitOfWork = unitOfWork;
        _logger = logger;
    }


    /// <summary>Elenco di tutte le prenotazioni camere (admin).</summary>
    [HttpGet]
    [Authorize(Roles = "ADMIN")]
    [ProducesResponseType(typeof(IEnumerable<RoomReservationAdminResponse>), StatusCodes.Status200OK)]

    public async Task<IActionResult> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        pageSize = Math.Clamp(pageSize, 1, 100);
        var all = await _reservationService.GetAllRoomReservationsAsync();
        var total = all.Count();
        var items = all.Skip((page - 1) * pageSize).Take(pageSize).Select(MapToAdminResponse);
        return Ok(new PagedResponse<RoomReservationAdminResponse>(
            items, page, pageSize, total, (int)Math.Ceiling(total / (double)pageSize)));
    }



    /// <summary>Prenotazioni di uno specifico utente.</summary>
    [HttpGet("user/{userId:guid}")]
    [Authorize(Roles = "ADMIN")]
    [ProducesResponseType(typeof(IEnumerable<RoomReservationResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> GetByUser(Guid userId)
    {
        if (!IsSelfOrAdmin(userId)) return Forbid();

        var reservations = await _reservationService.GetRoomReservationsByUserIdAsync(userId);
        var response = reservations.Select(MapToResponse);
        return Ok(response);
    }

    /// <summary>Dettaglio di una prenotazione.</summary>
    [HttpGet("{id:guid}")]
    [Authorize(Roles = "ADMIN")]
    [ProducesResponseType(typeof(RoomReservationResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(Guid id)
    {
        var reservation = await _reservationService.GetRoomReservationByIdAsync(id);
        if (reservation == null) return NotFound();

        if (!IsSelfOrAdmin(reservation.IdUser)) return Forbid();

        return Ok(MapToResponse(reservation));
    }

    /// <summary>Crea una nuova prenotazione camera con pagamento in attesa.</summary>
    /// <response code="201">Prenotazione creata</response>
    /// <response code="400">Dati non validi (es. CheckOut prima di CheckIn)</response>
    /// <response code="409">Camera già prenotata per le date selezionate</response>
    /// <response code="500">Errore nella transazione</response>
    [HttpPost]
    [Authorize(Roles = "ADMIN")]
    [ProducesResponseType(typeof(RoomReservationResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
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

        await _unitOfWork.BeginTransactionAsync();
        try
        {
            await _reservationService.AddRoomReservationAsync(reservation);
            await _paymentService.CreateForReservationAsync(reservation.IdRoomReservation, reservation.PrezzoTotale);
            await _unitOfWork.SaveChangesAsync();
            await _unitOfWork.CommitTransactionAsync();
        }
        catch (Exception ex)
        {
            await _unitOfWork.RollbackTransactionAsync();
            _logger.LogError(ex, "Errore nella creazione della prenotazione {IdReservation}", reservation.IdRoomReservation);
            return StatusCode(500, new { message = "Errore nella creazione della prenotazione" });
        }

        var full = await _reservationService.GetRoomReservationByIdAsync(reservation.IdRoomReservation);
        return Created($"/api/reservations/{reservation.IdRoomReservation}", MapToResponse(full!));
    }

    /// <summary>Aggiorna lo stato di una prenotazione (admin).</summary>
    [HttpPatch("{id:guid}/status")]
    [Authorize(Roles = "ADMIN")]
    [ProducesResponseType(typeof(RoomReservationAdminResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateStatus(Guid id, [FromBody] RoomReservationStatusRequest request)
    {
        if (!Enum.TryParse<State>(request.Stato, true, out var nuovoStato))
            return BadRequest(new { message = "Stato non valido" });

        var updated = await _reservationService.UpdateRoomReservationStatusAsync(id, nuovoStato);
        if (updated == null) return NotFound();

        return Ok(MapToAdminResponse(updated));

    }



    /// <summary>Cancella una prenotazione.</summary>
    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "ADMIN")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
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
    r.DataPrenotazione,
    r.Payment?.IdPayment,
    r.Payment?.Stato.ToString()
);




    private static RoomReservationAdminResponse MapToAdminResponse(RoomReservation r) => new(
    r.IdRoomReservation,
    r.IdUser,
    r.User?.Email ?? "",
    r.User?.Nome ?? "",
    r.User?.Cognome ?? "",
    r.IdRoom,
    r.Room?.Nome ?? "",
    r.Room?.NumeroCamera ?? 0,
    r.CodiceCena,
    r.CheckIn,
    r.CheckOut,
    r.NumeroNotti,
    r.PrezzoPerNotte,
    r.PrezzoTotale,
    r.Stato.ToString(),
    r.DataPrenotazione,
    r.Payment?.IdPayment,
    r.Payment?.Stato.ToString()
);



}

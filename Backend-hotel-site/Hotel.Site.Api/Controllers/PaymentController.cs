using System.Security.Claims;
using Hotel.Site.Api.DTOs.Payments.Request;
using Hotel.Site.Api.DTOs.Payments.Response;
using Hotel.Site.Application.Abstractions.Services;
using Hotel.Site.Core.Entities;
using Hotel.Site.Core.Entities.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Hotel.Site.Api.Controllers;

[ApiController]
[Route("api/payments")]
public class PaymentController : ControllerBase
{
    private readonly IPaymentService _paymentService;

    public PaymentController(IPaymentService paymentService)
    {
        _paymentService = paymentService;
    }

    [HttpGet("{id:guid}")]
    [Authorize]
    public async Task<IActionResult> GetById(Guid id)
    {
        var p = await _paymentService.GetByIdAsync(id);
        if (p == null) return NotFound();
        if (p.RoomReservation == null) return StatusCode(500, new { message = "Pagamento senza prenotazione associata" });
        if (!IsOwnerOrAdmin(p.RoomReservation.IdUser)) return Forbid();
        return Ok(MapToResponse(p));

    }

    [HttpGet("by-reservation/{idReservation:guid}")]
    [Authorize]
    public async Task<IActionResult> GetByReservation(Guid idReservation)
    {
        var p = await _paymentService.GetByReservationIdAsync(idReservation);
        if (p == null) return NotFound();
        if (p.RoomReservation == null) return StatusCode(500, new { message = "Pagamento senza prenotazione associata" });
        if (!IsOwnerOrAdmin(p.RoomReservation.IdUser)) return Forbid();
        return Ok(MapToResponse(p));
    }

    [HttpPost("{id:guid}/confirm")]
    [Authorize]
    public async Task<IActionResult> Confirm(Guid id, [FromBody] PaymentConfirmRequest request)
    {
        var existing = await _paymentService.GetByIdAsync(id);
        if (existing == null) return NotFound();
        if (existing.RoomReservation == null)
            return StatusCode(500, new { message = "Pagamento senza prenotazione associata" });
        if (!IsOwnerOrAdmin(existing.RoomReservation.IdUser)) return Forbid();

        if (existing.Stato == PaymentStatus.COMPLETATO)
            return Conflict(new { message = "Pagamento già completato" });


        if (!Enum.TryParse<PaymentMethod>(request.Metodo, true, out var metodo))
            return BadRequest(new { message = "Metodo di pagamento non valido" });

        string? ultime4 = null;
        string? titolare = null;

        if (metodo == PaymentMethod.CARTA_CREDITO || metodo == PaymentMethod.CARTA_DEBITO)
        {
            var pan = (request.NumeroCarta ?? "").Replace(" ", "");
            if (!IsValidLuhn(pan) || pan.Length < 13 || pan.Length > 19)
                return BadRequest(new { message = "Numero carta non valido" });
            if (string.IsNullOrWhiteSpace(request.Titolare))
                return BadRequest(new { message = "Titolare obbligatorio" });
            if (!IsValidExpiry(request.Scadenza))
                return BadRequest(new { message = "Scadenza non valida" });
            if (string.IsNullOrWhiteSpace(request.Cvv) || request.Cvv.Length is < 3 or > 4)
                return BadRequest(new { message = "CVV non valido" });

            ultime4 = pan[^4..];
            titolare = request.Titolare.Trim();
        }

        var confirmed = await _paymentService.ConfirmAsync(id, metodo, ultime4, titolare);
        if (confirmed == null) return NotFound();
        return Ok(MapToResponse(confirmed));
    }

    private bool IsOwnerOrAdmin(Guid userId)
    {
        if (User.IsInRole(Role.ADMIN.ToString())) return true;
        var claim = User.FindFirst(ClaimTypes.NameIdentifier);
        return claim != null && Guid.Parse(claim.Value) == userId;
    }

    private static bool IsValidLuhn(string number)
    {
        if (string.IsNullOrWhiteSpace(number) || !number.All(char.IsDigit)) return false;
        int sum = 0;
        bool alt = false;
        for (int i = number.Length - 1; i >= 0; i--)
        {
            int n = number[i] - '0';
            if (alt) { n *= 2; if (n > 9) n -= 9; }
            sum += n;
            alt = !alt;
        }
        return sum % 10 == 0;
    }

    private static bool IsValidExpiry(string? mmYY)
    {
        if (string.IsNullOrWhiteSpace(mmYY)) return false;
        var parts = mmYY.Split('/');
        if (parts.Length != 2) return false;
        if (!int.TryParse(parts[0], out var mm) || mm is < 1 or > 12) return false;
        if (!int.TryParse(parts[1], out var yy)) return false;
        var expiry = new DateTime(2000 + yy, mm, 1).AddMonths(1).AddDays(-1);
        return expiry >= DateTime.UtcNow.Date;
    }

    private static PaymentResponse MapToResponse(Payment p) => new(
        p.IdPayment,
        p.IdRoomReservation,
        p.Importo,
        p.Metodo?.ToString(),
        p.Stato.ToString(),
        p.CartaUltime4,
        p.TitolareCarta,
        string.IsNullOrEmpty(p.TransactionId) ? null : p.TransactionId,
        p.DataCreazione,
        p.DataCompletamento,
        p.RoomReservation?.Room?.Nome ?? "",
        p.RoomReservation?.CheckIn ?? default,
        p.RoomReservation?.CheckOut ?? default,
        p.RoomReservation?.NumeroNotti ?? 0
    );
}

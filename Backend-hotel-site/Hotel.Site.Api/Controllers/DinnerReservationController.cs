using Hotel.Site.Api.DTOs.Dinner;
using Hotel.Site.Api.DTOs.Dinner.Request;
using Hotel.Site.Api.DTOs.Dinner.Response;
using Hotel.Site.Application.Abstractions.Services;
using Hotel.Site.Core.Entities;
using Hotel.Site.Core.Entities.Enums;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace Hotel.Site.Api.Controllers;

[ApiController]
[Route("api/dinner-reservations")]
public class DinnerReservationController : ControllerBase
{
    private readonly IDinnerReservationService _dinnerReservationService;
    private readonly IDinnerOrderService _dinnerOrderService;

    public DinnerReservationController(
        IDinnerReservationService dinnerReservationService,
        IDinnerOrderService dinnerOrderService)
    {
        _dinnerReservationService = dinnerReservationService;
        _dinnerOrderService = dinnerOrderService;
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var reservation = await _dinnerReservationService.GetDinnerReservationByIdAsync(id);
        if (reservation == null) return NotFound();
        return Ok(MapToResponse(reservation));
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create([FromBody] DinnerReservationRequest request)
    {
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

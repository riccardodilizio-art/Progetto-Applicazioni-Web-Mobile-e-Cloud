using Hotel.Site.Api.DTOs.Room.Request;
using Hotel.Site.Api.DTOs.Room.Response;
using Hotel.Site.Application.Abstractions.Services;
using Hotel.Site.Core.Entities;
using Hotel.Site.Core.Entities.Enums;
using Hotel.Site.Core.Entities.Utils;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace Hotel.Site.Api.Controllers;

[ApiController]
[Route("api/rooms")]
public class RoomController : ControllerBase
{
    private readonly IRoomService _roomService;

    public RoomController(IRoomService roomService)
    {
        _roomService = roomService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var rooms = await _roomService.GetAllRoomsAsync();
        var response = rooms.Select(r => MapToResponse(r));
        return Ok(response);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var room = await _roomService.GetRoomByIdAsync(id);
        if (room == null) return NotFound();
        return Ok(MapToResponse(room));
    }

    [HttpPost]
    [Authorize(Roles = "ADMIN")]
    public async Task<IActionResult> Create([FromBody] RoomRequest request)
    {
        if (!Enum.TryParse<RoomType>(request.TipoStanza, true, out var tipoStanza))
            return BadRequest(new { message = "Tipo stanza non valido" });

        var room = new Room
        {
            IdRoom = Guid.NewGuid(),
            Nome = request.Nome,
            TipoStanza = tipoStanza,
            Descrizione = request.Descrizione,
            PrezzoPerNotte = request.PrezzoPerNotte,
            CapacitaMassima = request.CapacitaMassima,
            Dimensione = request.Dimensione,
            Piano = request.Piano,
            NumeroCamera = request.NumeroCamera,
            Disponibile = request.Disponibile,
        };

        var immagini = request.Immagini ?? new List<string>();
        for (int i = 0; i < immagini.Count; i++)
        {
            room.ImmaginiCamera.Add(new RoomImage
            {
                IdRoomImage = Guid.NewGuid(),
                Url = immagini[i],
                Position = i,
                RoomId = room.IdRoom
            });
        }


        var servizi = request.Servizi ?? new List<string>();
        foreach (var servizio in servizi)
        {
            room.ServiziCamera.Add(new RoomAmenity
            {
                IdRoomAmenity = Guid.NewGuid(),
                NomeServizio = servizio,
                RoomId = room.IdRoom
            });
        }

        await _roomService.AddRoomAsync(room);
        return Created($"/api/rooms/{room.IdRoom}", MapToResponse(room));
    }


    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "ADMIN")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await _roomService.DeleteRoomAsync(id);
        return NoContent();
    }

    private static RoomResponse MapToResponse(Room r) => new(
        r.IdRoom,
        r.Nome,
        r.TipoStanza.ToString(),
        r.Descrizione,
        r.PrezzoPerNotte,
        r.CapacitaMassima,
        r.Dimensione,
        r.Piano,
        r.NumeroCamera,
        r.Disponibile,
        r.ImmaginiCamera.OrderBy(i => i.Position).Select(i => i.Url).ToList(),
        r.ServiziCamera.Select(s => s.NomeServizio).ToList()
    );
}

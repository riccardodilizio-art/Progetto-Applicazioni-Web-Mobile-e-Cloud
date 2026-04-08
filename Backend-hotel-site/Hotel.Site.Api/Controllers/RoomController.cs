using Hotel.Site.Api.DTOs.Room;
using Hotel.Site.Api.DTOs.Room.Request;
using Hotel.Site.Api.DTOs.Room.Response;
using Hotel.Site.Application.Abstractions.Services;
using Hotel.Site.Core.Entities;
using Hotel.Site.Core.Entities.Enums;
using Hotel.Site.Core.Entities.Utils;
using Microsoft.AspNetCore.Mvc;

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
    public async Task<IActionResult> Create([FromBody] RoomRequest request)
    {
        var room = new Room
        {
            IdRoom = Guid.NewGuid(),
            Nome = request.Nome,
            TipoStanza = Enum.Parse<RoomType>(request.TipoStanza, true),
            Descrizione = request.Descrizione,
            PrezzoPerNotte = request.PrezzoPerNotte,
            CapacitaMassima = request.CapacitaMassima,
            Dimensione = request.Dimensione,
            Piano = request.Piano,
            NumeroCamera = request.NumeroCamera,
            Disponibilie = request.Disponibile,
        };

        foreach (var (url, i) in request.Immagini.Select((url, i) => (url, i)))
        {
            room.ImmaginiCamera.Add(new RoomImage
            {
                IdRoomImage = Guid.NewGuid(),
                Url = url,
                Position = i,
                RoomId = room.IdRoom
            });
        }

        foreach (var servizio in request.Servizi)
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
        r.Disponibilie,
        r.ImmaginiCamera.OrderBy(i => i.Position).Select(i => i.Url).ToList(),
        r.ServiziCamera.Select(s => s.NomeServizio).ToList()
    );
}

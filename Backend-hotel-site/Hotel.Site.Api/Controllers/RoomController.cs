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

    /// <summary>Elenco di tutte le camere disponibili (pubblico).</summary>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<RoomResponse>), StatusCodes.Status200OK)]

    public async Task<IActionResult> GetAll()
    {
        var rooms = await _roomService.GetAllRoomsAsync();
        var response = rooms.Select(r => MapToResponse(r));
        return Ok(response);
    }

    /// <summary>Aggiorna una camera esistente (admin).</summary>
    [HttpPut("{id:guid}")]
    [Authorize(Roles = "ADMIN")]
    [ProducesResponseType(typeof(RoomResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(Guid id, [FromBody] RoomUpdateRequest request)
    {
        if (!Enum.TryParse<RoomType>(request.TipoStanza, true, out var tipoStanza))
            return BadRequest(new { message = "Tipo stanza non valido" });

        var updated = new Room
        {
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
        var servizi = request.Servizi ?? new List<string>();

        var result = await _roomService.UpdateRoomAsync(id, updated, immagini, servizi);
        if (result == null) return NotFound();

        return Ok(MapToResponse(result));
    }

    /// <summary>Dettaglio di una singola camera.</summary>
    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(RoomResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(Guid id)
    {
        var room = await _roomService.GetRoomByIdAsync(id);
        if (room == null) return NotFound();
        return Ok(MapToResponse(room));
    }

    /// <summary>Crea una nuova camera (admin).</summary>
    [HttpPost]
    [Authorize(Roles = "ADMIN")]
    [ProducesResponseType(typeof(RoomResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
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

    /// <summary>Cancella una camera (admin).</summary>
    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "ADMIN")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
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

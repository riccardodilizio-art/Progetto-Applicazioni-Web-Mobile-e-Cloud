using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using Hotel.Site.Application.Abstractions.Repositories;
using Hotel.Site.Core.Entities;
using Hotel.Site.Core.Entities.Utils;

namespace Hotel.Site.Infrastructure.Persistence.Repositories
{
    public class RoomRepository : IRoomRepository
    {
        public RoomRepository(HotelSiteContext context)
        {
            Context = context;
        }
        public HotelSiteContext Context { get; set; }

        public async Task<Room?> GetRoomByIdAsync(Guid id)
        {
            return await Context.Rooms
                .Include(r => r.ImmaginiCamera)
                .Include(r => r.ServiziCamera)
                .Where(w => w.IdRoom == id)
                .FirstOrDefaultAsync();
        }

        public async Task<IEnumerable<Room>> GetAllRoomsAsync()
        {
            return await Context.Rooms
                .Include(r => r.ImmaginiCamera)
                .Include(r => r.ServiziCamera)
                .ToListAsync();
        }

        public async Task AddRoomAsync(Room room)
        {
            await Context.Rooms.AddAsync(room);
        }

        public async Task<Room?> UpdateRoomAsync(Guid id, Room updated, List<string> immagini, List<string> servizi)
        {
            var existing = await Context.Rooms
                .Include(r => r.ImmaginiCamera)
                .Include(r => r.ServiziCamera)
                .FirstOrDefaultAsync(r => r.IdRoom == id);

            if (existing == null) return null;

            existing.Nome = updated.Nome;
            existing.TipoStanza = updated.TipoStanza;
            existing.Descrizione = updated.Descrizione;
            existing.PrezzoPerNotte = updated.PrezzoPerNotte;
            existing.CapacitaMassima = updated.CapacitaMassima;
            existing.Dimensione = updated.Dimensione;
            existing.Piano = updated.Piano;
            existing.NumeroCamera = updated.NumeroCamera;
            existing.Disponibile = updated.Disponibile;

            // Replace immagini: rimuovo tutte le vecchie, aggiungo le nuove
            Context.RemoveRange(existing.ImmaginiCamera);
            existing.ImmaginiCamera.Clear();
            for (int i = 0; i < immagini.Count; i++)
            {
                existing.ImmaginiCamera.Add(new RoomImage
                {
                    IdRoomImage = Guid.NewGuid(),
                    Url = immagini[i],
                    Position = i,
                    RoomId = existing.IdRoom
                });
            }

            // Replace servizi
            Context.RemoveRange(existing.ServiziCamera);
            existing.ServiziCamera.Clear();
            foreach (var servizio in servizi)
            {
                existing.ServiziCamera.Add(new RoomAmenity
                {
                    IdRoomAmenity = Guid.NewGuid(),
                    NomeServizio = servizio,
                    RoomId = existing.IdRoom
                });
            }

            return existing;
        }

        public async Task DeleteRoomAsync(Guid id)
        {
            var room = new Room() { IdRoom = id };
            Context.Entry(room).State = EntityState.Deleted;
        }
    }
}

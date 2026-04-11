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

            // Cancella i figli vecchi con SQL diretto (bypassa il change tracker)
            await Context.Set<RoomImage>().Where(x => x.RoomId == id).ExecuteDeleteAsync();
            await Context.Set<RoomAmenity>().Where(x => x.RoomId == id).ExecuteDeleteAsync();

            // Aggiungi i nuovi figli direttamente via DbSet.
            // EF fa relationship fixup automatico e popola existing.ImmaginiCamera / ServiziCamera.
            for (int i = 0; i < immagini.Count; i++)
            {
                await Context.Set<RoomImage>().AddAsync(new RoomImage
                {
                    IdRoomImage = Guid.NewGuid(),
                    Url = immagini[i],
                    Position = i,
                    RoomId = id
                });
            }
            foreach (var servizio in servizi)
            {
                await Context.Set<RoomAmenity>().AddAsync(new RoomAmenity
                {
                    IdRoomAmenity = Guid.NewGuid(),
                    NomeServizio = servizio,
                    RoomId = id
                });
            }

            return existing;
        }

        public async Task DeleteRoomAsync(Guid id)
        {
            var room = await Context.Rooms.FindAsync(id);
            if (room != null)
                Context.Rooms.Remove(room);
        }

    }
}

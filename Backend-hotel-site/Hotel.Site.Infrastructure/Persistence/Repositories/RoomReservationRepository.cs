using Hotel.Site.Application.Abstractions.Repositories;
using Hotel.Site.Core.Entities;
using Hotel.Site.Core.Entities.Enums;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace Hotel.Site.Infrastructure.Persistence.Repositories
{
    public class RoomReservationRepository : IRoomReservationRepository
    {
        public RoomReservationRepository(HotelSiteContext context)
        {
            Context = context;
        }
        public HotelSiteContext Context { get; set; }

        public async Task<RoomReservation?> GetRoomReservationByIdAsync(Guid id)
        {
            return await Context.RoomReservations
                .Include(r => r.User)
                .Include(r => r.Room)
                .Where(w => w.IdRoomReservation == id)
                .FirstOrDefaultAsync();
        }
        public async Task<bool> HasOverlappingReservationAsync(Guid idRoom, DateOnly checkIn, DateOnly checkOut)
        {
            // Due intervalli [a1, a2) e [b1, b2) si sovrappongono se a1 < b2 E b1 < a2.
            // Le prenotazioni annullate non contano.
            return await Context.RoomReservations
                .Where(r => r.IdRoom == idRoom)
                .Where(r => r.Stato != State.ANNULLATO)
                .Where(r => r.CheckIn < checkOut && checkIn < r.CheckOut)
                .AnyAsync();
        }

        public async Task<RoomReservation?> GetRoomReservationByCodiceCenaAsync(string codiceCena)
        {
            return await Context.RoomReservations
                .Include(r => r.Room)
                .Where(w => w.CodiceCena == codiceCena)
                .FirstOrDefaultAsync();
        }


        public async Task<IEnumerable<RoomReservation>> GetRoomReservationsByUserIdAsync(Guid idUser)
        {
            return await Context.RoomReservations
                .Include(r => r.Room)
                .Where(w => w.IdUser == idUser)
                .ToListAsync();
        }

        public async Task<IEnumerable<RoomReservation>> GetRoomReservationsByRoomIdAsync(Guid idRoom)
        {
            return await Context.RoomReservations
                .Include(r => r.User)
                .Where(w => w.IdRoom == idRoom)
                .ToListAsync();
        }

        public async Task AddRoomReservationAsync(RoomReservation roomReservation)
        {
            await Context.RoomReservations.AddAsync(roomReservation);
        }

        public async Task EditRoomReservationAsync(RoomReservation roomReservation)
        {
            Context.Entry(roomReservation).State = EntityState.Modified;
        }

        public async Task DeleteRoomReservationAsync(Guid id)
        {
            var reservation = new RoomReservation() { IdRoomReservation = id };
            Context.Entry(reservation).State = EntityState.Deleted;
        }
    }
}

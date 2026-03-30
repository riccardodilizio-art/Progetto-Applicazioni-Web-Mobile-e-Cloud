using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;
using Hotel.Site.Application.Abstractions.Repositories;
using Hotel.Site.Core.Entities;

namespace Hotel.Site.Infrastructure.Persistence.Repositories
{
    public class RoomReservationRepository : IRoomReservationRepository
    {
        public RoomReservationRepository(HotelSiteContext context)
        {
            Context = context;
        }
        public HotelSiteContext Context { get; set; }

        public async Task<RoomReservation> GetRoomReservationByIdAsync(Guid id)
        {
            return await Context.RoomReservations
                .Include(r => r.User)
                .Include(r => r.Room)
                .Where(w => w.IdRoomReservation == id)
                .FirstAsync();
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

using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;
using Hotel.Site.Application.Abstractions.Repositories;
using Hotel.Site.Core.Entities;

namespace Hotel.Site.Infrastructure.Persistence.Repositories
{
    public class RoomRepository : IRoomRepository
    {
        public RoomRepository(HotelSiteContext context)
        {
            Context = context;
        }
        public HotelSiteContext Context { get; set; }

        public async Task<Room> GetRoomByIdAsync(Guid id)
        {
            return await Context.Rooms
                .Include(r => r.ImmaginiCamera)
                .Include(r => r.ServiziCamera)
                .Where(w => w.IdRoom == id)
                .FirstAsync();
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

        public async Task EditRoomAsync(Room room)
        {
            Context.Entry(room).State = EntityState.Modified;
        }

        public async Task DeleteRoomAsync(Guid id)
        {
            var room = new Room() { IdRoom = id };
            Context.Entry(room).State = EntityState.Deleted;
        }
    }
}

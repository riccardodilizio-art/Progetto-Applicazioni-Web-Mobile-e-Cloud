using System;
using System.Collections.Generic;
using System.Text;
using Hotel.Site.Core.Entities;

namespace Hotel.Site.Application.Abstractions.Repositories
{
    public interface IRoomRepository
    {
        Task<Room?> GetRoomByIdAsync(Guid id);
        Task<IEnumerable<Room>> GetAllRoomsAsync();
        Task AddRoomAsync(Room room);
        Task<Room?> UpdateRoomAsync(Guid id, Room updated, List<string> immagini, List<string> servizi);
        Task DeleteRoomAsync(Guid id);
    }
}

using System;
using System.Collections.Generic;
using System.Text;
using Hotel.Site.Core.Entities;

namespace Hotel.Site.Application.Abstractions.Services
{
    public interface IRoomReservationService
    {
        Task<RoomReservation> GetRoomReservationByIdAsync(Guid id);
        Task<IEnumerable<RoomReservation>> GetRoomReservationsByUserIdAsync(Guid idUser);
        Task<IEnumerable<RoomReservation>> GetRoomReservationsByRoomIdAsync(Guid idRoom);
        Task AddRoomReservationAsync(RoomReservation roomReservation);
        Task EditRoomReservationAsync(RoomReservation roomReservation);
        Task DeleteRoomReservationAsync(Guid id);
    }
}

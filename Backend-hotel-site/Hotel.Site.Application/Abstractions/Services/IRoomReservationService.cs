using System;
using System.Collections.Generic;
using System.Text;
using Hotel.Site.Core.Entities;
using Hotel.Site.Core.Entities.Enums;

namespace Hotel.Site.Application.Abstractions.Services
{
    public interface IRoomReservationService
    {
        Task<RoomReservation?> GetRoomReservationByIdAsync(Guid id);
        Task<RoomReservation?> GetRoomReservationByCodiceCenaAsync(string codiceCena);
        Task<IEnumerable<RoomReservation>> GetRoomReservationsByUserIdAsync(Guid idUser);
        Task<IEnumerable<RoomReservation>> GetRoomReservationsByRoomIdAsync(Guid idRoom);
        Task<bool> HasOverlappingReservationAsync(Guid idRoom, DateOnly checkIn, DateOnly checkOut);
        Task AddRoomReservationAsync(RoomReservation roomReservation);
        Task<RoomReservation?> UpdateRoomReservationStatusAsync(Guid id, State nuovoStato);
        Task DeleteRoomReservationAsync(Guid id);
    }
}

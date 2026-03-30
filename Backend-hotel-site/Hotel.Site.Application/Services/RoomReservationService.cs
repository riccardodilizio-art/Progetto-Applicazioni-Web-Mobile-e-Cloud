using System;
using System.Collections.Generic;
using System.Text;
using Hotel.Site.Application.Abstractions.Services;
using Hotel.Site.Application.Abstractions.UnitOfWork;
using Hotel.Site.Core.Entities;

namespace Hotel.Site.Application.Services
{
    public class RoomReservationService : IRoomReservationService
    {
        private readonly IUnitOfWork _unitOfWork;

        public RoomReservationService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<RoomReservation> GetRoomReservationByIdAsync(Guid id)
        {
            return await _unitOfWork.RoomReservationRepository.GetRoomReservationByIdAsync(id);
        }

        public async Task<IEnumerable<RoomReservation>> GetRoomReservationsByUserIdAsync(Guid idUser)
        {
            return await _unitOfWork.RoomReservationRepository.GetRoomReservationsByUserIdAsync(idUser);
        }

        public async Task<IEnumerable<RoomReservation>> GetRoomReservationsByRoomIdAsync(Guid idRoom)
        {
            return await _unitOfWork.RoomReservationRepository.GetRoomReservationsByRoomIdAsync(idRoom);
        }

        public async Task AddRoomReservationAsync(RoomReservation roomReservation)
        {
            await _unitOfWork.RoomReservationRepository.AddRoomReservationAsync(roomReservation);
            await _unitOfWork.SaveChangesAsync();
        }

        public async Task EditRoomReservationAsync(RoomReservation roomReservation)
        {
            await _unitOfWork.RoomReservationRepository.EditRoomReservationAsync(roomReservation);
            await _unitOfWork.SaveChangesAsync();
        }

        public async Task DeleteRoomReservationAsync(Guid id)
        {
            await _unitOfWork.RoomReservationRepository.DeleteRoomReservationAsync(id);
            await _unitOfWork.SaveChangesAsync();
        }
    }
}

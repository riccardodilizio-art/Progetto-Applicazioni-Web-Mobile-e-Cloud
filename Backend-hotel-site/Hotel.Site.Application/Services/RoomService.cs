using System;
using System.Collections.Generic;
using System.Text;
using Hotel.Site.Application.Abstractions.Services;
using Hotel.Site.Application.Abstractions.UnitOfWork;
using Hotel.Site.Core.Entities;

namespace Hotel.Site.Application.Services
{
    public class RoomService : IRoomService
    {
        private readonly IUnitOfWork _unitOfWork;

        public RoomService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<Room> GetRoomByIdAsync(Guid id)
        {
            return await _unitOfWork.RoomRepository.GetRoomByIdAsync(id);
        }

        public async Task<IEnumerable<Room>> GetAllRoomsAsync()
        {
            return await _unitOfWork.RoomRepository.GetAllRoomsAsync();
        }

        public async Task AddRoomAsync(Room room)
        {
            await _unitOfWork.RoomRepository.AddRoomAsync(room);
            await _unitOfWork.SaveChangesAsync();
        }

        public async Task EditRoomAsync(Room room)
        {
            await _unitOfWork.RoomRepository.EditRoomAsync(room);
            await _unitOfWork.SaveChangesAsync();
        }

        public async Task DeleteRoomAsync(Guid id)
        {
            await _unitOfWork.RoomRepository.DeleteRoomAsync(id);
            await _unitOfWork.SaveChangesAsync();
        }
    }
}

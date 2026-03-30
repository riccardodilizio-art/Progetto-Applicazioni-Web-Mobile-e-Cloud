using System;
using System.Collections.Generic;
using System.Text;
using Hotel.Site.Application.Abstractions.Services;
using Hotel.Site.Application.Abstractions.UnitOfWork;
using Hotel.Site.Core.Entities;

namespace Hotel.Site.Application.Services
{
    public class DinnerReservationService : IDinnerReservationService
    {
        private readonly IUnitOfWork _unitOfWork;

        public DinnerReservationService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<DinnerReservation> GetDinnerReservationByIdAsync(Guid id)
        {
            return await _unitOfWork.DinnerReservationRepository.GetDinnerReservationByIdAsync(id);
        }

        public async Task<IEnumerable<DinnerReservation>> GetDinnerReservationsByDateAsync(DateOnly data)
        {
            return await _unitOfWork.DinnerReservationRepository.GetDinnerReservationsByDateAsync(data);
        }

        public async Task AddDinnerReservationAsync(DinnerReservation dinnerReservation)
        {
            await _unitOfWork.DinnerReservationRepository.AddDinnerReservationAsync(dinnerReservation);
            await _unitOfWork.SaveChangesAsync();
        }

        public async Task EditDinnerReservationAsync(DinnerReservation dinnerReservation)
        {
            await _unitOfWork.DinnerReservationRepository.EditDinnerReservationAsync(dinnerReservation);
            await _unitOfWork.SaveChangesAsync();
        }

        public async Task DeleteDinnerReservationAsync(Guid id)
        {
            await _unitOfWork.DinnerReservationRepository.DeleteDinnerReservationAsync(id);
            await _unitOfWork.SaveChangesAsync();
        }
    }
}

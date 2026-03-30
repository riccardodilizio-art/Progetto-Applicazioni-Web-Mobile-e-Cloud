using System;
using System.Collections.Generic;
using System.Text;
using Hotel.Site.Application.Abstractions.Services;
using Hotel.Site.Application.Abstractions.UnitOfWork;
using Hotel.Site.Core.Entities;

namespace Hotel.Site.Application.Services
{
    public class DinnerOrderService : IDinnerOrderService
    {
        private readonly IUnitOfWork _unitOfWork;

        public DinnerOrderService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<DinnerOrder> GetDinnerOrderByIdAsync(Guid id)
        {
            return await _unitOfWork.DinnerOrderRepository.GetDinnerOrderByIdAsync(id);
        }

        public async Task<IEnumerable<DinnerOrder>> GetDinnerOrdersByReservationIdAsync(Guid idDinnerReservation)
        {
            return await _unitOfWork.DinnerOrderRepository.GetDinnerOrdersByReservationIdAsync(idDinnerReservation);
        }

        public async Task AddDinnerOrderAsync(DinnerOrder dinnerOrder)
        {
            await _unitOfWork.DinnerOrderRepository.AddDinnerOrderAsync(dinnerOrder);
            await _unitOfWork.SaveChangesAsync();
        }

        public async Task EditDinnerOrderAsync(DinnerOrder dinnerOrder)
        {
            await _unitOfWork.DinnerOrderRepository.EditDinnerOrderAsync(dinnerOrder);
            await _unitOfWork.SaveChangesAsync();
        }

        public async Task DeleteDinnerOrderAsync(Guid id)
        {
            await _unitOfWork.DinnerOrderRepository.DeleteDinnerOrderAsync(id);
            await _unitOfWork.SaveChangesAsync();
        }
    }
}

using Hotel.Site.Application.Abstractions.Services;
using Hotel.Site.Application.Abstractions.UnitOfWork;
using Hotel.Site.Core.Entities;
using Hotel.Site.Core.Entities.Enums;

namespace Hotel.Site.Application.Services
{
    public class DinnerReservationService : IDinnerReservationService
    {
        private readonly IUnitOfWork _unitOfWork;

        public DinnerReservationService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<DinnerReservation?> GetDinnerReservationByIdAsync(Guid id)
        {
            return await _unitOfWork.DinnerReservationRepository.GetDinnerReservationByIdAsync(id);
        }

        public async Task<DinnerReservation?> GetDinnerReservationByCodiceCenaAsync(string codiceCena)
        {
            return await _unitOfWork.DinnerReservationRepository.GetDinnerReservationByCodiceCenaAsync(codiceCena);
        }

        public async Task<IEnumerable<DinnerReservation>> GetDinnerReservationsByDateAsync(DateOnly data)
        {
            return await _unitOfWork.DinnerReservationRepository.GetDinnerReservationsByDateAsync(data);
        }

        public async Task<IEnumerable<DinnerReservation>> GetAllDinnerReservationsAsync()
        {
            return await _unitOfWork.DinnerReservationRepository.GetAllDinnerReservationsAsync();
        }

        public async Task AddDinnerReservationAsync(DinnerReservation dinnerReservation)
        {
            await _unitOfWork.DinnerReservationRepository.AddDinnerReservationAsync(dinnerReservation);
            await _unitOfWork.SaveChangesAsync();
        }

        public async Task<DinnerReservation?> UpdateDinnerReservationStatusAsync(Guid id, DinnerState nuovoStato)
        {
            var result = await _unitOfWork.DinnerReservationRepository.UpdateDinnerReservationStatusAsync(id, nuovoStato);
            if (result != null)
                await _unitOfWork.SaveChangesAsync();
            return result;
        }

        public async Task DeleteDinnerReservationAsync(Guid id)
        {
            await _unitOfWork.DinnerReservationRepository.DeleteDinnerReservationAsync(id);
            await _unitOfWork.SaveChangesAsync();
        }
    }
}

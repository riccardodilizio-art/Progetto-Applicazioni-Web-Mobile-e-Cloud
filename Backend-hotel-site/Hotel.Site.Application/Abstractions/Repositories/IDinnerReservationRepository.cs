using Hotel.Site.Core.Entities;
using Hotel.Site.Core.Entities.Enums;

namespace Hotel.Site.Application.Abstractions.Repositories
{
    public interface IDinnerReservationRepository
    {
        Task<DinnerReservation?> GetDinnerReservationByIdAsync(Guid id);
        Task<DinnerReservation?> GetDinnerReservationByCodiceCenaAsync(string codiceCena);
        Task<IEnumerable<DinnerReservation>> GetDinnerReservationsByDateAsync(DateOnly data);
        Task<IEnumerable<DinnerReservation>> GetAllDinnerReservationsAsync();
        Task AddDinnerReservationAsync(DinnerReservation dinnerReservation);
        Task<DinnerReservation?> UpdateDinnerReservationStatusAsync(Guid id, DinnerState nuovoStato);
        Task DeleteDinnerReservationAsync(Guid id);
    }
}

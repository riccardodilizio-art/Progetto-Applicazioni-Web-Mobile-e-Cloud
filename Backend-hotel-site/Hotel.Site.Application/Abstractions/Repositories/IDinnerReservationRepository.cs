using System;
using System.Collections.Generic;
using System.Text;
using Hotel.Site.Core.Entities;

namespace Hotel.Site.Application.Abstractions.Repositories
{
    public interface IDinnerReservationRepository
    {
        Task<DinnerReservation?> GetDinnerReservationByIdAsync(Guid id);
        Task<DinnerReservation?> GetDinnerReservationByCodiceCenaAsync(string codiceCena);

        Task<IEnumerable<DinnerReservation>> GetDinnerReservationsByDateAsync(DateOnly data);
        Task AddDinnerReservationAsync(DinnerReservation dinnerReservation);
        Task EditDinnerReservationAsync(DinnerReservation dinnerReservation);
        Task DeleteDinnerReservationAsync(Guid id);
    }
}

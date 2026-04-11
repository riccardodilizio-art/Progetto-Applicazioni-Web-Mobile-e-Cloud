using Hotel.Site.Core.Entities;
using Hotel.Site.Core.Entities.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace Hotel.Site.Application.Abstractions.Services
{
    public interface IDinnerReservationService
    {
        Task<DinnerReservation?> GetDinnerReservationByIdAsync(Guid id);
        Task<DinnerReservation?> GetDinnerReservationByCodiceCenaAsync(string codiceCena);

        Task<IEnumerable<DinnerReservation>> GetDinnerReservationsByDateAsync(DateOnly data);
        Task AddDinnerReservationAsync(DinnerReservation dinnerReservation);
        Task<DinnerReservation?> UpdateDinnerReservationStatusAsync(Guid id, DinnerState nuovoStato);
        Task DeleteDinnerReservationAsync(Guid id);
    }
}

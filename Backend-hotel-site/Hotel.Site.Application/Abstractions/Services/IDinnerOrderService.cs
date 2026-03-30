using System;
using System.Collections.Generic;
using System.Text;
using Hotel.Site.Core.Entities;

namespace Hotel.Site.Application.Abstractions.Services
{
    public interface IDinnerOrderService
    {
        Task<DinnerOrder> GetDinnerOrderByIdAsync(Guid id);
        Task<IEnumerable<DinnerOrder>> GetDinnerOrdersByReservationIdAsync(Guid idDinnerReservation);
        Task AddDinnerOrderAsync(DinnerOrder dinnerOrder);
        Task EditDinnerOrderAsync(DinnerOrder dinnerOrder);
        Task DeleteDinnerOrderAsync(Guid id);
    }
}

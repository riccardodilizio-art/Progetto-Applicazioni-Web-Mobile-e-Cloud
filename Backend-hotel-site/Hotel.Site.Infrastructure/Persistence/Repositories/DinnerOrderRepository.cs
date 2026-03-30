using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;
using Hotel.Site.Application.Abstractions.Repositories;
using Hotel.Site.Core.Entities;

namespace Hotel.Site.Infrastructure.Persistence.Repositories
{
    public class DinnerOrderRepository : IDinnerOrderRepository
    {
        public DinnerOrderRepository(HotelSiteContext context)
        {
            Context = context;
        }
        public HotelSiteContext Context { get; set; }

        public async Task<DinnerOrder> GetDinnerOrderByIdAsync(Guid id)
        {
            return await Context.DinnerOrders
                .Where(w => w.Id == id)
                .FirstAsync();
        }

        public async Task<IEnumerable<DinnerOrder>> GetDinnerOrdersByReservationIdAsync(Guid idDinnerReservation)
        {
            return await Context.DinnerOrders
                .Where(w => w.DinnerReservationId == idDinnerReservation)
                .ToListAsync();
        }

        public async Task AddDinnerOrderAsync(DinnerOrder dinnerOrder)
        {
            await Context.DinnerOrders.AddAsync(dinnerOrder);
        }

        public async Task EditDinnerOrderAsync(DinnerOrder dinnerOrder)
        {
            Context.Entry(dinnerOrder).State = EntityState.Modified;
        }

        public async Task DeleteDinnerOrderAsync(Guid id)
        {
            var order = new DinnerOrder() { Id = id };
            Context.Entry(order).State = EntityState.Deleted;
        }
    }
}

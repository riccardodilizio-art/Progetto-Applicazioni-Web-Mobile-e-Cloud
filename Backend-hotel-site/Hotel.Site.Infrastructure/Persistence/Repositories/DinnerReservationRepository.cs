using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;
using Hotel.Site.Application.Abstractions.Repositories;
using Hotel.Site.Core.Entities;

namespace Hotel.Site.Infrastructure.Persistence.Repositories
{
    public class DinnerReservationRepository : IDinnerReservationRepository
    {
        public DinnerReservationRepository(HotelSiteContext context)
        {
            Context = context;
        }
        public HotelSiteContext Context { get; set; }

        public async Task<DinnerReservation?> GetDinnerReservationByIdAsync(Guid id)
        {
            return await Context.DinnerReservations
                .Include(d => d.Ordini)
                .Where(w => w.Id == id)
                .FirstOrDefaultAsync();
        }

        public async Task<IEnumerable<DinnerReservation>> GetDinnerReservationsByDateAsync(DateOnly data)
        {
            return await Context.DinnerReservations
                .Include(d => d.Ordini)
                .Where(w => w.Data == data)
                .ToListAsync();
        }
        public async Task<DinnerReservation?> GetDinnerReservationByCodiceCenaAsync(string codiceCena)
        {
            return await Context.DinnerReservations
                .Include(d => d.Ordini)
                .Where(w => w.CodiceCena == codiceCena)
                .FirstOrDefaultAsync();
        }


        public async Task AddDinnerReservationAsync(DinnerReservation dinnerReservation)
        {
            await Context.DinnerReservations.AddAsync(dinnerReservation);
        }

        public async Task EditDinnerReservationAsync(DinnerReservation dinnerReservation)
        {
            Context.Entry(dinnerReservation).State = EntityState.Modified;
        }

        public async Task DeleteDinnerReservationAsync(Guid id)
        {
            var reservation = new DinnerReservation() { Id = id };
            Context.Entry(reservation).State = EntityState.Deleted;
        }
    }
}

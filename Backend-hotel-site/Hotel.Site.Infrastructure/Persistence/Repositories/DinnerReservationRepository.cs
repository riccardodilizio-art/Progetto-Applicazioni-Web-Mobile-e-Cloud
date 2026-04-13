using Hotel.Site.Application.Abstractions.Repositories;
using Hotel.Site.Core.Entities;
using Hotel.Site.Core.Entities.Enums;
using Microsoft.EntityFrameworkCore;

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

        public async Task<DinnerReservation?> UpdateDinnerReservationStatusAsync(Guid id, DinnerState nuovoStato)
        {
            var existing = await Context.DinnerReservations
                .Include(d => d.Ordini)
                .FirstOrDefaultAsync(d => d.Id == id);

            if (existing == null) return null;

            existing.StatoPrenotazione = nuovoStato;
            return existing;
        }

        public async Task DeleteDinnerReservationAsync(Guid id)
        {
            var reservation = await Context.DinnerReservations.FindAsync(id);
            if (reservation != null)
                Context.DinnerReservations.Remove(reservation);
        }
    }
}

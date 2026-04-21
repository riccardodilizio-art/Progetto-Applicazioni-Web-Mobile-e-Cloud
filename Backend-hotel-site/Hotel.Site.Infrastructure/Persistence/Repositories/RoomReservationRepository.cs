using Hotel.Site.Application.Abstractions.Repositories;
using Hotel.Site.Core.Entities;
using Hotel.Site.Core.Entities.Enums;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace Hotel.Site.Infrastructure.Persistence.Repositories
{
    public class RoomReservationRepository : IRoomReservationRepository
    {
        public RoomReservationRepository(HotelSiteContext context)
        {
            Context = context;
        }
        public HotelSiteContext Context { get; set; }

        public async Task<RoomReservation?> GetRoomReservationByIdAsync(Guid id)
        {
            return await Context.RoomReservations
                .Include(r => r.User)
                .Include(r => r.Room)
                .Include(r => r.Payment)
                .Where(w => w.IdRoomReservation == id)
                .FirstOrDefaultAsync();
        }


        public async Task<bool> HasOverlappingReservationAsync(Guid idRoom, DateOnly checkIn, DateOnly checkOut)
        {
            // Soglia: una prenotazione IN_ATTESA non pagata oltre 15 minuti non blocca più la camera.
            var soglia = DateTime.UtcNow.AddMinutes(-15);

            return await Context.RoomReservations
                .Include(r => r.Payment)
                .Where(r => r.IdRoom == idRoom)
                .Where(r => r.Stato != State.ANNULLATO)
                .Where(r =>
                    r.Stato == State.CONFERMATO
                    || (r.Payment != null && r.Payment.Stato == PaymentStatus.COMPLETATO)
                    || r.DataPrenotazione > soglia)
                .Where(r => r.CheckIn < checkOut && checkIn < r.CheckOut)
                .AnyAsync();
        }


        public async Task<RoomReservation?> GetRoomReservationByCodiceCenaAsync(string codiceCena)
        {
            return await Context.RoomReservations
                .Include(r => r.Room)
                .Where(w => w.CodiceCena == codiceCena)
                .FirstOrDefaultAsync();
        }


        public async Task<IEnumerable<RoomReservation>> GetRoomReservationsByUserIdAsync(Guid idUser)
        {
            return await Context.RoomReservations
                .Include(r => r.Room)
                .Include(r => r.Payment)
                .Where(w => w.IdUser == idUser)
                .ToListAsync();
        }


        public async Task<IEnumerable<RoomReservation>> GetRoomReservationsByRoomIdAsync(Guid idRoom)
        {
            return await Context.RoomReservations
                .Include(r => r.User)
                .Where(w => w.IdRoom == idRoom)
                .ToListAsync();
        }


        public async Task<IEnumerable<RoomReservation>> GetAllRoomReservationsAsync()
        {
            return await Context.RoomReservations
                .Include(r => r.User)
                .Include(r => r.Room)
                .Include(r => r.Payment)
                .OrderByDescending(r => r.DataPrenotazione)
                .ToListAsync();
        }


        public async Task<IEnumerable<RoomReservation>> GetRoomReservationsByCodiciCenaAsync(IEnumerable<string> codiciCena)
        {
            var codiciList = codiciCena.ToList();
            if (codiciList.Count == 0) return Array.Empty<RoomReservation>();

            return await Context.RoomReservations
                .Include(r => r.User)
                .Include(r => r.Room)
                .Where(r => codiciList.Contains(r.CodiceCena))
                .ToListAsync();
        }


        public async Task AddRoomReservationAsync(RoomReservation roomReservation)
        {
            await Context.RoomReservations.AddAsync(roomReservation);
        }

        public async Task<RoomReservation?> UpdateRoomReservationStatusAsync(Guid id, State nuovoStato)
        {
            var existing = await Context.RoomReservations
                .Include(r => r.User)
                .Include(r => r.Room)
                .FirstOrDefaultAsync(r => r.IdRoomReservation == id);

            if (existing == null) return null;

            existing.Stato = nuovoStato;
            return existing;
        }


        public async Task DeleteRoomReservationAsync(Guid id)
        {
            var reservation = await Context.RoomReservations.FindAsync(id);
            if (reservation != null)
                Context.RoomReservations.Remove(reservation);
        }

        public async Task<(IEnumerable<RoomReservation> Items, int Total)> GetPagedAsync(int skip, int take)
        {
            var query = Context.RoomReservations
                .Include(r => r.User)
                .Include(r => r.Room)
                .Include(r => r.Payment);

            var total = await query.CountAsync();
            var items = await query
                .OrderByDescending(r => r.DataPrenotazione)
                .Skip(skip).Take(take)
                .AsNoTracking()
                .ToListAsync();

            return (items, total);
        }


    }
}

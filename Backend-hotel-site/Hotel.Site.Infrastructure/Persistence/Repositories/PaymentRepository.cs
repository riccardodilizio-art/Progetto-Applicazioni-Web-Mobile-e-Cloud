using Hotel.Site.Application.Abstractions.Repositories;
using Hotel.Site.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace Hotel.Site.Infrastructure.Persistence.Repositories
{
    public class PaymentRepository : IPaymentRepository
    {
        public PaymentRepository(HotelSiteContext context) { Context = context; }
        public HotelSiteContext Context { get; set; }

        public async Task<Payment?> GetByIdAsync(Guid id)
        {
            return await Context.Payments
                .Include(p => p.RoomReservation)
                    .ThenInclude(r => r.Room)
                .FirstOrDefaultAsync(p => p.IdPayment == id);
        }

        public async Task<Payment?> GetByReservationIdAsync(Guid idReservation)
        {
            return await Context.Payments
                .Include(p => p.RoomReservation)
                    .ThenInclude(r => r.Room)
                .FirstOrDefaultAsync(p => p.IdRoomReservation == idReservation);
        }

        public async Task AddAsync(Payment payment)
        {
            await Context.Payments.AddAsync(payment);
        }
    }
}

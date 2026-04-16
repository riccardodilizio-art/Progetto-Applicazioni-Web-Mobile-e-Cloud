using Hotel.Site.Core.Entities;
using Hotel.Site.Core.Entities.Enums;

namespace Hotel.Site.Application.Abstractions.Services
{
    public interface IPaymentService
    {
        Task<Payment?> GetByIdAsync(Guid id);
        Task<Payment?> GetByReservationIdAsync(Guid idReservation);
        Task CreateForReservationAsync(Guid idReservation, decimal importo);
        Task<Payment?> ConfirmAsync(Guid idPayment, PaymentMethod metodo, string? cartaUltime4, string? titolare);
    }
}

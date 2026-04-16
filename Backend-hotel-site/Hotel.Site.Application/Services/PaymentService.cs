using Hotel.Site.Application.Abstractions.Services;
using Hotel.Site.Application.Abstractions.UnitOfWork;
using Hotel.Site.Core.Entities;
using Hotel.Site.Core.Entities.Enums;

namespace Hotel.Site.Application.Services
{
    public class PaymentService : IPaymentService
    {
        private readonly IUnitOfWork _unitOfWork;

        public PaymentService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public Task<Payment?> GetByIdAsync(Guid id) =>
            _unitOfWork.PaymentRepository.GetByIdAsync(id);

        public Task<Payment?> GetByReservationIdAsync(Guid idReservation) =>
            _unitOfWork.PaymentRepository.GetByReservationIdAsync(idReservation);

        public async Task CreateForReservationAsync(Guid idReservation, decimal importo)
        {
            var payment = new Payment
            {
                IdPayment = Guid.NewGuid(),
                IdRoomReservation = idReservation,
                Importo = importo,
                Stato = PaymentStatus.IN_ATTESA,
                TransactionId = string.Empty,
                DataCreazione = DateTime.UtcNow
            };
            await _unitOfWork.PaymentRepository.AddAsync(payment);
            // Nota: il SaveChanges lo fa il chiamante (RoomReservationController.Create)
            // per garantire atomicità reservation + payment in una singola transazione EF.
        }

        public async Task<Payment?> ConfirmAsync(Guid idPayment, PaymentMethod metodo, string? cartaUltime4, string? titolare)
        {
            var payment = await _unitOfWork.PaymentRepository.GetByIdAsync(idPayment);
            if (payment == null) return null;
            if (payment.Stato == PaymentStatus.COMPLETATO) return payment; // idempotente

            // Simulazione processore pagamenti (mock).
            await Task.Delay(TimeSpan.FromSeconds(1));

            payment.Metodo = metodo;
            payment.CartaUltime4 = cartaUltime4;
            payment.TitolareCarta = titolare;
            payment.TransactionId = "TXN-" + Guid.NewGuid().ToString("N")[..16].ToUpperInvariant();
            payment.Stato = PaymentStatus.COMPLETATO;
            payment.DataCompletamento = DateTime.UtcNow;

            // Confermiamo anche la prenotazione associata.
            if (payment.RoomReservation != null && payment.RoomReservation.Stato == State.IN_ATTESA)
                payment.RoomReservation.Stato = State.CONFERMATO;

            await _unitOfWork.SaveChangesAsync();
            return payment;
        }
    }
}

using Hotel.Site.Core.Entities.Enums;

namespace Hotel.Site.Core.Entities
{
    public class Payment
    {
        public Guid IdPayment { get; set; }
        public Guid IdRoomReservation { get; set; }
        public decimal Importo { get; set; }
        public PaymentMethod? Metodo { get; set; }
        public PaymentStatus Stato { get; set; } = PaymentStatus.IN_ATTESA;

        // Campi salvati solo DOPO la conferma (mai il PAN completo!)
        public string? CartaUltime4 { get; set; }
        public string? TitolareCarta { get; set; }
        public string TransactionId { get; set; } = string.Empty;

        public DateTime DataCreazione { get; set; } = DateTime.UtcNow;
        public DateTime? DataCompletamento { get; set; }

        public virtual RoomReservation RoomReservation { get; set; } = null!;
    }
}

using Hotel.Domain.Enums;

namespace Hotel.Domain.Entities
{
    public class RoomReservation
    {
        public Guid IdRoomReservation { get; set; }
        public Guid IdUser { get; set; }
        public Guid IdRoom { get; set; }
        public String CodiceCena { get; set; } = string.Empty;
        public DateOnly CheckIn { get; set; } = DateOnly.FromDateTime(DateTime.UtcNow);
        public DateOnly CheckOut { get; set; } = DateOnly.FromDateTime(DateTime.UtcNow);
        public int NumeroNotti => CheckOut.DayNumber - CheckIn.DayNumber;
        public decimal PrezzoTotale { get; set; }
        public State Stato { get; set; } = State.IN_ATTESA;
        public DateTime DataPrenotazione { get; set; } = DateTime.UtcNow;

        public decimal PrezzoPerNotte { get; set; }
        public virtual User User { get; set; } = null!;
        public virtual Room Room { get; set; } = null!;

    }
}

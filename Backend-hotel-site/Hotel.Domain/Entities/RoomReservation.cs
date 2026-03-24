using Backend_hotel_site.Hotel.Domain.Entities.Enums;
using Backend_hotel_site.Hotel.Domain.Models;

namespace Backend_hotel_site.Hotel.Domain.Entities
{
    public class RoomReservation
    {
        public Guid IdRoomReservation { get; set; }
        public Guid IdUser { get; set; }
        public Guid IdRoom { get; set; }
        public String CodiceCena { get; set; } = string.Empty;
        public DateOnly CheckIn { get; set; } = DateOnly.FromDateTime(DateTime.UtcNow);
        public DateOnly CheckOut { get; set; } = DateOnly.FromDateTime(DateTime.UtcNow);
        private int _numeroNotti => this.CheckOut.DayNumber - this.CheckIn.DayNumber;
        public double PrezzoTotale { get; set; }
        public State Stato { get; set; } = State.IN_ATTESA;
        public DateTime DataPrenotazione { get; set; } = DateTime.UtcNow;
        public virtual User User { get; set; } = null!;
        public virtual Room Room { get; set; } = null!;

    }
}

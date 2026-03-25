using Backend_hotel_site.Hotel.Domain.Entities.Enums;

namespace Backend_hotel_site.Hotel.Domain.Entities
{
    public class DinnerReservation
    {
        public Guid id { get; set; }

        public string codiceCena { get; set; } = string.Empty;

        public DateOnly data {  get; set; }

        public int numeroCoperti {  get; set; }

        public DinnerState statoPrenotazione { get; set; } 

        public DateTime dataCreazione { get; set; } = DateTime.UtcNow;

        public virtual RoomReservation RoomReservation { get; set; } = null!;
        public virtual ICollection<DinnerOrder> Ordini { get; set; } = new HashSet<DinnerCode>();



            
    }
}

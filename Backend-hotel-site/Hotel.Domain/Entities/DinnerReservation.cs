using Backend_hotel_site.Hotel.Domain.Entities.Enums;

namespace Backend_hotel_site.Hotel.Domain.Entities
{
    public class DinnerReservation
    {
        public Guid Id { get; set; }

        public string CodiceCena { get; set; } = string.Empty;

        public DateOnly Data {  get; set; }

        public int NumeroCoperti {  get; set; }

        public DinnerState StatoPrenotazione { get; set; } 

        public DateTime DataCreazione { get; set; } = DateTime.UtcNow;

        public virtual RoomReservation RoomReservation { get; set; } = null!;
        public virtual ICollection<DinnerOrder> Ordini { get; set; } = new HashSet<DinnerOrder>();



            
    }
}

using Backend_hotel_site.Hotel.Domain.Entities.Enums;
using Backend_hotel_site.Hotel.Domain.Entities.Utils;

namespace Backend_hotel_site.Hotel.Domain.Entities
{
    public class Room
    {
        public Guid IdRoom { get; set; }
        public String Nome { get; set; } = string.Empty;
        public RoomType TipoStanza { get; set; }
        public String Descrizione { get; set; } = string.Empty;
        public double PrezzoPerNotte { get; set; }
        public int CapacitaMassima { get; set; }
        public int Dimenstione { get; set; }
        public String Piano { get; set; }
        public String NumeroCamera { get; set; }
        public bool Disponibilie { get; set; } = true;
        public virtual ICollection<RoomImage> ImmaginiCamera { get; set; } = new HashSet<RoomImage>();
        public virtual ICollection<RoomAmenity> ServiziCamera { get; set; } = new HashSet<RoomAmenity>();
    }
}
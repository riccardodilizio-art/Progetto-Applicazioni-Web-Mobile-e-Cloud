using Backend_hotel_site.Hotel.Domain.Entities;
using Backend_hotel_site.Hotel.Domain.Entities.Enums;

namespace Backend_hotel_site.Hotel.Domain.Models
{
    public class User
    {
        public Guid IdUser { get; set; }
        public String Nome { get; set; } = string.Empty;
        public String Cognome { get; set; } = string.Empty;
        public String Email { get; set; } = string.Empty;
        public String Password { get; set; } = string.Empty;
        public String NumeroTelefono { get; set; } = string.Empty;
        public Role Ruolo { get; set; } = Role.CLIENT;
        public DateTime DataCreazione { get; set; } = DateTime.UtcNow;
        public virtual ICollection<RoomReservation> StanzePrenotate { get; set; } = new HashSet<RoomReservation>();
    }
}

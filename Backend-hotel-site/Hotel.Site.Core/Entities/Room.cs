using System;
using System.Collections.Generic;
using System.Text;

namespace Hotel.Site.Core.Entities
{
    public class Room
    {
        public Guid IdRoom { get; set; }
        public String Nome { get; set; } = string.Empty;
        public RoomType TipoStanza { get; set; }
        public String Descrizione { get; set; } = string.Empty;
        public decimal PrezzoPerNotte { get; set; }
        public int CapacitaMassima { get; set; }
        public int Dimensione { get; set; }
        public int Piano { get; set; }
        public int NumeroCamera { get; set; }
        public bool Disponibilie { get; set; } = true;
        public virtual ICollection<RoomImage> ImmaginiCamera { get; set; } = new HashSet<RoomImage>();
        public virtual ICollection<RoomAmenity> ServiziCamera { get; set; } = new HashSet<RoomAmenity>();
    }
}

using System;
using System.Collections.Generic;
using System.Text;

namespace Hotel.Site.Core.Entities
{
    public class DinnerOrder
    {
        public Guid Id { get; set; }
        public Guid DinnerReservationId { get; set; }
        public int NumeroCoperto { get; set; } //numero coperto 
        public string Primo { get; set; } = string.Empty;
        public string Secondo { get; set; } = string.Empty;
        public virtual DinnerReservation DinnerReservation { get; set; } = null!;
    }
}

using System;

namespace Hotel.Site.Core.Entities
{
    public class Contact
    {
        public Guid IdContact { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Telefono { get; set; } = string.Empty;
        public string Messaggio { get; set; } = string.Empty;
        public DateTime DataCreazione { get; set; } = DateTime.UtcNow;
    }
}

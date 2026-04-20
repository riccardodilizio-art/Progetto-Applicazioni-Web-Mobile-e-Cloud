using System.ComponentModel.DataAnnotations;

namespace Hotel.Site.Api.DTOs.Contact.Request;

public record ContactRequest(
    [Required(ErrorMessage = "Nome obbligatorio")]
    [StringLength(200, MinimumLength = 2, ErrorMessage = "Nome tra 2 e 200 caratteri")]
    string Name,

    [Required(ErrorMessage = "Email obbligatoria")]
    [EmailAddress(ErrorMessage = "Email non valida")]
    [StringLength(320)]
    string Email,

    [StringLength(30, ErrorMessage = "Telefono troppo lungo")]
    [RegularExpression(@"^[+\d\s\-()]{0,30}$", ErrorMessage = "Telefono contiene caratteri non validi")]
    string? Phone,

    [Required(ErrorMessage = "Messaggio obbligatorio")]
    [StringLength(5000, MinimumLength = 5, ErrorMessage = "Messaggio tra 5 e 5000 caratteri")]
    string Message
);

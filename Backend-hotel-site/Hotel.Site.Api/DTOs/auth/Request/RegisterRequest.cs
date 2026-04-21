using System.ComponentModel.DataAnnotations;

namespace Hotel.Site.Api.DTOs.auth.Request;

public record RegisterRequest(
    [Required(ErrorMessage = "Nome obbligatorio")]
    [StringLength(100, MinimumLength = 2)]
    string Nome,

    [Required(ErrorMessage = "Cognome obbligatorio")]
    [StringLength(100, MinimumLength = 2)]
    string Cognome,

    [Required(ErrorMessage = "Email obbligatoria")]
    [EmailAddress(ErrorMessage = "Email non valida")]
    [StringLength(320)]
    string Email,

    [Required(ErrorMessage = "Password obbligatoria")]
    [StringLength(100, MinimumLength = 8, ErrorMessage = "Minimo 8 caratteri")]
    [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$",
        ErrorMessage = "La password deve contenere almeno una maiuscola, una minuscola e un numero")]
    string Password,

    [StringLength(30)]
    [RegularExpression(@"^[+\d\s\-()]{0,30}$", ErrorMessage = "Telefono contiene caratteri non validi")]
    string? NumeroTelefono
);

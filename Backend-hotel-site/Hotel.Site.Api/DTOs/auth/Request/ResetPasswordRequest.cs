using System.ComponentModel.DataAnnotations;

namespace Hotel.Site.Api.DTOs.auth.Request;

public record ResetPasswordRequest(
    [Required] string Token,

    [Required]
    [StringLength(100, MinimumLength = 8, ErrorMessage = "Minimo 8 caratteri")]
    [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$",
        ErrorMessage = "La password deve contenere almeno una maiuscola, una minuscola e un numero")]
    string Password
);

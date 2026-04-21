using System.ComponentModel.DataAnnotations;

namespace Hotel.Site.Api.DTOs.auth.Request;

public record LoginRequest(
    [Required(ErrorMessage = "Email obbligatoria")]
    [EmailAddress(ErrorMessage = "Email non valida")]
    string Email,

    [Required(ErrorMessage = "Password obbligatoria")]
    string Password
);

using System.ComponentModel.DataAnnotations;

namespace Hotel.Site.Api.DTOs.auth.Request;

public record ForgotPasswordRequest(
    [Required]
    [EmailAddress]
    string Email
);

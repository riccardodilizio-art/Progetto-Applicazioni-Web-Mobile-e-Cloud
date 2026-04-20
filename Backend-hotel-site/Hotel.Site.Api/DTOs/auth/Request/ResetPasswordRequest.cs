using System.ComponentModel.DataAnnotations;
namespace Hotel.Site.Api.DTOs.auth.Request;

public record ResetPasswordRequest(
    [Required] string Token,
    [Required][StringLength(100, MinimumLength = 8)] string Password
);

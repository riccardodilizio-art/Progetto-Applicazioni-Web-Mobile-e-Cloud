using System.ComponentModel.DataAnnotations;

namespace Hotel.Site.Api.DTOs.Users.Request;

public record UpdateUserRequest(
    [StringLength(100)] string? Nome,
    [StringLength(100)] string? Cognome,
    [StringLength(30)][RegularExpression(@"^[+\d\s\-()]{0,30}$")] string? NumeroTelefono
);

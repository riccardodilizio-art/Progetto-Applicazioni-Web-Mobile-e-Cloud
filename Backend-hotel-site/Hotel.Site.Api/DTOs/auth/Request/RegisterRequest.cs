namespace Hotel.Site.Api.DTOs.auth.Request;

public record RegisterRequest(
    string Nome,
    string Cognome,
    string Email,
    string Password,
    string NumeroTelefono
);

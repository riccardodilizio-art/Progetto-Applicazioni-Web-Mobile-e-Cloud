namespace Hotel.Site.Api.DTOs.auth.Response;

public record AuthResponse(
    Guid IdUser,
    string Nome,
    string Cognome,
    string Email,
    string Ruolo
);

namespace Hotel.Site.Api.DTOs.Users.Response;

public record UserResponse(
    Guid IdUser,
    string Nome,
    string Cognome,
    string Email,
    string NumeroTelefono,
    string Ruolo
);

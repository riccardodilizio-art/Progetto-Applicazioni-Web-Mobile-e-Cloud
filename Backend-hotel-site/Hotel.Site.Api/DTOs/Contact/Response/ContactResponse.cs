namespace Hotel.Site.Api.DTOs.Contact.Response;

public record ContactResponse(
    Guid IdContact,
    string Nome,
    string Email,
    string Telefono,
    string Messaggio,
    DateTime DataCreazione
);

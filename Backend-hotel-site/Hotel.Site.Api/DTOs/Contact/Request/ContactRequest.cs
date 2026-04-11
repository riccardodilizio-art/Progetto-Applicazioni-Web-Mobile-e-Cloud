namespace Hotel.Site.Api.DTOs.Contact.Request;

public record ContactRequest(
    string Name,
    string Email,
    string? Phone,
    string Message
);

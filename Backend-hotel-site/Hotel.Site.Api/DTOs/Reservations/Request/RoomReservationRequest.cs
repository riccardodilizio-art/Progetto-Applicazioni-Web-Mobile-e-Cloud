namespace Hotel.Site.Api.DTOs.Reservations.Request;

public record RoomReservationRequest(
    Guid IdRoom,
    DateOnly CheckIn,
    DateOnly CheckOut,
    decimal PrezzoPerNotte
);

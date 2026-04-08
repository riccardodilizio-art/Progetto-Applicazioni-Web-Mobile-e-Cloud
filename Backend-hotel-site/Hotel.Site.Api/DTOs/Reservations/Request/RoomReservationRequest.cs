namespace Hotel.Site.Api.DTOs.Reservations.Request;
public record RoomReservationRequest(
    Guid IdUser,
    Guid IdRoom,
    DateOnly CheckIn,
    DateOnly CheckOut,
    decimal PrezzoPerNotte
);
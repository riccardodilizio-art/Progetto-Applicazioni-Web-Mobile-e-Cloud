namespace Hotel.Site.Api.DTOs.Reservations.Response;

public record RoomReservationResponse(
    Guid IdRoomReservation,
    Guid IdUser,
    Guid IdRoom,
    string NomeCamera,
    string CodiceCena,
    DateOnly CheckIn,
    DateOnly CheckOut,
    int NumeroNotti,
    decimal PrezzoPerNotte,
    decimal PrezzoTotale,
    string Stato,
    DateTime DataPrenotazione,
    Guid? IdPayment,
    string? StatoPagamento
);

namespace Hotel.Site.Api.DTOs.Payments.Response;

public record PaymentResponse(
    Guid IdPayment,
    Guid IdRoomReservation,
    decimal Importo,
    string? Metodo,
    string Stato,
    string? CartaUltime4,
    string? TitolareCarta,
    string? TransactionId,
    DateTime DataCreazione,
    DateTime? DataCompletamento,
    string NomeCamera,
    DateOnly CheckIn,
    DateOnly CheckOut,
    int NumeroNotti
);

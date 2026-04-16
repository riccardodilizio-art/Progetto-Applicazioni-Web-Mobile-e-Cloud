namespace Hotel.Site.Api.DTOs.Dinner.Response;

public record DinnerReservationAdminResponse(
    Guid Id,
    string CodiceCena,
    int? NumeroCamera,
    string? UserEmail,
    DateOnly Data,
    int NumeroCoperti,
    string StatoPrenotazione,
    List<DinnerOrderResponse> Ordini
);

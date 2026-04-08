namespace Hotel.Site.Api.DTOs.Dinner.Response;

public record DinnerOrderResponse(
    Guid Id,
    int NumeroCoperto,
    string Primo,
    string Secondo
);

public record DinnerReservationResponse(
    Guid Id,
    string CodiceCena,
    DateOnly Data,
    int NumeroCoperti,
    string StatoPrenotazione,
    List<DinnerOrderResponse> Ordini
);
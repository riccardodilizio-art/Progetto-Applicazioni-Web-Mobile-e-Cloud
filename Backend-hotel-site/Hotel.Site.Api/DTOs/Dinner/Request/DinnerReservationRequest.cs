namespace Hotel.Site.Api.DTOs.Dinner.Request;
public record DinnerOrderRequest(
    int NumeroCoperto,
    string Primo,
    string Secondo
);

public record DinnerReservationRequest(
    string CodiceCena,
    int NumeroCamera,
    DateOnly Data,
    int NumeroCoperti,
    List<DinnerOrderRequest> Ordini
);

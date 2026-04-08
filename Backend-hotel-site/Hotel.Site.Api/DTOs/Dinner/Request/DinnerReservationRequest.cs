namespace Hotel.Site.Api.DTOs.Dinner.Request;
public record DinnerOrderRequest(
    int NumeroCoperto,
    string Primo,
    string Secondo
);

public record DinnerReservationRequest(
    string CodiceCena,
    DateOnly Data,
    int NumeroCoperti,
    List<DinnerOrderRequest> Ordini
);

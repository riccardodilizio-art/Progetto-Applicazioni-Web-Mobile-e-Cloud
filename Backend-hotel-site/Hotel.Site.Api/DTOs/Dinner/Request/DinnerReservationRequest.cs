using System.ComponentModel.DataAnnotations;

namespace Hotel.Site.Api.DTOs.Dinner.Request;
public record DinnerOrderRequest(
    int NumeroCoperto,
    [Required(ErrorMessage = "Nome camera obbligatorio")]
    [StringLength(100, MinimumLength = 2)]
    string Primo,
    [Required(ErrorMessage = "Nome camera obbligatorio")]
    [StringLength(100, MinimumLength = 2)]
    string Secondo
);

public record DinnerReservationRequest(
    string CodiceCena,
    int NumeroCamera,
    DateOnly Data,
    int NumeroCoperti,
    List<DinnerOrderRequest> Ordini
);

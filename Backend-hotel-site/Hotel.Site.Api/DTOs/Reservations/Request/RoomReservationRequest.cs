using System.ComponentModel.DataAnnotations;

namespace Hotel.Site.Api.DTOs.Reservations.Request;

public record RoomReservationRequest(
    [Required]
    Guid IdRoom,

    [Required]
    DateOnly CheckIn,

    [Required]
    DateOnly CheckOut,

    [Range(0.01, 10000.0, ErrorMessage = "Prezzo fuori range consentito")]
    decimal PrezzoPerNotte
);

using System.ComponentModel.DataAnnotations;

namespace Hotel.Site.Api.DTOs.Reservations.Request;

public record RoomReservationStatusRequest(
    [Required][StringLength(30)] string Stato
);

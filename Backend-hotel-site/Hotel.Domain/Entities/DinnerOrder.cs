namespace Backend_hotel_site.Hotel.Domain.Entities
{
    public class DinnerOrder
    {
        public Guid Id { get; set; }
        public Guid DinnerReservationId { get; set; }
        public int numeroCoperti { get; set; }

        public string primo { get; set; } = string.Empty;

        public string secondo { get; set; } = string.Empty;

        public virtual DinnerReservation DinnerReservation { get; set; } = null!;

    }
}

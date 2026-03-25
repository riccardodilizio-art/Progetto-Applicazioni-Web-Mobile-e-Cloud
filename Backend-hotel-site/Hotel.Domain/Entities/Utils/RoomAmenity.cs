namespace Backend_hotel_site.Hotel.Domain.Entities.Utils
{
    public class RoomAmenity
    {
        public Guid IdRoomAmenity { get; set; }
        public String NomeServizio { get; set; } = string.Empty;
        public Guid RoomId { get; set; }

        public Room Room { get; set; } = null!;

        public RoomAmenity() { }


    }
}

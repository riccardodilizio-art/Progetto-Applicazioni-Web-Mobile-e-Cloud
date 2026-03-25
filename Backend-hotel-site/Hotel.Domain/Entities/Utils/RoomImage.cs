namespace Backend_hotel_site.Hotel.Domain.Entities.Utils
{
    public class RoomImage
    {
        public Guid IdRoomImage { get; set; }
        public String Url { get; set; } = string.Empty;

        public Guid RoomId { get; set; }

        public Room Room { get; set; } = null!;
        public int Position { get; set; }
    }
}

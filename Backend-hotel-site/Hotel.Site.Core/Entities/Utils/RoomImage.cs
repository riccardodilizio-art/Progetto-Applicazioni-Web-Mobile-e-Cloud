using System;
using System.Collections.Generic;
using System.Text;

namespace Hotel.Site.Core.Entities.Utils
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

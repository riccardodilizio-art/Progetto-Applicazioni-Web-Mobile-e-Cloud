using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Hotel.Site.Core.Entities.Utils;

namespace Hotel.Site.Infrastructure.Persistence.Configurations
{
    public class RoomImageConfiguration : IEntityTypeConfiguration<RoomImage>
    {
        public void Configure(EntityTypeBuilder<RoomImage> builder)
        {
            builder.ToTable("RoomImages");
            builder.HasKey(x => x.IdRoomImage);
        }
    }
}

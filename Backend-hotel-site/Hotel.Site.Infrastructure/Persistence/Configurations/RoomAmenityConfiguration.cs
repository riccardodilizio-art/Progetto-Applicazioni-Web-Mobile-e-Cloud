using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Hotel.Site.Core.Entities.Utils;

namespace Hotel.Site.Infrastructure.Persistence.Configurations
{
    public class RoomAmenityConfiguration : IEntityTypeConfiguration<RoomAmenity>
    {
        public void Configure(EntityTypeBuilder<RoomAmenity> builder)
        {
            builder.ToTable("RoomAmenities");
            builder.HasKey(x => x.IdRoomAmenity);
        }
    }
}

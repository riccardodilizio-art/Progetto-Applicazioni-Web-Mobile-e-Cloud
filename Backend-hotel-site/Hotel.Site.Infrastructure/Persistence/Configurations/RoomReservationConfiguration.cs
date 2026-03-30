using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Hotel.Site.Core.Entities;

namespace Hotel.Site.Infrastructure.Persistence.Configurations
{
    public class RoomReservationConfiguration : IEntityTypeConfiguration<RoomReservation>
    {
        public void Configure(EntityTypeBuilder<RoomReservation> builder)
        {
            builder.ToTable("RoomReservations");
            builder.HasKey(x => x.IdRoomReservation);
            builder.HasOne(x => x.User)
                .WithMany(x => x.StanzePrenotate)
                .HasForeignKey(x => x.IdUser);
            builder.HasOne(x => x.Room)
                .WithMany()
                .HasForeignKey(x => x.IdRoom);
        }
    }
}

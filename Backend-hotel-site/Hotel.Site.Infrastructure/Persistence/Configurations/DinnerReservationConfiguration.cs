using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Hotel.Site.Core.Entities;

namespace Hotel.Site.Infrastructure.Persistence.Configurations
{
    public class DinnerReservationConfiguration : IEntityTypeConfiguration<DinnerReservation>
    {
        public void Configure(EntityTypeBuilder<DinnerReservation> builder)
        {
            builder.ToTable("DinnerReservations");
            builder.HasKey(x => x.Id);
            builder.HasOne(x => x.RoomReservation)
                .WithMany()
                .HasForeignKey(x => x.CodiceCena)
                .HasPrincipalKey(x => x.CodiceCena);
            builder.HasMany(x => x.Ordini)
                .WithOne(x => x.DinnerReservation)
                .HasForeignKey(x => x.DinnerReservationId);
        }
    }
}

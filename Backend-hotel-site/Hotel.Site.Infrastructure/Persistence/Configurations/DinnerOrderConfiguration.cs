using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Hotel.Site.Core.Entities;

namespace Hotel.Site.Infrastructure.Persistence.Configurations
{
    public class DinnerOrderConfiguration : IEntityTypeConfiguration<DinnerOrder>
    {
        public void Configure(EntityTypeBuilder<DinnerOrder> builder)
        {
            builder.ToTable("DinnerOrders");
            builder.HasKey(x => x.Id);
            builder.HasOne(x => x.DinnerReservation)
                .WithMany(x => x.Ordini)
                .HasForeignKey(x => x.DinnerReservationId);
        }
    }
}

using Hotel.Site.Core.Entities;
using Hotel.Site.Core.Entities.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Hotel.Site.Infrastructure.Persistence.Configurations
{
    public class PaymentConfiguration : IEntityTypeConfiguration<Payment>
    {
        public void Configure(EntityTypeBuilder<Payment> builder)
        {
            builder.ToTable("Payments");
            builder.HasKey(p => p.IdPayment);

            builder.Property(p => p.Importo).HasPrecision(10, 2);
            builder.Property(p => p.CartaUltime4).HasMaxLength(4);
            builder.Property(p => p.TitolareCarta).HasMaxLength(120);
            builder.Property(p => p.TransactionId).HasMaxLength(64);

            builder.Property(p => p.Metodo).HasConversion<string>().HasMaxLength(20);
            builder.Property(p => p.Stato).HasConversion<string>().HasMaxLength(20);

            builder.HasOne(p => p.RoomReservation)
                   .WithOne(r => r.Payment)
                   .HasForeignKey<Payment>(p => p.IdRoomReservation)
                   .OnDelete(DeleteBehavior.Cascade);

            builder.HasIndex(p => p.IdRoomReservation).IsUnique();
        }
    }
}

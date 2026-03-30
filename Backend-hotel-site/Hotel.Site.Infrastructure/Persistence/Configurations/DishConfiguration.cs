using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Hotel.Site.Core.Entities;

namespace Hotel.Site.Infrastructure.Persistence.Configurations
{
    public class DishConfiguration : IEntityTypeConfiguration<Dish>
    {
        public void Configure(EntityTypeBuilder<Dish> builder)
        {
            builder.ToTable("Dishes");
            builder.HasKey(x => x.IdDish);
            builder.HasOne(x => x.Menu)
                .WithMany(x => x.Piatti)
                .HasForeignKey(x => x.MenuId);
        }
    }
}

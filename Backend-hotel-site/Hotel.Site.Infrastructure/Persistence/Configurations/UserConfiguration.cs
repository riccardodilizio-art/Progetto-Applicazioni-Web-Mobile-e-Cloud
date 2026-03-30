using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Hotel.Site.Core.Entities;

namespace Hotel.Site.Infrastructure.Persistence.Configurations
{
    public class UserConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.ToTable("Users");
            builder.HasKey(x => x.IdUser);
            builder.HasMany(x => x.StanzePrenotate)
                .WithOne(x => x.User)
                .HasForeignKey(x => x.IdUser);
        }
    }
}

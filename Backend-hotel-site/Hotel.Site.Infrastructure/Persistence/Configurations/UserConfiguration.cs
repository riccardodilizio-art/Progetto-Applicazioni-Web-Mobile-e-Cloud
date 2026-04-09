using Hotel.Site.Core.Entities;
using Hotel.Site.Core.Entities.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

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
            builder.HasData(new User
            {
                IdUser = Guid.Parse("11111111-1111-1111-1111-111111111111"),
                Nome = "Admin",
                Cognome = "Hotel",
                Email = "admin@hotelexcelsior.it",
                Password = "$2b$11$.i42CzTY.byNwR.bvY4AM.amERMHtyRQGAhX2QtcbbvADwzW89XoG",
                NumeroTelefono = "0000000000",
                Ruolo = Role.ADMIN,
                DataCreazione = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            },
            new User
            {
                IdUser = Guid.Parse("22222222-2222-2222-2222-222222222222"),
                Nome = "Mario",
                Cognome = "Rossi",
                Email = "cliente@hotelexcelsior.it",
                Password = "$2b$11$LujGaaGHK3tDqaw0A8J82.FTHz5jzj5Nwa0/bfimhXLtpqthTvIsG",
                NumeroTelefono = "3331234567",
                Ruolo = Role.CLIENT,
                DataCreazione = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            }
            );

        }
    }
}

using Microsoft.Extensions.DependencyInjection;
using Hotel.Site.Application.Abstractions.Services;
using Hotel.Site.Application.Services;

namespace Hotel.Site.Application.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services)
        {
            services.AddScoped<IRoomService, RoomService>();
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IRoomReservationService, RoomReservationService>();
            services.AddScoped<IMenuService, MenuService>();
            services.AddScoped<IDinnerReservationService, DinnerReservationService>();
            services.AddScoped<IContactService, ContactService>();
            return services;
        }
    }
}

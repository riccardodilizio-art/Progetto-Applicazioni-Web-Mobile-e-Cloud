using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Text;
using Hotel.Site.Application.Abstractions.Services;
using Hotel.Site.Application.Services;

namespace Hotel.Site.Application.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services)
        {
            // Aggiungo tutti i servizi presenti a livello di application
            services.AddScoped<IRoomService, RoomService>();
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IRoomReservationService, RoomReservationService>();
            services.AddScoped<IMenuService, MenuService>();
            services.AddScoped<IDishService, DishService>();
            services.AddScoped<IDinnerReservationService, DinnerReservationService>();
            services.AddScoped<IDinnerOrderService, DinnerOrderService>();
            services.AddScoped<IContactService, ContactService>();
            return services;
        }
    }
}

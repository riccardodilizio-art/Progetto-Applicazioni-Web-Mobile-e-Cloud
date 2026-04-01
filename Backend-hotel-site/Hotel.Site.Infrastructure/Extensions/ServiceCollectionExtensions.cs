using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Text;
using Hotel.Site.Application.Abstractions.Repositories;
using Hotel.Site.Application.Abstractions.UnitOfWork;
using Hotel.Site.Infrastructure.Persistence;
using Hotel.Site.Infrastructure.Persistence.Repositories;

namespace Hotel.Site.Infrastructure.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, string connectionString)
        {
            // Aggiungo tutti i servizi presenti a livello di infrastructure
            services.AddScoped<IUnitOfWork, HotelSiteUnitOfWork>();
            services.AddScoped<IRoomRepository, RoomRepository>();
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IRoomReservationRepository, RoomReservationRepository>();
            services.AddScoped<IMenuRepository, MenuRepository>();
            services.AddScoped<IDishRepository, DishRepository>();
            services.AddScoped<IDinnerReservationRepository, DinnerReservationRepository>();
            services.AddScoped<IDinnerOrderRepository, DinnerOrderRepository>();
            services.AddDbContext<HotelSiteContext>(opt =>
            {
                opt.UseNpgsql(connectionString);  
            });
            return services;
        }
    }
}

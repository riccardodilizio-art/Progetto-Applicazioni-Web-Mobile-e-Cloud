using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;
using Hotel.Site.Core.Entities;
using Hotel.Site.Core.Entities.Utils;

namespace Hotel.Site.Infrastructure.Persistence
{
    public class HotelSiteContext : DbContext
    {
        public HotelSiteContext(DbContextOptions<HotelSiteContext> opt) : base(opt)
        {
        }

        public DbSet<Room> Rooms { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Contact> Contacts { get; set; }

        public DbSet<RoomReservation> RoomReservations { get; set; }
        public DbSet<Menu> Menus { get; set; }
        public DbSet<Dish> Dishes { get; set; }
        public DbSet<DinnerReservation> DinnerReservations { get; set; }
        public DbSet<DinnerOrder> DinnerOrders { get; set; }
        public DbSet<RoomImage> RoomImages { get; set; }
        public DbSet<RoomAmenity> RoomAmenities { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Applica tutte le configurazioni presenti nell'assembly
            modelBuilder.ApplyConfigurationsFromAssembly(this.GetType().Assembly);
            base.OnModelCreating(modelBuilder);
        }
    }
}

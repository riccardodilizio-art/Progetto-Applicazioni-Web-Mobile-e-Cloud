using System;
using System.Collections.Generic;
using System.Text;
using Hotel.Site.Application.Abstractions.Repositories;
using Hotel.Site.Application.Abstractions.UnitOfWork;

namespace Hotel.Site.Infrastructure.Persistence
{
    public class HotelSiteUnitOfWork : IUnitOfWork
    {
        public HotelSiteUnitOfWork(
            IRoomRepository roomRepository,
            IUserRepository userRepository,
            IRoomReservationRepository roomReservationRepository,
            IMenuRepository menuRepository,
            IDishRepository dishRepository,
            IDinnerReservationRepository dinnerReservationRepository,
            IDinnerOrderRepository dinnerOrderRepository,
            HotelSiteContext context)
        {
            RoomRepository = roomRepository;
            UserRepository = userRepository;
            RoomReservationRepository = roomReservationRepository;
            MenuRepository = menuRepository;
            DishRepository = dishRepository;
            DinnerReservationRepository = dinnerReservationRepository;
            DinnerOrderRepository = dinnerOrderRepository;
            Context = context;
        }

        public HotelSiteContext Context { get; set; }
        public IRoomRepository RoomRepository { get; set; }
        public IUserRepository UserRepository { get; set; }
        public IRoomReservationRepository RoomReservationRepository { get; set; }
        public IMenuRepository MenuRepository { get; set; }
        public IDishRepository DishRepository { get; set; }
        public IDinnerReservationRepository DinnerReservationRepository { get; set; }
        public IDinnerOrderRepository DinnerOrderRepository { get; set; }

        public async Task SaveChangesAsync()
        {
            await Context.SaveChangesAsync();
        }
    }
}

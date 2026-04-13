using Hotel.Site.Application.Abstractions.Repositories;

namespace Hotel.Site.Application.Abstractions.UnitOfWork
{
    public interface IUnitOfWork
    {
        IRoomRepository RoomRepository { get; set; }
        IUserRepository UserRepository { get; set; }
        IRoomReservationRepository RoomReservationRepository { get; set; }
        IMenuRepository MenuRepository { get; set; }
        IContactRepository ContactRepository { get; set; }
        IDinnerReservationRepository DinnerReservationRepository { get; set; }

        Task SaveChangesAsync();
    }
}

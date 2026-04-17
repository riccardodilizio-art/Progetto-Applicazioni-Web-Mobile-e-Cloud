using Hotel.Site.Application.Abstractions.Repositories;
using Hotel.Site.Application.Abstractions.UnitOfWork;
using Microsoft.EntityFrameworkCore.Storage;

namespace Hotel.Site.Infrastructure.Persistence
{
    public class HotelSiteUnitOfWork : IUnitOfWork, IAsyncDisposable
    {
        private IDbContextTransaction? _currentTransaction;

        public HotelSiteUnitOfWork(
            IRoomRepository roomRepository,
            IUserRepository userRepository,
            IRoomReservationRepository roomReservationRepository,
            IMenuRepository menuRepository,
            IContactRepository contactRepository,
            IDinnerReservationRepository dinnerReservationRepository,
            IPaymentRepository paymentRepository,
            HotelSiteContext context)
        {
            RoomRepository = roomRepository;
            UserRepository = userRepository;
            RoomReservationRepository = roomReservationRepository;
            MenuRepository = menuRepository;
            ContactRepository = contactRepository;
            DinnerReservationRepository = dinnerReservationRepository;
            PaymentRepository = paymentRepository;
            Context = context;
        }

        public HotelSiteContext Context { get; set; }
        public IRoomRepository RoomRepository { get; set; }
        public IUserRepository UserRepository { get; set; }
        public IRoomReservationRepository RoomReservationRepository { get; set; }
        public IMenuRepository MenuRepository { get; set; }
        public IContactRepository ContactRepository { get; set; }
        public IDinnerReservationRepository DinnerReservationRepository { get; set; }
        public IPaymentRepository PaymentRepository { get; set; }

        public async Task SaveChangesAsync()
        {
            await Context.SaveChangesAsync();
        }

        public async Task BeginTransactionAsync()
        {
            if (_currentTransaction != null) return;
            _currentTransaction = await Context.Database.BeginTransactionAsync();
        }

        public async Task CommitTransactionAsync()
        {
            if (_currentTransaction == null) return;
            try
            {
                await _currentTransaction.CommitAsync();
            }
            finally
            {
                await _currentTransaction.DisposeAsync();
                _currentTransaction = null;
            }
        }

        public async Task RollbackTransactionAsync()
        {
            if (_currentTransaction == null) return;
            try
            {
                await _currentTransaction.RollbackAsync();
            }
            finally
            {
                await _currentTransaction.DisposeAsync();
                _currentTransaction = null;
            }
        }

        public async ValueTask DisposeAsync()
        {
            if (_currentTransaction != null)
            {
                await _currentTransaction.DisposeAsync();
                _currentTransaction = null;
            }
        }
    }
}

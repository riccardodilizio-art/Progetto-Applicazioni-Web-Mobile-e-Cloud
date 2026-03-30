using System;
using System.Collections.Generic;
using System.Text;
using Hotel.Site.Application.Abstractions.Repositories;

namespace Hotel.Site.Application.Abstractions.UnitOfWork
{
    public interface IUnitOfWork
    {
        // Il pattern Unit of Work serve a coordinare le operazioni di
        // scrittura su più repository, in modo che tutte le modifiche
        // vengano eseguite come un'unica transazione atomica.

        // Proprietà per ogni repository
        public IRoomRepository RoomRepository { get; set; }
        public IUserRepository UserRepository { get; set; }
        public IRoomReservationRepository RoomReservationRepository { get; set; }
        public IMenuRepository MenuRepository { get; set; }
        public IDishRepository DishRepository { get; set; }
        public IDinnerReservationRepository DinnerReservationRepository { get; set; }
        public IDinnerOrderRepository DinnerOrderRepository { get; set; }

        // Metodo per salvare le modifiche in modo asincrono
        // che verrà chiamato alla fine delle operazioni sulle repository
        // per applicare tutte le modifiche al database in un'unica transazione
        public Task SaveChangesAsync();
    }
}

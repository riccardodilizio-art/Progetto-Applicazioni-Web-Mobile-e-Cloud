using System;
using System.Collections.Generic;
using System.Text;
using Hotel.Site.Core.Entities;

namespace Hotel.Site.Application.Abstractions.Repositories
{
    public interface IMenuRepository
    {
        Task<Menu> GetMenuByIdAsync(Guid id);
        Task<Menu> GetMenuByDayAsync(DayOfWeek giorno);
        Task<IEnumerable<Menu>> GetAllMenusAsync();
        Task AddMenuAsync(Menu menu);
        Task EditMenuAsync(Menu menu);
        Task DeleteMenuAsync(Guid id);
    }
}

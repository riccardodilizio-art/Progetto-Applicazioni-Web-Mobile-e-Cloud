using System;
using System.Collections.Generic;
using System.Text;
using Hotel.Site.Core.Entities;
using Hotel.Site.Core.Entities.Enums;
using DayOfWeek = Hotel.Site.Core.Entities.Enums.DayOfWeek;

namespace Hotel.Site.Application.Abstractions.Services
{
    public interface IMenuService
    {
        Task<Menu?> GetMenuByIdAsync(Guid id);
        Task<Menu?> GetMenuByDayAsync(DayOfWeek giorno);
        Task<IEnumerable<Menu>> GetAllMenusAsync();
        Task AddMenuAsync(Menu menu);
        Task EditMenuAsync(Menu menu);
        Task DeleteMenuAsync(Guid id);
    }
}

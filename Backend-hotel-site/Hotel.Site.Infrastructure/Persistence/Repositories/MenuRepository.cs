using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using Hotel.Site.Application.Abstractions.Repositories;
using Hotel.Site.Core.Entities;
using Hotel.Site.Core.Entities.Enums;
using DayOfWeek = Hotel.Site.Core.Entities.Enums.DayOfWeek;

namespace Hotel.Site.Infrastructure.Persistence.Repositories
{
    public class MenuRepository : IMenuRepository
    {
        public MenuRepository(HotelSiteContext context)
        {
            Context = context;
        }
        public HotelSiteContext Context { get; set; }

        public async Task<Menu?> GetMenuByIdAsync(Guid id)
        {
            return await Context.Menus
                .Include(m => m.Piatti)
                .Where(w => w.IdMenu == id)
                .FirstOrDefaultAsync();
        }

        public async Task<Menu?> GetMenuByDayAsync(DayOfWeek giorno)
        {
            return await Context.Menus
                .Include(m => m.Piatti)
                .Where(w => w.GiornoSettimana == giorno)
                .FirstOrDefaultAsync();
        }

        public async Task<IEnumerable<Menu>> GetAllMenusAsync()
        {
            return await Context.Menus
                .Include(m => m.Piatti)
                .ToListAsync();
        }

        public async Task AddMenuAsync(Menu menu)
        {
            await Context.Menus.AddAsync(menu);
        }

        public async Task<Menu?> UpdateMenuAsync(Guid id, DayOfWeek giorno, IEnumerable<Dish> piatti)
        {
            var existing = await Context.Menus
                .Include(m => m.Piatti)
                .FirstOrDefaultAsync(m => m.IdMenu == id);

            if (existing == null) return null;

            existing.GiornoSettimana = giorno;

            // Replace piatti: drop vecchi, aggiungi nuovi
            Context.RemoveRange(existing.Piatti);
            existing.Piatti.Clear();
            foreach (var p in piatti)
            {
                p.IdDish = Guid.NewGuid();
                p.MenuId = existing.IdMenu;
                existing.Piatti.Add(p);
            }

            return existing;
        }

        public async Task DeleteMenuAsync(Guid id)
        {
            var menu = new Menu() { IdMenu = id };
            Context.Entry(menu).State = EntityState.Deleted;
        }
    }
}

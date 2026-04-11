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
                .FirstOrDefaultAsync(m => m.IdMenu == id);

            if (existing == null) return null;

            existing.GiornoSettimana = giorno;

            // Cancella i piatti vecchi con SQL diretto
            await Context.Set<Dish>().Where(d => d.MenuId == id).ExecuteDeleteAsync();

            // Aggiungi i nuovi piatti via DbSet (relationship fixup popola existing.Piatti)
            foreach (var p in piatti)
            {
                p.IdDish = Guid.NewGuid();
                p.MenuId = id;
                await Context.Set<Dish>().AddAsync(p);
            }

            return existing;
        }

        public async Task DeleteMenuAsync(Guid id)
        {
            var menu = await Context.Menus.FindAsync(id);
            if (menu != null)
                Context.Menus.Remove(menu);
        }

    }
}

using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;
using Hotel.Site.Application.Abstractions.Repositories;
using Hotel.Site.Core.Entities;

namespace Hotel.Site.Infrastructure.Persistence.Repositories
{
    public class DishRepository : IDishRepository
    {
        public DishRepository(HotelSiteContext context)
        {
            Context = context;
        }
        public HotelSiteContext Context { get; set; }

        public async Task<Dish> GetDishByIdAsync(Guid id)
        {
            return await Context.Dishes
                .Where(w => w.IdDish == id)
                .FirstAsync();
        }

        public async Task<IEnumerable<Dish>> GetDishesByMenuIdAsync(Guid idMenu)
        {
            return await Context.Dishes
                .Where(w => w.MenuId == idMenu)
                .ToListAsync();
        }

        public async Task AddDishAsync(Dish dish)
        {
            await Context.Dishes.AddAsync(dish);
        }

        public async Task EditDishAsync(Dish dish)
        {
            Context.Entry(dish).State = EntityState.Modified;
        }

        public async Task DeleteDishAsync(Guid id)
        {
            var dish = new Dish() { IdDish = id };
            Context.Entry(dish).State = EntityState.Deleted;
        }
    }
}

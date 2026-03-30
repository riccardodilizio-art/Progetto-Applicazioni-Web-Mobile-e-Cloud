using System;
using System.Collections.Generic;
using System.Text;
using Hotel.Site.Core.Entities;

namespace Hotel.Site.Application.Abstractions.Repositories
{
    public interface IDishRepository
    {
        Task<Dish> GetDishByIdAsync(Guid id);
        Task<IEnumerable<Dish>> GetDishesByMenuIdAsync(Guid idMenu);
        Task AddDishAsync(Dish dish);
        Task EditDishAsync(Dish dish);
        Task DeleteDishAsync(Guid id);
    }
}

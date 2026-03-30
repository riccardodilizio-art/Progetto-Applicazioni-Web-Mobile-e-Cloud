using System;
using System.Collections.Generic;
using System.Text;
using Hotel.Site.Application.Abstractions.Services;
using Hotel.Site.Application.Abstractions.UnitOfWork;
using Hotel.Site.Core.Entities;

namespace Hotel.Site.Application.Services
{
    public class DishService : IDishService
    {
        private readonly IUnitOfWork _unitOfWork;

        public DishService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<Dish> GetDishByIdAsync(Guid id)
        {
            return await _unitOfWork.DishRepository.GetDishByIdAsync(id);
        }

        public async Task<IEnumerable<Dish>> GetDishesByMenuIdAsync(Guid idMenu)
        {
            return await _unitOfWork.DishRepository.GetDishesByMenuIdAsync(idMenu);
        }

        public async Task AddDishAsync(Dish dish)
        {
            await _unitOfWork.DishRepository.AddDishAsync(dish);
            await _unitOfWork.SaveChangesAsync();
        }

        public async Task EditDishAsync(Dish dish)
        {
            await _unitOfWork.DishRepository.EditDishAsync(dish);
            await _unitOfWork.SaveChangesAsync();
        }

        public async Task DeleteDishAsync(Guid id)
        {
            await _unitOfWork.DishRepository.DeleteDishAsync(id);
            await _unitOfWork.SaveChangesAsync();
        }
    }
}

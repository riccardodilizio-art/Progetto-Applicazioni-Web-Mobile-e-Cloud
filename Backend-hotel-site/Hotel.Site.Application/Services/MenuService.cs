using System;
using System.Collections.Generic;
using System.Text;
using Hotel.Site.Application.Abstractions.Services;
using Hotel.Site.Application.Abstractions.UnitOfWork;
using Hotel.Site.Core.Entities;
using Hotel.Site.Core.Entities.Enums;
using DayOfWeek = Hotel.Site.Core.Entities.Enums.DayOfWeek;

namespace Hotel.Site.Application.Services
{
    public class MenuService : IMenuService
    {
        private readonly IUnitOfWork _unitOfWork;

        public MenuService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<Menu> GetMenuByIdAsync(Guid id)
        {
            return await _unitOfWork.MenuRepository.GetMenuByIdAsync(id);
        }

        public async Task<Menu> GetMenuByDayAsync(DayOfWeek giorno)
        {
            return await _unitOfWork.MenuRepository.GetMenuByDayAsync(giorno);
        }

        public async Task<IEnumerable<Menu>> GetAllMenusAsync()
        {
            return await _unitOfWork.MenuRepository.GetAllMenusAsync();
        }

        public async Task AddMenuAsync(Menu menu)
        {
            await _unitOfWork.MenuRepository.AddMenuAsync(menu);
            await _unitOfWork.SaveChangesAsync();
        }

        public async Task EditMenuAsync(Menu menu)
        {
            await _unitOfWork.MenuRepository.EditMenuAsync(menu);
            await _unitOfWork.SaveChangesAsync();
        }

        public async Task DeleteMenuAsync(Guid id)
        {
            await _unitOfWork.MenuRepository.DeleteMenuAsync(id);
            await _unitOfWork.SaveChangesAsync();
        }
    }
}

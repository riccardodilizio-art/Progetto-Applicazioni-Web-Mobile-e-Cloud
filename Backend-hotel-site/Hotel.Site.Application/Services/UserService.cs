using Hotel.Site.Application.Abstractions.Services;
using Hotel.Site.Application.Abstractions.UnitOfWork;
using Hotel.Site.Core.Entities;

namespace Hotel.Site.Application.Services
{
    public class UserService : IUserService
    {
        private readonly IUnitOfWork _unitOfWork;

        public UserService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<User?> GetUserByIdAsync(Guid id)
        {
            return await _unitOfWork.UserRepository.GetUserByIdAsync(id);
        }

        public async Task<User?> GetUserByEmailAsync(string email)
        {
            return await _unitOfWork.UserRepository.GetUserByEmailAsync(email);
        }

        public async Task AddUserAsync(User user)
        {
            await _unitOfWork.UserRepository.AddUserAsync(user);
            await _unitOfWork.SaveChangesAsync();
        }

        public async Task EditUserAsync(User user)
        {
            await _unitOfWork.UserRepository.EditUserAsync(user);
            await _unitOfWork.SaveChangesAsync();
        }

        public async Task DeleteUserAsync(Guid id)
        {
            await _unitOfWork.UserRepository.DeleteUserAsync(id);
            await _unitOfWork.SaveChangesAsync();
        }

        public Task<User?> GetUserByResetTokenHashAsync(string tokenHash) => _unitOfWork.UserRepository.GetUserByResetTokenHashAsync(tokenHash);

    }
}

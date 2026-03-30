using System;
using System.Collections.Generic;
using System.Text;
using Hotel.Site.Core.Entities;

namespace Hotel.Site.Application.Abstractions.Repositories
{
    public interface IUserRepository
    {
        Task<User> GetUserByIdAsync(Guid id);
        Task<User> GetUserByEmailAsync(string email);
        Task AddUserAsync(User user);
        Task EditUserAsync(User user);
        Task DeleteUserAsync(Guid id);
    }
}

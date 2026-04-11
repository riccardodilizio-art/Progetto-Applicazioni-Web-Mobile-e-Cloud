using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;
using Hotel.Site.Application.Abstractions.Repositories;
using Hotel.Site.Core.Entities;

namespace Hotel.Site.Infrastructure.Persistence.Repositories
{
    public class UserRepository : IUserRepository
    {
        public UserRepository(HotelSiteContext context)
        {
            Context = context;
        }
        public HotelSiteContext Context { get; set; }

        public async Task<User?> GetUserByIdAsync(Guid id)
        {
            return await Context.Users
                .Where(w => w.IdUser == id)
                .FirstOrDefaultAsync();
        }

        public async Task<User?> GetUserByEmailAsync(string email)
        {
            return await Context.Users
                .Where(w => w.Email == email)
                .FirstOrDefaultAsync();
        }


        public async Task AddUserAsync(User user)
        {
            await Context.Users.AddAsync(user);
        }

        public async Task EditUserAsync(User user)
        {
            Context.Entry(user).State = EntityState.Modified;
        }

        public async Task DeleteUserAsync(Guid id)
        {
            var user = new User() { IdUser = id };
            Context.Entry(user).State = EntityState.Deleted;
        }
    }
}

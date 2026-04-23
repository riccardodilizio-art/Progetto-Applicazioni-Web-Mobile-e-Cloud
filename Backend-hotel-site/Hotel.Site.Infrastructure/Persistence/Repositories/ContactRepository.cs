using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Hotel.Site.Application.Abstractions.Repositories;
using Hotel.Site.Core.Entities;

namespace Hotel.Site.Infrastructure.Persistence.Repositories
{
    public class ContactRepository : IContactRepository
    {
        public ContactRepository(HotelSiteContext context)
        {
            Context = context;
        }
        public HotelSiteContext Context { get; set; }

        public async Task<IEnumerable<Contact>> GetAllContactsAsync()
        {
            return await Context.Contacts
                .OrderByDescending(c => c.DataCreazione)
                .ToListAsync();
        }

        public async Task AddContactAsync(Contact contact)
        {
            await Context.Contacts.AddAsync(contact);
        }

        public async Task<(IEnumerable<Contact> Items, int Total)> GetPagedAsync(int skip, int take)
        {
            var query = Context.Contacts;
            var total = await query.CountAsync();
            var items = await query
                .OrderByDescending(c => c.DataCreazione)
                .Skip(skip).Take(take)
                .AsNoTracking()
                .ToListAsync();
            return (items, total);
        }

    }
}

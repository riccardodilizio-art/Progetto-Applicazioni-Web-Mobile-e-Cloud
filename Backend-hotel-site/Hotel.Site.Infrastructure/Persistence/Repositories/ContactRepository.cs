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
    }
}

using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Hotel.Site.Core.Entities;

namespace Hotel.Site.Application.Abstractions.Services
{
    public interface IContactService
    {
        Task<IEnumerable<Contact>> GetAllContactsAsync();
        Task AddContactAsync(Contact contact);
    }
}

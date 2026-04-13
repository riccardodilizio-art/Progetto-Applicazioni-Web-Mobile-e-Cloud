using Hotel.Site.Application.Abstractions.Services;
using Hotel.Site.Application.Abstractions.UnitOfWork;
using Hotel.Site.Core.Entities;

namespace Hotel.Site.Application.Services
{
    public class ContactService : IContactService
    {
        private readonly IUnitOfWork _unitOfWork;

        public ContactService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<Contact>> GetAllContactsAsync()
        {
            return await _unitOfWork.ContactRepository.GetAllContactsAsync();
        }

        public async Task AddContactAsync(Contact contact)
        {
            await _unitOfWork.ContactRepository.AddContactAsync(contact);
            await _unitOfWork.SaveChangesAsync();
        }
    }
}

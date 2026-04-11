using Hotel.Site.Api.DTOs.Contact.Request;
using Hotel.Site.Api.DTOs.Contact.Response;
using Hotel.Site.Application.Abstractions.Services;
using Hotel.Site.Core.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Hotel.Site.Api.Controllers;

[ApiController]
[Route("api/contacts")]
public class ContactController : ControllerBase
{
    private readonly IContactService _contactService;

    public ContactController(IContactService contactService)
    {
        _contactService = contactService;
    }

    // Endpoint pubblico: il form del frontend lo chiama senza login
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] ContactRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Name) ||
            string.IsNullOrWhiteSpace(request.Email) ||
            string.IsNullOrWhiteSpace(request.Message))
        {
            return BadRequest(new { message = "Nome, email e messaggio sono obbligatori" });
        }

        var contact = new Contact
        {
            IdContact = Guid.NewGuid(),
            Nome = request.Name,
            Email = request.Email,
            Telefono = request.Phone ?? string.Empty,
            Messaggio = request.Message,
            DataCreazione = DateTime.UtcNow,
        };

        await _contactService.AddContactAsync(contact);

        return Created($"/api/contacts/{contact.IdContact}", new
        {
            id = contact.IdContact,
            message = "Messaggio ricevuto, ti risponderemo a breve"
        });
    }

    // Admin: vede la lista dei messaggi ricevuti (ordinati dal più recente)
    [HttpGet]
    [Authorize(Roles = "ADMIN")]
    public async Task<IActionResult> GetAll()
    {
        var contacts = await _contactService.GetAllContactsAsync();
        var response = contacts.Select(c => new ContactResponse(
            c.IdContact,
            c.Nome,
            c.Email,
            c.Telefono,
            c.Messaggio,
            c.DataCreazione
        ));
        return Ok(response);
    }
}


using Hotel.Site.Api.DTOs.Contact.Request;
using Hotel.Site.Api.DTOs.Contact.Response;
using Hotel.Site.Application.Abstractions.Services;
using Hotel.Site.Core.Entities;
using Hotel.Site.Infrastructure.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.Extensions.Options;

namespace Hotel.Site.Api.Controllers;

[ApiController]
[Route("api/contacts")]
public class ContactController : ControllerBase
{
    private readonly IContactService _contactService;
    private readonly IEmailService _emailService;
    private readonly SmtpSettings _smtp;

    public ContactController(
        IContactService contactService,
        IEmailService emailService,
        IOptions<SmtpSettings> smtpOptions)
    {
        _contactService = contactService;
        _emailService = emailService;
        _smtp = smtpOptions.Value;
    }

    [HttpPost]
    [EnableRateLimiting("contact-post")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status429TooManyRequests)]
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
            DataCreazione = DateTime.UtcNow
        };

        await _contactService.AddContactAsync(contact);

        // Invio email (fire-and-forget con log in caso di errore)
        if (!string.IsNullOrWhiteSpace(_smtp.AdminEmail))
        {
            var body = $@"
                <h2>Nuovo messaggio dal sito</h2>
                <p><strong>Da:</strong> {System.Net.WebUtility.HtmlEncode(contact.Nome)}
                &lt;{System.Net.WebUtility.HtmlEncode(contact.Email)}&gt;</p>
                <p><strong>Telefono:</strong> {System.Net.WebUtility.HtmlEncode(contact.Telefono ?? "-")}</p>
                <p><strong>Messaggio:</strong></p>
                <p>{System.Net.WebUtility.HtmlEncode(contact.Messaggio).Replace("\n", "<br>")}</p>
            ";
            _ = _emailService.SendAsync(_smtp.AdminEmail, $"Nuovo contatto: {contact.Nome}", body);
        }

        return Created($"/api/contacts/{contact.IdContact}", new { id = contact.IdContact });
    }

    /// <summary>Elenco messaggi ricevuti (admin).</summary>
    [HttpGet]
    [Authorize(Roles = "ADMIN")]
    [ProducesResponseType(typeof(IEnumerable<ContactResponse>), StatusCodes.Status200OK)]

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


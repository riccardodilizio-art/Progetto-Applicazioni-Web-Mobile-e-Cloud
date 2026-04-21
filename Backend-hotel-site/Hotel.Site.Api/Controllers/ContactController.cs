using Hotel.Site.Api.DTOs.Common.Response;
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
    private readonly ILogger<ContactController> _logger;
    

    public ContactController(
        IContactService contactService,
        IEmailService emailService,
        IOptions<SmtpSettings> smtpOptions,
        ILogger<ContactController> logger)
    {
        _contactService = contactService;
        _emailService = emailService;
        _smtp = smtpOptions.Value;
        _logger = logger;

    }

    [HttpPost]
    [EnableRateLimiting("contact-post")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status429TooManyRequests)]
    public async Task<IActionResult> Create([FromBody] ContactRequest request)
    {

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
        _logger.LogInformation("Nuovo messaggio di contatto da {Email}", contact.Email);



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

    /// <summary>Elenco paginato dei messaggi ricevuti (admin).</summary>
    [HttpGet]
    [Authorize(Roles = "ADMIN")]
    [ProducesResponseType(typeof(PagedResponse<ContactResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        page = Math.Max(1, page);
        pageSize = Math.Clamp(pageSize, 1, 100);

        var (items, total) = await _contactService.GetPagedAsync(page, pageSize);
        var totalPages = (int)Math.Ceiling(total / (double)pageSize);
        var response = new PagedResponse<ContactResponse>(
            items.Select(c => new ContactResponse(c.IdContact, c.Nome, c.Email, c.Telefono, c.Messaggio, c.DataCreazione)),
            page, pageSize, total, totalPages);

        return Ok(response);
    }

}


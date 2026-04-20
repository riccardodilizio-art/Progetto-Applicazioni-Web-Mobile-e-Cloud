using Hotel.Site.Application.Abstractions.Services;
using MailKit.Security;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using MimeKit;
using SmtpClient = MailKit.Net.Smtp.SmtpClient;


namespace Hotel.Site.Infrastructure.Services
{
    public class SmtpSettings
    {
        public string Host { get; set; } = "";
        public int Port { get; set; } = 587;
        public string Username { get; set; } = "";
        public string Password { get; set; } = "";
        public string FromEmail { get; set; } = "";
        public string FromName { get; set; } = "Hotel Excelsior";
        public string AdminEmail { get; set; } = "";
    }

    public class SmtpEmailService : IEmailService
    {
        private readonly SmtpSettings _settings;
        private readonly ILogger<SmtpEmailService> _logger;

        public SmtpEmailService(IOptions<SmtpSettings> options, ILogger<SmtpEmailService> logger)
        {
            _settings = options.Value;
            _logger = logger;
        }

        public async Task SendAsync(string to, string subject, string body, CancellationToken ct = default)
        {
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress(_settings.FromName, _settings.FromEmail));
            message.To.Add(MailboxAddress.Parse(to));
            message.Subject = subject;
            message.Body = new TextPart("html") { Text = body };

            try
            {
                using var client = new SmtpClient();
                await client.ConnectAsync(_settings.Host, _settings.Port, SecureSocketOptions.StartTls, ct);
                await client.AuthenticateAsync(_settings.Username, _settings.Password, ct);
                await client.SendAsync(message, ct);
                await client.DisconnectAsync(true, ct);
            }
            catch (Exception ex)
            {
                // non rilanciamo: l'invio email non deve far fallire la POST /contacts
                _logger.LogError(ex, "Invio email a {To} fallito", to);
            }
        }
    }
}

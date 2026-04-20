namespace Hotel.Site.Application.Abstractions.Services
{
    public interface IEmailService
    {
        Task SendAsync(string to, string subject, string body, CancellationToken ct = default);
    }
}

using System.ComponentModel.DataAnnotations;

namespace Hotel.Site.Api.DTOs.Payments.Request;

public class PaymentConfirmRequest
{
    [Required]
    public string Metodo { get; set; } = string.Empty;

    // Campi richiesti solo per CARTA_CREDITO / CARTA_DEBITO.
    // Il PAN completo viene ricevuto ma MAI persistito: salviamo solo le ultime 4.
    public string? NumeroCarta { get; set; }
    public string? Titolare { get; set; }
    public string? Scadenza { get; set; } // MM/YY
    public string? Cvv { get; set; }
}

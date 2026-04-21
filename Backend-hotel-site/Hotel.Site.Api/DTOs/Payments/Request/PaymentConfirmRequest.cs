using System.ComponentModel.DataAnnotations;

namespace Hotel.Site.Api.DTOs.Payments.Request;

public class PaymentConfirmRequest
{
    [Required(ErrorMessage = "Metodo di pagamento obbligatorio")]
    public string Metodo { get; set; } = string.Empty;

    [StringLength(19, MinimumLength = 13)]
    public string? NumeroCarta { get; set; }

    [StringLength(120, MinimumLength = 2)]
    public string? Titolare { get; set; }

    [RegularExpression(@"^(0[1-9]|1[0-2])\/\d{2}$", ErrorMessage = "Formato scadenza: MM/YY")]
    public string? Scadenza { get; set; }

    [StringLength(4, MinimumLength = 3)]
    public string? Cvv { get; set; }
}

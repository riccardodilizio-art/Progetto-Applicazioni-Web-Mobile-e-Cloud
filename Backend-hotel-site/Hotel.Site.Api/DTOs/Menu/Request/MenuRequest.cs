namespace Hotel.Site.Api.DTOs.Menu.Request;

public record DishRequest(
    string Nome,
    string Descrizione,
    string Categoria,   // "CARNE" | "PESCE" | "VEGETARIANO"
    string TipoPiatto   // "PRIMO" | "SECONDO"
);

public record MenuRequest(
    string Giorno,                 // "LUNEDI" | ... | "DOMENICA"
    List<DishRequest> Piatti
);

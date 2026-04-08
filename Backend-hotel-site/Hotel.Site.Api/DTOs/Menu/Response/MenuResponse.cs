namespace Hotel.Site.Api.DTOs.Menu.Response;
public record DishResponse(
    Guid IdDish,
    string Nome,
    string Descrizione,
    string Categoria,
    string TipoPiatto
);

public record MenuResponse(
    Guid IdMenu,
    string GiornoSettimana,
    List<DishResponse> Primi,
    List<DishResponse> Secondi
);
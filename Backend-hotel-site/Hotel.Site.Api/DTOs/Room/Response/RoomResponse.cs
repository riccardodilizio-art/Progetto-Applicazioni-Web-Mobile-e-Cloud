namespace Hotel.Site.Api.DTOs.Room.Response;

public record RoomResponse(
    Guid IdRoom,
    string Nome,
    string TipoStanza,
    string Descrizione,
    decimal PrezzoPerNotte,
    int CapacitaMassima,
    int Dimensione,
    int Piano,
    int NumeroCamera,
    bool Disponibile,
    List<string> Immagini,
    List<string> Servizi
);

namespace Hotel.Site.Api.DTOs.Common.Response;

public record PagedResponse<T>(
    IEnumerable<T> Items,
    int Page,
    int PageSize,
    int TotalItems,
    int TotalPages
);

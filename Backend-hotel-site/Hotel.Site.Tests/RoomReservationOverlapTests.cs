using FluentAssertions;
using Hotel.Site.Core.Entities;
using Hotel.Site.Core.Entities.Enums;
using Hotel.Site.Infrastructure.Persistence;
using Hotel.Site.Infrastructure.Persistence.Repositories;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace Hotel.Site.Tests;

public class RoomReservationOverlapTests
{
    private static HotelSiteContext CreateInMemoryContext()
    {
        var options = new DbContextOptionsBuilder<HotelSiteContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        return new HotelSiteContext(options);
    }

    [Fact]
    public async Task HasOverlappingReservationAsync_ReturnsTrue_ForConfirmedOverlap()
    {
        using var ctx = CreateInMemoryContext();
        var roomId = Guid.NewGuid();
        ctx.RoomReservations.Add(new RoomReservation
        {
            IdRoomReservation = Guid.NewGuid(),
            IdRoom = roomId,
            CheckIn = new DateOnly(2026, 5, 1),
            CheckOut = new DateOnly(2026, 5, 5),
            Stato = State.CONFERMATO,
            DataPrenotazione = DateTime.UtcNow
        });
        await ctx.SaveChangesAsync();

        var repo = new RoomReservationRepository(ctx);
        var overlap = await repo.HasOverlappingReservationAsync(
            roomId, new DateOnly(2026, 5, 3), new DateOnly(2026, 5, 7));

        overlap.Should().BeTrue();
    }

    [Fact]
    public async Task HasOverlappingReservationAsync_ReturnsFalse_WhenCancelled()
    {
        using var ctx = CreateInMemoryContext();
        var roomId = Guid.NewGuid();
        ctx.RoomReservations.Add(new RoomReservation
        {
            IdRoomReservation = Guid.NewGuid(),
            IdRoom = roomId,
            CheckIn = new DateOnly(2026, 5, 1),
            CheckOut = new DateOnly(2026, 5, 5),
            Stato = State.ANNULLATO,
            DataPrenotazione = DateTime.UtcNow
        });
        await ctx.SaveChangesAsync();

        var repo = new RoomReservationRepository(ctx);
        var overlap = await repo.HasOverlappingReservationAsync(
            roomId, new DateOnly(2026, 5, 3), new DateOnly(2026, 5, 7));

        overlap.Should().BeFalse();
    }

    [Fact]
    public async Task HasOverlappingReservationAsync_ReturnsFalse_ForAdjacentDates()
    {
        using var ctx = CreateInMemoryContext();
        var roomId = Guid.NewGuid();
        ctx.RoomReservations.Add(new RoomReservation
        {
            IdRoomReservation = Guid.NewGuid(),
            IdRoom = roomId,
            CheckIn = new DateOnly(2026, 5, 1),
            CheckOut = new DateOnly(2026, 5, 5),
            Stato = State.CONFERMATO,
            DataPrenotazione = DateTime.UtcNow
        });
        await ctx.SaveChangesAsync();

        var repo = new RoomReservationRepository(ctx);
        // nuova prenotazione 5/5 -> 10/5: check-in il giorno del check-out precedente
        var overlap = await repo.HasOverlappingReservationAsync(
            roomId, new DateOnly(2026, 5, 5), new DateOnly(2026, 5, 10));

        overlap.Should().BeFalse();
    }
}

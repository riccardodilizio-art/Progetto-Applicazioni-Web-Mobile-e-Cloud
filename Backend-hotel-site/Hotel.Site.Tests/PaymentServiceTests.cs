using FluentAssertions;
using Hotel.Site.Application.Abstractions.Repositories;
using Hotel.Site.Application.Abstractions.UnitOfWork;
using Hotel.Site.Application.Services;
using Hotel.Site.Core.Entities;
using Hotel.Site.Core.Entities.Enums;
using Moq;
using Xunit;

namespace Hotel.Site.Tests;

public class PaymentServiceTests
{
    [Fact]
    public async Task ConfirmAsync_ReturnsNull_WhenPaymentNotFound()
    {
        var uow = new Mock<IUnitOfWork>();
        var repo = new Mock<IPaymentRepository>();
        repo.Setup(r => r.GetByIdAsync(It.IsAny<Guid>())).ReturnsAsync((Payment?)null);
        uow.Setup(u => u.PaymentRepository).Returns(repo.Object);

        var service = new PaymentService(uow.Object);
        var result = await service.ConfirmAsync(Guid.NewGuid(), PaymentMethod.CARTA_CREDITO, "1234", "Tizio");

        result.Should().BeNull();
    }

    [Fact]
    public async Task ConfirmAsync_IsIdempotent_WhenPaymentAlreadyCompleted()
    {
        var payment = new Payment
        {
            IdPayment = Guid.NewGuid(),
            Stato = PaymentStatus.COMPLETATO,
            RoomReservation = new RoomReservation { Stato = State.CONFERMATO }
        };
        var uow = new Mock<IUnitOfWork>();
        var repo = new Mock<IPaymentRepository>();
        repo.Setup(r => r.GetByIdAsync(payment.IdPayment)).ReturnsAsync(payment);
        uow.Setup(u => u.PaymentRepository).Returns(repo.Object);

        var service = new PaymentService(uow.Object);
        var result = await service.ConfirmAsync(payment.IdPayment, PaymentMethod.CARTA_CREDITO, "1234", "X");

        result.Should().BeSameAs(payment);
        result!.Stato.Should().Be(PaymentStatus.COMPLETATO);
    }

    [Fact]
    public async Task ConfirmAsync_SetsPaymentCompleted_AndReservationConfirmed()
    {
        var payment = new Payment
        {
            IdPayment = Guid.NewGuid(),
            Stato = PaymentStatus.IN_ATTESA,
            RoomReservation = new RoomReservation { Stato = State.IN_ATTESA }
        };
        var uow = new Mock<IUnitOfWork>();
        var repo = new Mock<IPaymentRepository>();
        repo.Setup(r => r.GetByIdAsync(payment.IdPayment)).ReturnsAsync(payment);
        uow.Setup(u => u.PaymentRepository).Returns(repo.Object);
        uow.Setup(u => u.SaveChangesAsync()).Returns(Task.CompletedTask);

        var service = new PaymentService(uow.Object);
        var result = await service.ConfirmAsync(payment.IdPayment, PaymentMethod.CARTA_CREDITO, "5678", "Mario Rossi");

        result.Should().NotBeNull();
        result!.Stato.Should().Be(PaymentStatus.COMPLETATO);
        result.Metodo.Should().Be(PaymentMethod.CARTA_CREDITO);
        result.CartaUltime4.Should().Be("5678");
        result.TitolareCarta.Should().Be("Mario Rossi");
        result.TransactionId.Should().StartWith("TXN-");
        payment.RoomReservation!.Stato.Should().Be(State.CONFERMATO);
        uow.Verify(u => u.SaveChangesAsync(), Times.Once);
    }
}

using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Hotel.Site.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class ChangePaymentCascade : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Payments_RoomReservations_IdRoomReservation",
                table: "Payments");

            migrationBuilder.AddForeignKey(
                name: "FK_Payments_RoomReservations_IdRoomReservation",
                table: "Payments",
                column: "IdRoomReservation",
                principalTable: "RoomReservations",
                principalColumn: "IdRoomReservation",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Payments_RoomReservations_IdRoomReservation",
                table: "Payments");

            migrationBuilder.AddForeignKey(
                name: "FK_Payments_RoomReservations_IdRoomReservation",
                table: "Payments",
                column: "IdRoomReservation",
                principalTable: "RoomReservations",
                principalColumn: "IdRoomReservation",
                onDelete: ReferentialAction.Restrict);
        }
    }
}

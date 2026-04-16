using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Hotel.Site.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddPayment : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Payments",
                columns: table => new
                {
                    IdPayment = table.Column<Guid>(type: "uuid", nullable: false),
                    IdRoomReservation = table.Column<Guid>(type: "uuid", nullable: false),
                    Importo = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: false),
                    Metodo = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    Stato = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    CartaUltime4 = table.Column<string>(type: "character varying(4)", maxLength: 4, nullable: true),
                    TitolareCarta = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: true),
                    TransactionId = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    DataCreazione = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DataCompletamento = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Payments", x => x.IdPayment);
                    table.ForeignKey(
                        name: "FK_Payments_RoomReservations_IdRoomReservation",
                        column: x => x.IdRoomReservation,
                        principalTable: "RoomReservations",
                        principalColumn: "IdRoomReservation",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Payments_IdRoomReservation",
                table: "Payments",
                column: "IdRoomReservation",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Payments");
        }
    }
}

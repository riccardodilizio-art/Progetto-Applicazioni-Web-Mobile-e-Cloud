using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Hotel.Site.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Initial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Menus",
                columns: table => new
                {
                    IdMenu = table.Column<Guid>(type: "uuid", nullable: false),
                    GiornoSettimana = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Menus", x => x.IdMenu);
                });

            migrationBuilder.CreateTable(
                name: "Rooms",
                columns: table => new
                {
                    IdRoom = table.Column<Guid>(type: "uuid", nullable: false),
                    Nome = table.Column<string>(type: "text", nullable: false),
                    TipoStanza = table.Column<int>(type: "integer", nullable: false),
                    Descrizione = table.Column<string>(type: "text", nullable: false),
                    PrezzoPerNotte = table.Column<decimal>(type: "numeric", nullable: false),
                    CapacitaMassima = table.Column<int>(type: "integer", nullable: false),
                    Dimensione = table.Column<int>(type: "integer", nullable: false),
                    Piano = table.Column<int>(type: "integer", nullable: false),
                    NumeroCamera = table.Column<int>(type: "integer", nullable: false),
                    Disponibile = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Rooms", x => x.IdRoom);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    IdUser = table.Column<Guid>(type: "uuid", nullable: false),
                    Nome = table.Column<string>(type: "text", nullable: false),
                    Cognome = table.Column<string>(type: "text", nullable: false),
                    Email = table.Column<string>(type: "text", nullable: false),
                    Password = table.Column<string>(type: "text", nullable: false),
                    NumeroTelefono = table.Column<string>(type: "text", nullable: false),
                    Ruolo = table.Column<int>(type: "integer", nullable: false),
                    DataCreazione = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.IdUser);
                });

            migrationBuilder.CreateTable(
                name: "Dishes",
                columns: table => new
                {
                    IdDish = table.Column<Guid>(type: "uuid", nullable: false),
                    Nome = table.Column<string>(type: "text", nullable: false),
                    Descrizione = table.Column<string>(type: "text", nullable: false),
                    Categoria = table.Column<int>(type: "integer", nullable: false),
                    TipoPiatto = table.Column<int>(type: "integer", nullable: false),
                    MenuId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Dishes", x => x.IdDish);
                    table.ForeignKey(
                        name: "FK_Dishes_Menus_MenuId",
                        column: x => x.MenuId,
                        principalTable: "Menus",
                        principalColumn: "IdMenu",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "RoomAmenities",
                columns: table => new
                {
                    IdRoomAmenity = table.Column<Guid>(type: "uuid", nullable: false),
                    NomeServizio = table.Column<string>(type: "text", nullable: false),
                    RoomId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RoomAmenities", x => x.IdRoomAmenity);
                    table.ForeignKey(
                        name: "FK_RoomAmenities_Rooms_RoomId",
                        column: x => x.RoomId,
                        principalTable: "Rooms",
                        principalColumn: "IdRoom",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "RoomImages",
                columns: table => new
                {
                    IdRoomImage = table.Column<Guid>(type: "uuid", nullable: false),
                    Url = table.Column<string>(type: "text", nullable: false),
                    RoomId = table.Column<Guid>(type: "uuid", nullable: false),
                    Position = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RoomImages", x => x.IdRoomImage);
                    table.ForeignKey(
                        name: "FK_RoomImages_Rooms_RoomId",
                        column: x => x.RoomId,
                        principalTable: "Rooms",
                        principalColumn: "IdRoom",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "RoomReservations",
                columns: table => new
                {
                    IdRoomReservation = table.Column<Guid>(type: "uuid", nullable: false),
                    IdUser = table.Column<Guid>(type: "uuid", nullable: false),
                    IdRoom = table.Column<Guid>(type: "uuid", nullable: false),
                    CodiceCena = table.Column<string>(type: "text", nullable: false),
                    CheckIn = table.Column<DateOnly>(type: "date", nullable: false),
                    CheckOut = table.Column<DateOnly>(type: "date", nullable: false),
                    PrezzoTotale = table.Column<decimal>(type: "numeric", nullable: false),
                    Stato = table.Column<int>(type: "integer", nullable: false),
                    DataPrenotazione = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    PrezzoPerNotte = table.Column<decimal>(type: "numeric", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RoomReservations", x => x.IdRoomReservation);
                    table.UniqueConstraint("AK_RoomReservations_CodiceCena", x => x.CodiceCena);
                    table.ForeignKey(
                        name: "FK_RoomReservations_Rooms_IdRoom",
                        column: x => x.IdRoom,
                        principalTable: "Rooms",
                        principalColumn: "IdRoom",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_RoomReservations_Users_IdUser",
                        column: x => x.IdUser,
                        principalTable: "Users",
                        principalColumn: "IdUser",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "DinnerReservations",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    CodiceCena = table.Column<string>(type: "text", nullable: false),
                    Data = table.Column<DateOnly>(type: "date", nullable: false),
                    NumeroCoperti = table.Column<int>(type: "integer", nullable: false),
                    StatoPrenotazione = table.Column<int>(type: "integer", nullable: false),
                    DataCreazione = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DinnerReservations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DinnerReservations_RoomReservations_CodiceCena",
                        column: x => x.CodiceCena,
                        principalTable: "RoomReservations",
                        principalColumn: "CodiceCena",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DinnerOrders",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    DinnerReservationId = table.Column<Guid>(type: "uuid", nullable: false),
                    NumeroCoperto = table.Column<int>(type: "integer", nullable: false),
                    Primo = table.Column<string>(type: "text", nullable: false),
                    Secondo = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DinnerOrders", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DinnerOrders_DinnerReservations_DinnerReservationId",
                        column: x => x.DinnerReservationId,
                        principalTable: "DinnerReservations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "IdUser", "Cognome", "DataCreazione", "Email", "Nome", "NumeroTelefono", "Password", "Ruolo" },
                values: new object[,]
                {
                    { new Guid("11111111-1111-1111-1111-111111111111"), "Hotel", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "admin@hotelexcelsior.it", "Admin", "0000000000", "admin123", 1 },
                    { new Guid("22222222-2222-2222-2222-222222222222"), "Rossi", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "cliente@hotelexcelsior.it", "Mario", "3331234567", "cliente123", 0 }
                });

            migrationBuilder.CreateIndex(
                name: "IX_DinnerOrders_DinnerReservationId",
                table: "DinnerOrders",
                column: "DinnerReservationId");

            migrationBuilder.CreateIndex(
                name: "IX_DinnerReservations_CodiceCena",
                table: "DinnerReservations",
                column: "CodiceCena");

            migrationBuilder.CreateIndex(
                name: "IX_Dishes_MenuId",
                table: "Dishes",
                column: "MenuId");

            migrationBuilder.CreateIndex(
                name: "IX_RoomAmenities_RoomId",
                table: "RoomAmenities",
                column: "RoomId");

            migrationBuilder.CreateIndex(
                name: "IX_RoomImages_RoomId",
                table: "RoomImages",
                column: "RoomId");

            migrationBuilder.CreateIndex(
                name: "IX_RoomReservations_IdRoom",
                table: "RoomReservations",
                column: "IdRoom");

            migrationBuilder.CreateIndex(
                name: "IX_RoomReservations_IdUser",
                table: "RoomReservations",
                column: "IdUser");

            migrationBuilder.CreateIndex(
                name: "IX_Users_Email",
                table: "Users",
                column: "Email",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DinnerOrders");

            migrationBuilder.DropTable(
                name: "Dishes");

            migrationBuilder.DropTable(
                name: "RoomAmenities");

            migrationBuilder.DropTable(
                name: "RoomImages");

            migrationBuilder.DropTable(
                name: "DinnerReservations");

            migrationBuilder.DropTable(
                name: "Menus");

            migrationBuilder.DropTable(
                name: "RoomReservations");

            migrationBuilder.DropTable(
                name: "Rooms");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}

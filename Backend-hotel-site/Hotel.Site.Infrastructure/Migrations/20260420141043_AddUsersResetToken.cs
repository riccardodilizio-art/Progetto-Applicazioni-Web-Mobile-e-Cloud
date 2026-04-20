using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Hotel.Site.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddUsersResetToken : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "ResetTokenExpiry",
                table: "Users",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ResetTokenHash",
                table: "Users",
                type: "character varying(128)",
                maxLength: 128,
                nullable: true);

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "IdUser",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"),
                columns: new[] { "ResetTokenExpiry", "ResetTokenHash" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "IdUser",
                keyValue: new Guid("22222222-2222-2222-2222-222222222222"),
                columns: new[] { "ResetTokenExpiry", "ResetTokenHash" },
                values: new object[] { null, null });

            migrationBuilder.CreateIndex(
                name: "IX_Users_ResetTokenHash",
                table: "Users",
                column: "ResetTokenHash");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Users_ResetTokenHash",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "ResetTokenExpiry",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "ResetTokenHash",
                table: "Users");
        }
    }
}

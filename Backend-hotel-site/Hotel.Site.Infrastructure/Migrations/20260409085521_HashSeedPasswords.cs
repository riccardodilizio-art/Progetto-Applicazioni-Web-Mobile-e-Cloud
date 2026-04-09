using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Hotel.Site.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class HashSeedPasswords : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "IdUser",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"),
                column: "Password",
                value: "$2b$11$.i42CzTY.byNwR.bvY4AM.amERMHtyRQGAhX2QtcbbvADwzW89XoG");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "IdUser",
                keyValue: new Guid("22222222-2222-2222-2222-222222222222"),
                column: "Password",
                value: "$2b$11$LujGaaGHK3tDqaw0A8J82.FTHz5jzj5Nwa0/bfimhXLtpqthTvIsG");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "IdUser",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"),
                column: "Password",
                value: "admin123");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "IdUser",
                keyValue: new Guid("22222222-2222-2222-2222-222222222222"),
                column: "Password",
                value: "cliente123");
        }
    }
}

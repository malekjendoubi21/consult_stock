using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace comsult_stock.Migrations
{
    /// <inheritdoc />
    public partial class mig : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<double>(
                name: "PrixTotal",
                table: "Ventes",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "PrixUnitaire",
                table: "Ventes",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<DateTime>(
                name: "DateCreation",
                table: "Tickets",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "DateImpression",
                table: "Tickets",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsImprime",
                table: "Tickets",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "VenteId",
                table: "Tickets",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "DateExpiration",
                table: "Stocks",
                type: "datetime2",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Tickets_VenteId",
                table: "Tickets",
                column: "VenteId");

            migrationBuilder.AddForeignKey(
                name: "FK_Tickets_Ventes_VenteId",
                table: "Tickets",
                column: "VenteId",
                principalTable: "Ventes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Tickets_Ventes_VenteId",
                table: "Tickets");

            migrationBuilder.DropIndex(
                name: "IX_Tickets_VenteId",
                table: "Tickets");

            migrationBuilder.DropColumn(
                name: "PrixTotal",
                table: "Ventes");

            migrationBuilder.DropColumn(
                name: "PrixUnitaire",
                table: "Ventes");

            migrationBuilder.DropColumn(
                name: "DateCreation",
                table: "Tickets");

            migrationBuilder.DropColumn(
                name: "DateImpression",
                table: "Tickets");

            migrationBuilder.DropColumn(
                name: "IsImprime",
                table: "Tickets");

            migrationBuilder.DropColumn(
                name: "VenteId",
                table: "Tickets");

            migrationBuilder.DropColumn(
                name: "DateExpiration",
                table: "Stocks");
        }
    }
}

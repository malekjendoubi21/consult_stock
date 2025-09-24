using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace comsult_stock.Migrations
{
    /// <inheritdoc />
    public partial class UpdateModelsWithNewFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ArticleCode",
                table: "Lots",
                newName: "NumLot");

            migrationBuilder.AddColumn<int>(
                name: "ArticleId",
                table: "Ventes",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "LotId",
                table: "Ventes",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ArticleId",
                table: "Stocks",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "LotId",
                table: "Stocks",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "DateExpiration",
                table: "Lots",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "PrixUnitaire",
                table: "Lots",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.CreateIndex(
                name: "IX_Ventes_ArticleId",
                table: "Ventes",
                column: "ArticleId");

            migrationBuilder.CreateIndex(
                name: "IX_Ventes_LotId",
                table: "Ventes",
                column: "LotId");

            migrationBuilder.CreateIndex(
                name: "IX_Stocks_ArticleId",
                table: "Stocks",
                column: "ArticleId");

            migrationBuilder.CreateIndex(
                name: "IX_Stocks_LotId",
                table: "Stocks",
                column: "LotId");

            migrationBuilder.AddForeignKey(
                name: "FK_Stocks_Articles_ArticleId",
                table: "Stocks",
                column: "ArticleId",
                principalTable: "Articles",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Stocks_Lots_LotId",
                table: "Stocks",
                column: "LotId",
                principalTable: "Lots",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Ventes_Articles_ArticleId",
                table: "Ventes",
                column: "ArticleId",
                principalTable: "Articles",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Ventes_Lots_LotId",
                table: "Ventes",
                column: "LotId",
                principalTable: "Lots",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Stocks_Articles_ArticleId",
                table: "Stocks");

            migrationBuilder.DropForeignKey(
                name: "FK_Stocks_Lots_LotId",
                table: "Stocks");

            migrationBuilder.DropForeignKey(
                name: "FK_Ventes_Articles_ArticleId",
                table: "Ventes");

            migrationBuilder.DropForeignKey(
                name: "FK_Ventes_Lots_LotId",
                table: "Ventes");

            migrationBuilder.DropIndex(
                name: "IX_Ventes_ArticleId",
                table: "Ventes");

            migrationBuilder.DropIndex(
                name: "IX_Ventes_LotId",
                table: "Ventes");

            migrationBuilder.DropIndex(
                name: "IX_Stocks_ArticleId",
                table: "Stocks");

            migrationBuilder.DropIndex(
                name: "IX_Stocks_LotId",
                table: "Stocks");

            migrationBuilder.DropColumn(
                name: "ArticleId",
                table: "Ventes");

            migrationBuilder.DropColumn(
                name: "LotId",
                table: "Ventes");

            migrationBuilder.DropColumn(
                name: "ArticleId",
                table: "Stocks");

            migrationBuilder.DropColumn(
                name: "LotId",
                table: "Stocks");

            migrationBuilder.DropColumn(
                name: "DateExpiration",
                table: "Lots");

            migrationBuilder.DropColumn(
                name: "PrixUnitaire",
                table: "Lots");

            migrationBuilder.RenameColumn(
                name: "NumLot",
                table: "Lots",
                newName: "ArticleCode");
        }
    }
}

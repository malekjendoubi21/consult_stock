using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace comsult_stock.Migrations
{
    /// <inheritdoc />
    public partial class ConfigureRelationshipsFixed : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Lots_Articles_ArticleId",
                table: "Lots");

            migrationBuilder.DropForeignKey(
                name: "FK_Stocks_Articles_ArticleId",
                table: "Stocks");

            migrationBuilder.DropForeignKey(
                name: "FK_Stocks_Lots_LotId",
                table: "Stocks");

            migrationBuilder.DropForeignKey(
                name: "FK_Stocks_Societes_SocieteId",
                table: "Stocks");

            migrationBuilder.DropForeignKey(
                name: "FK_Ventes_Articles_ArticleId",
                table: "Ventes");

            migrationBuilder.DropForeignKey(
                name: "FK_Ventes_Lots_LotId",
                table: "Ventes");

            migrationBuilder.DropForeignKey(
                name: "FK_Ventes_Societes_SocieteId",
                table: "Ventes");

            migrationBuilder.AddForeignKey(
                name: "FK_Lots_Articles_ArticleId",
                table: "Lots",
                column: "ArticleId",
                principalTable: "Articles",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Stocks_Articles_ArticleId",
                table: "Stocks",
                column: "ArticleId",
                principalTable: "Articles",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Stocks_Lots_LotId",
                table: "Stocks",
                column: "LotId",
                principalTable: "Lots",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Stocks_Societes_SocieteId",
                table: "Stocks",
                column: "SocieteId",
                principalTable: "Societes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Ventes_Articles_ArticleId",
                table: "Ventes",
                column: "ArticleId",
                principalTable: "Articles",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Ventes_Lots_LotId",
                table: "Ventes",
                column: "LotId",
                principalTable: "Lots",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Ventes_Societes_SocieteId",
                table: "Ventes",
                column: "SocieteId",
                principalTable: "Societes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Lots_Articles_ArticleId",
                table: "Lots");

            migrationBuilder.DropForeignKey(
                name: "FK_Stocks_Articles_ArticleId",
                table: "Stocks");

            migrationBuilder.DropForeignKey(
                name: "FK_Stocks_Lots_LotId",
                table: "Stocks");

            migrationBuilder.DropForeignKey(
                name: "FK_Stocks_Societes_SocieteId",
                table: "Stocks");

            migrationBuilder.DropForeignKey(
                name: "FK_Ventes_Articles_ArticleId",
                table: "Ventes");

            migrationBuilder.DropForeignKey(
                name: "FK_Ventes_Lots_LotId",
                table: "Ventes");

            migrationBuilder.DropForeignKey(
                name: "FK_Ventes_Societes_SocieteId",
                table: "Ventes");

            migrationBuilder.AddForeignKey(
                name: "FK_Lots_Articles_ArticleId",
                table: "Lots",
                column: "ArticleId",
                principalTable: "Articles",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

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
                name: "FK_Stocks_Societes_SocieteId",
                table: "Stocks",
                column: "SocieteId",
                principalTable: "Societes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

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

            migrationBuilder.AddForeignKey(
                name: "FK_Ventes_Societes_SocieteId",
                table: "Ventes",
                column: "SocieteId",
                principalTable: "Societes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}

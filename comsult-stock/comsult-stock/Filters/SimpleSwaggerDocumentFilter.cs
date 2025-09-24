using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace consult_stock.Filters
{
    /// <summary>
    /// Filtre Swagger simple et robuste
    /// </summary>
    public class SimpleSwaggerDocumentFilter : IDocumentFilter
    {
        public void Apply(OpenApiDocument swaggerDoc, DocumentFilterContext context)
        {
            // Configuration simple et sûre des tags
            swaggerDoc.Tags = GetApiTags();

            // Configuration des serveurs si pas déjà définis
            if (swaggerDoc.Servers == null || !swaggerDoc.Servers.Any())
            {
                swaggerDoc.Servers = GetDefaultServers();
            }
        }

        private static List<OpenApiTag> GetApiTags()
        {
            return new List<OpenApiTag>
            {
                new() { Name = "Articles", Description = "?? Gestion des articles - CRUD et recherche" },
                new() { Name = "Lots", Description = "?? Gestion des lots avec dates d'expiration" },
                new() { Name = "Stocks", Description = "?? Gestion des stocks par société" },
                new() { Name = "Ventes", Description = "?? Gestion des ventes et tickets" },
                new() { Name = "Societes", Description = "?? Gestion des sociétés clientes" },
                new() { Name = "Administrateurs", Description = "?? Gestion des administrateurs" },
                new() { Name = "Vendeurs", Description = "?? Gestion des vendeurs" },
                new() { Name = "Tickets", Description = "?? Gestion des tickets de vente" },
                new() { Name = "ApiInfo", Description = "?? Informations sur l'API" }
            };
        }

        private static List<OpenApiServer> GetDefaultServers()
        {
            return new List<OpenApiServer>
            {
                new() { Url = "https://localhost:7000", Description = "?? Serveur HTTPS (Recommandé)" },
                new() { Url = "http://localhost:5000", Description = "?? Serveur HTTP (Développement)" }
            };
        }
    }
}
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace consult_stock.Filters
{
    public class SwaggerDocumentFilter : IDocumentFilter
    {
        public void Apply(OpenApiDocument swaggerDoc, DocumentFilterContext context)
        {
            // Ajouter des tags personnalis�s pour organiser les endpoints
            swaggerDoc.Tags = new List<OpenApiTag>
            {
                new OpenApiTag
                {
                    Name = "Articles",
                    Description = "Gestion des articles - CRUD et recherche"
                },
                new OpenApiTag
                {
                    Name = "Lots",
                    Description = "Gestion des lots d'articles avec dates d'expiration"
                },
                new OpenApiTag
                {
                    Name = "Stocks",
                    Description = "Gestion des stocks par soci�t� avec calculs automatiques"
                },
                new OpenApiTag
                {
                    Name = "Ventes",
                    Description = "Gestion des ventes et g�n�ration de tickets"
                },
                new OpenApiTag
                {
                    Name = "Societes",
                    Description = "Gestion des soci�t�s clientes"
                },
                new OpenApiTag
                {
                    Name = "Administrateurs",
                    Description = "Gestion des comptes administrateurs"
                },
                new OpenApiTag
                {
                    Name = "Vendeurs",
                    Description = "Gestion des comptes vendeurs"
                },
                new OpenApiTag
                {
                    Name = "Tickets",
                    Description = "Gestion des tickets de vente"
                },
                new OpenApiTag
                {
                    Name = "ApiInfo",
                    Description = "Informations g�n�rales sur l'API"
                }
            };

            // Personnaliser les serveurs
            swaggerDoc.Servers = new List<OpenApiServer>
            {
                new OpenApiServer { Url = "https://localhost:7131", Description = "Serveur de d�veloppement HTTPS" },
                new OpenApiServer { Url = "http://localhost:5000", Description = "Serveur de d�veloppement HTTP" }
            };

            // Ajouter des informations de version et de contact (v�rifier si la cl� existe d�j�)
            if (swaggerDoc.Info.Extensions == null)
            {
                swaggerDoc.Info.Extensions = new Dictionary<string, Microsoft.OpenApi.Interfaces.IOpenApiExtension>();
            }

            // Ajouter x-logo seulement si elle n'existe pas d�j�
            if (!swaggerDoc.Info.Extensions.ContainsKey("x-logo"))
            {
                swaggerDoc.Info.Extensions.Add("x-logo", new Microsoft.OpenApi.Any.OpenApiObject
                {
                    ["url"] = new Microsoft.OpenApi.Any.OpenApiString("/logo.png"),
                    ["altText"] = new Microsoft.OpenApi.Any.OpenApiString("Consult Stock Logo")
                });
            }

            // Ajouter d'autres m�tadonn�es utiles
            if (!swaggerDoc.Info.Extensions.ContainsKey("x-api-id"))
            {
                swaggerDoc.Info.Extensions.Add("x-api-id", new Microsoft.OpenApi.Any.OpenApiString("consult-stock-api"));
            }

            if (!swaggerDoc.Info.Extensions.ContainsKey("x-audience"))
            {
                swaggerDoc.Info.Extensions.Add("x-audience", new Microsoft.OpenApi.Any.OpenApiString("internal"));
            }
        }
    }
}
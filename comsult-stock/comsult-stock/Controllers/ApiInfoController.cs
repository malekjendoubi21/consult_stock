using Microsoft.AspNetCore.Mvc;

namespace consult_stock.Controllers
{
    [ApiController]
    [Route("api")]
    [Tags("ApiInfo")]
    public class ApiInfoController : ControllerBase
    {
        /// <summary>
        /// Informations sur l'API
        /// </summary>
        /// <returns>Informations g�n�rales sur l'API</returns>
        [HttpGet("info")]
        [ProducesResponseType(200)]
        public IActionResult GetApiInfo()
        {
            return Ok(new
            {
                name = "Consult Stock API",
                version = "v1.0",
                description = "API de gestion de stock pour les soci�t�s",
                endpoints = new
                {
                    swagger = "/swagger",
                    health = "/api/health"
                },
                features = new[]
                {
                    "Gestion des articles",
                    "Gestion des lots",
                    "Gestion des stocks",
                    "Gestion des ventes",
                    "Gestion des soci�t�s",
                    "Authentification JWT",
                    "Autorisation par r�les"
                }
            });
        }

        /// <summary>
        /// V�rification de l'�tat de l'API
        /// </summary>
        /// <returns>�tat de sant� de l'API</returns>
        [HttpGet("health")]
        [ProducesResponseType(200)]
        public IActionResult HealthCheck()
        {
            return Ok(new
            {
                status = "healthy",
                timestamp = DateTime.UtcNow,
                environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Production"
            });
        }
    }
}
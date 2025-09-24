using consult_stock.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace consult_stock.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [AllowAnonymous] // Permettre l'acc�s anonyme pour tous les endpoints du dashboard
    [Tags("Dashboard")]
    public class DashboardController : ControllerBase
    {
        private readonly DashboardService _dashboardService;

        public DashboardController(DashboardService dashboardService)
        {
            _dashboardService = dashboardService;
        }

        /// <summary>
        /// Obtient les statistiques g�n�rales de l'application
        /// </summary>
        /// <returns>Statistiques g�n�rales incluant les totaux</returns>
        [HttpGet("stats/general")]
        [ProducesResponseType(200)]
        public async Task<IActionResult> GetGeneralStats()
        {
            try
            {
                var stats = await _dashboardService.GetGeneralStatsAsync();
                return Ok(stats);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erreur lors de la r�cup�ration des statistiques g�n�rales", error = ex.Message });
            }
        }

        /// <summary>
        /// Obtient les m�triques cl�s pour les cartes du dashboard
        /// </summary>
        /// <returns>M�triques cl�s avec �volutions</returns>
        [HttpGet("metriques")]
        [ProducesResponseType(200)]
        public async Task<IActionResult> GetMetriquesCl�s()
        {
            try
            {
                var metriques = await _dashboardService.GetMetriquesCl�sAsync();
                return Ok(metriques);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erreur lors de la r�cup�ration des m�triques", error = ex.Message });
            }
        }

        /// <summary>
        /// Endpoint pour tester l'authentification (optionnel)
        /// </summary>
        /// <returns>Informations sur l'utilisateur connect� ou statut non connect�</returns>
        [HttpGet("auth-test")]
        [ProducesResponseType(200)]
        public IActionResult TestAuth()
        {
            var userLogin = User.FindFirstValue(ClaimTypes.Name);
            var userRole = User.FindFirstValue(ClaimTypes.Role);
            var isAuthenticated = User.Identity?.IsAuthenticated ?? false;
            
            if (string.IsNullOrEmpty(userLogin))
            {
                return Ok(new { 
                    message = "Utilisateur non authentifi� - mais acc�s autoris� en mode test", 
                    isAuthenticated = false,
                    mode = "AllowAnonymous",
                    note = "L'authentification n'est pas requise pour le dashboard en mode test"
                });
            }

            return Ok(new { 
                message = "Authentification r�ussie", 
                user = userLogin, 
                role = userRole,
                isAuthenticated = isAuthenticated,
                claims = User.Claims.Select(c => new { c.Type, c.Value }).ToList()
            });
        }

        /// <summary>
        /// Version publique des m�triques de base (pour test)
        /// </summary>
        /// <returns>M�triques de base sans authentification</returns>
        [HttpGet("metriques-public")]
        [ProducesResponseType(200)]
        public async Task<IActionResult> GetMetriquesPublic()
        {
            try
            {
                // Version simplifi�e pour les tests
                var stats = new
                {
                    message = "Donn�es de test - Dashboard accessible en mode anonyme",
                    timestamp = DateTime.Now,
                    status = "OK",
                    mode = "AllowAnonymous"
                };
                return Ok(stats);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erreur", error = ex.Message });
            }
        }

        /// <summary>
        /// Obtient les statistiques des ventes par mois (12 derniers mois)
        /// </summary>
        /// <returns>Donn�es pour graphique en courbes des ventes mensuelles</returns>
        [HttpGet("ventes/par-mois")]
        [ProducesResponseType(200)]
        public async Task<IActionResult> GetVentesParMois()
        {
            try
            {
                var stats = await _dashboardService.GetVentesParMoisAsync();
                return Ok(stats);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erreur lors de la r�cup�ration des ventes par mois", error = ex.Message });
            }
        }

        /// <summary>
        /// Obtient les ventes par p�riode (jour/semaine/mois)
        /// </summary>
        /// <param name="periode">P�riode : jour, semaine, ou mois</param>
        /// <returns>Donn�es des ventes pour la p�riode sp�cifi�e</returns>
        [HttpGet("ventes/par-periode")]
        [ProducesResponseType(200)]
        public async Task<IActionResult> GetVentesParPeriode([FromQuery] string periode = "jour")
        {
            try
            {
                var stats = await _dashboardService.GetVentesParPeriodeAsync(periode);
                return Ok(stats);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erreur lors de la r�cup�ration des ventes par p�riode", error = ex.Message });
            }
        }

        /// <summary>
        /// Obtient le top 10 des articles les plus vendus
        /// </summary>
        /// <returns>Donn�es pour graphique en barres des articles populaires</returns>
        [HttpGet("articles/top-vendus")]
        [ProducesResponseType(200)]
        public async Task<IActionResult> GetTopArticlesVendus()
        {
            try
            {
                var stats = await _dashboardService.GetTopArticlesVendusAsync();
                return Ok(stats);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erreur lors de la r�cup�ration du top des articles", error = ex.Message });
            }
        }

        /// <summary>
        /// Obtient les statistiques des stocks par article
        /// </summary>
        /// <returns>Donn�es pour graphique des niveaux de stock</returns>
        [HttpGet("stocks/par-article")]
        [ProducesResponseType(200)]
        public async Task<IActionResult> GetStockParArticle()
        {
            try
            {
                var stats = await _dashboardService.GetStockParArticleAsync();
                return Ok(stats);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erreur lors de la r�cup�ration des stocks par article", error = ex.Message });
            }
        }

        /// <summary>
        /// Obtient les lots proches de l'expiration (30 jours)
        /// </summary>
        /// <returns>Liste des lots avec dates d'expiration proches</returns>
        [HttpGet("lots/expiration-proches")]
        [ProducesResponseType(200)]
        public async Task<IActionResult> GetLotsExpirationProches()
        {
            try
            {
                var stats = await _dashboardService.GetLotsExpirationProchesAsync();
                return Ok(stats);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erreur lors de la r�cup�ration des lots proches d'expiration", error = ex.Message });
            }
        }

        /// <summary>
        /// Obtient l'�volution du chiffre d'affaires (30 derniers jours)
        /// </summary>
        /// <returns>Donn�es pour graphique en courbes du CA quotidien</returns>
        [HttpGet("chiffre-affaire/evolution")]
        [ProducesResponseType(200)]
        public async Task<IActionResult> GetEvolutionChiffreAffaire()
        {
            try
            {
                var stats = await _dashboardService.GetEvolutionChiffreAffaireAsync();
                return Ok(stats);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erreur lors de la r�cup�ration de l'�volution du CA", error = ex.Message });
            }
        }

        /// <summary>
        /// Obtient la r�partition des ventes par soci�t�
        /// </summary>
        /// <returns>Donn�es pour graphique en secteurs (pie chart) des ventes par soci�t�</returns>
        [HttpGet("ventes/par-societe")]
        [ProducesResponseType(200)]
        public async Task<IActionResult> GetVentesParSociete()
        {
            try
            {
                var stats = await _dashboardService.GetVentesParSocieteAsync();
                return Ok(stats);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erreur lors de la r�cup�ration des ventes par soci�t�", error = ex.Message });
            }
        }

        /// <summary>
        /// Obtient les alertes de stock (ruptures et stocks faibles)
        /// </summary>
        /// <returns>Liste des articles avec des alertes de stock</returns>
        [HttpGet("alertes/stock")]
        [ProducesResponseType(200)]
        public async Task<IActionResult> GetAlertsStock()
        {
            try
            {
                var stats = await _dashboardService.GetAlertsStockAsync();
                return Ok(stats);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erreur lors de la r�cup�ration des alertes stock", error = ex.Message });
            }
        }

        /// <summary>
        /// Obtient les statistiques des prix moyens par article
        /// </summary>
        /// <returns>Donn�es des prix (min, max, moyen) par article</returns>
        [HttpGet("articles/prix-moyens")]
        [ProducesResponseType(200)]
        public async Task<IActionResult> GetPrixMoyenParArticle()
        {
            try
            {
                var stats = await _dashboardService.GetPrixMoyenParArticleAsync();
                return Ok(stats);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erreur lors de la r�cup�ration des prix moyens", error = ex.Message });
            }
        }

        /// <summary>
        /// Obtient les performances des vendeurs
        /// </summary>
        /// <returns>Donn�es des performances de chaque vendeur</returns>
        [HttpGet("vendeurs/performances")]
        [ProducesResponseType(200)]
        public async Task<IActionResult> GetPerformancesVendeurs()
        {
            try
            {
                var stats = await _dashboardService.GetPerformancesVendeursAsync();
                return Ok(stats);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erreur lors de la r�cup�ration des performances vendeurs", error = ex.Message });
            }
        }

        /// <summary>
        /// Obtient un r�sum� complet pour le dashboard principal
        /// </summary>
        /// <returns>R�sum� avec toutes les donn�es principales</returns>
        [HttpGet("resume-complet")]
        [ProducesResponseType(200)]
        public async Task<IActionResult> GetResumeComplet()
        {
            try
            {
                var metriques = await _dashboardService.GetMetriquesCl�sAsync();
                var ventesParMois = await _dashboardService.GetVentesParMoisAsync();
                var topArticles = await _dashboardService.GetTopArticlesVendusAsync();
                var alertes = await _dashboardService.GetAlertsStockAsync();

                var resume = new
                {
                    Metriques = metriques,
                    VentesParMois = ventesParMois,
                    TopArticles = topArticles,
                    Alertes = alertes,
                    Mode = "AllowAnonymous",
                    Message = "Dashboard accessible sans authentification pour les tests"
                };

                return Ok(resume);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erreur lors de la r�cup�ration du r�sum� complet", error = ex.Message });
            }
        }

        /// <summary>
        /// Endpoint pour diagnostiquer les probl�mes d'authentification
        /// </summary>
        /// <returns>Informations d�taill�es sur l'�tat d'authentification</returns>
        [HttpGet("auth-debug")]
        [ProducesResponseType(200)]
        public IActionResult AuthDebug()
        {
            var authHeader = Request.Headers["Authorization"].FirstOrDefault();
            var userLogin = User.FindFirstValue(ClaimTypes.Name);
            var userRole = User.FindFirstValue(ClaimTypes.Role);
            var isAuthenticated = User.Identity?.IsAuthenticated ?? false;
            
            return Ok(new
            {
                message = "Debug des informations d'authentification",
                mode = "AllowAnonymous - Authentification optionnelle",
                hasAuthorizationHeader = !string.IsNullOrEmpty(authHeader),
                authorizationHeaderFormat = authHeader?.StartsWith("Bearer ") == true ? "Correct (Bearer)" : "Incorrect ou manquant",
                authorizationHeader = string.IsNullOrEmpty(authHeader) ? "Manquant" : authHeader.Substring(0, Math.Min(20, authHeader.Length)) + "...",
                isAuthenticated = isAuthenticated,
                userLogin = userLogin ?? "Non trouv�",
                userRole = userRole ?? "Non trouv�",
                claimsCount = User.Claims.Count(),
                allClaims = User.Claims.Select(c => new { c.Type, c.Value }).ToList(),
                timestamp = DateTime.Now,
                defaultAdminInfo = new
                {
                    email = "admin@ConsultStock.com",
                    password = "admin",
                    note = "Identifiants par d�faut de l'administrateur (optionnel en mode test)"
                },
                testInfo = new
                {
                    dashboardAccessible = true,
                    authenticationRequired = false,
                    swaggerTesting = "Tous les endpoints sont accessibles dans Swagger sans authentification"
                }
            });
        }

        /// <summary>
        /// Endpoint pour v�rifier l'existence des administrateurs (d�veloppement uniquement)
        /// </summary>
        /// <returns>Informations sur les administrateurs du syst�me</returns>
        [HttpGet("admin-status")]
        [ProducesResponseType(200)]
        public async Task<IActionResult> GetAdminStatus()
        {
            try
            {
                return Ok(new
                {
                    message = "Statut des administrateurs",
                    mode = "AllowAnonymous - Dashboard accessible sans authentification",
                    defaultAdmin = new
                    {
                        email = "admin@ConsultStock.com",
                        password = "admin",
                        status = "Devrait �tre cr�� automatiquement au d�marrage",
                        required = "Non requis pour acc�der au dashboard en mode test"
                    },
                    instructions = new[]
                    {
                        "Mode Test Activ�: Tous les endpoints du dashboard sont accessibles sans authentification",
                        "Pour tester avec authentification: utilisez l'endpoint /api/administrateurs/login",
                        "Email: admin@ConsultStock.com",
                        "Mot de passe: admin",
                        "Le token JWT peut �tre utilis� mais n'est pas obligatoire pour le dashboard"
                    },
                    swaggerTesting = new
                    {
                        accessible = true,
                        authRequired = false,
                        note = "Vous pouvez tester tous les endpoints directement dans Swagger"
                    },
                    timestamp = DateTime.Now
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erreur lors de la v�rification du statut admin", error = ex.Message });
            }
        }

        /// <summary>
        /// Endpoint de test pour v�rifier que le dashboard fonctionne
        /// </summary>
        /// <returns>Statut de sant� du dashboard</returns>
        [HttpGet("health")]
        [ProducesResponseType(200)]
        public IActionResult HealthCheck()
        {
            return Ok(new
            {
                status = "healthy",
                message = "Dashboard op�rationnel",
                mode = "AllowAnonymous",
                timestamp = DateTime.Now,
                endpoints = new
                {
                    metriques = "/api/dashboard/metriques",
                    statsGeneral = "/api/dashboard/stats/general",
                    ventesParMois = "/api/dashboard/ventes/par-mois",
                    topArticles = "/api/dashboard/articles/top-vendus",
                    resumeComplet = "/api/dashboard/resume-complet"
                },
                swaggerUrl = "/swagger"
            });
        }
    }
}
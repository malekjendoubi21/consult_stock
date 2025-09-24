using consult_stock.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace consult_stock.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [AllowAnonymous] // Permettre l'accès anonyme pour tous les endpoints du dashboard
    [Tags("Dashboard")]
    public class DashboardController : ControllerBase
    {
        private readonly DashboardService _dashboardService;

        public DashboardController(DashboardService dashboardService)
        {
            _dashboardService = dashboardService;
        }

        /// <summary>
        /// Obtient les statistiques générales de l'application
        /// </summary>
        /// <returns>Statistiques générales incluant les totaux</returns>
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
                return StatusCode(500, new { message = "Erreur lors de la récupération des statistiques générales", error = ex.Message });
            }
        }

        /// <summary>
        /// Obtient les métriques clés pour les cartes du dashboard
        /// </summary>
        /// <returns>Métriques clés avec évolutions</returns>
        [HttpGet("metriques")]
        [ProducesResponseType(200)]
        public async Task<IActionResult> GetMetriquesClés()
        {
            try
            {
                var metriques = await _dashboardService.GetMetriquesClésAsync();
                return Ok(metriques);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erreur lors de la récupération des métriques", error = ex.Message });
            }
        }

        /// <summary>
        /// Endpoint pour tester l'authentification (optionnel)
        /// </summary>
        /// <returns>Informations sur l'utilisateur connecté ou statut non connecté</returns>
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
                    message = "Utilisateur non authentifié - mais accès autorisé en mode test", 
                    isAuthenticated = false,
                    mode = "AllowAnonymous",
                    note = "L'authentification n'est pas requise pour le dashboard en mode test"
                });
            }

            return Ok(new { 
                message = "Authentification réussie", 
                user = userLogin, 
                role = userRole,
                isAuthenticated = isAuthenticated,
                claims = User.Claims.Select(c => new { c.Type, c.Value }).ToList()
            });
        }

        /// <summary>
        /// Version publique des métriques de base (pour test)
        /// </summary>
        /// <returns>Métriques de base sans authentification</returns>
        [HttpGet("metriques-public")]
        [ProducesResponseType(200)]
        public async Task<IActionResult> GetMetriquesPublic()
        {
            try
            {
                // Version simplifiée pour les tests
                var stats = new
                {
                    message = "Données de test - Dashboard accessible en mode anonyme",
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
        /// <returns>Données pour graphique en courbes des ventes mensuelles</returns>
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
                return StatusCode(500, new { message = "Erreur lors de la récupération des ventes par mois", error = ex.Message });
            }
        }

        /// <summary>
        /// Obtient les ventes par période (jour/semaine/mois)
        /// </summary>
        /// <param name="periode">Période : jour, semaine, ou mois</param>
        /// <returns>Données des ventes pour la période spécifiée</returns>
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
                return StatusCode(500, new { message = "Erreur lors de la récupération des ventes par période", error = ex.Message });
            }
        }

        /// <summary>
        /// Obtient le top 10 des articles les plus vendus
        /// </summary>
        /// <returns>Données pour graphique en barres des articles populaires</returns>
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
                return StatusCode(500, new { message = "Erreur lors de la récupération du top des articles", error = ex.Message });
            }
        }

        /// <summary>
        /// Obtient les statistiques des stocks par article
        /// </summary>
        /// <returns>Données pour graphique des niveaux de stock</returns>
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
                return StatusCode(500, new { message = "Erreur lors de la récupération des stocks par article", error = ex.Message });
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
                return StatusCode(500, new { message = "Erreur lors de la récupération des lots proches d'expiration", error = ex.Message });
            }
        }

        /// <summary>
        /// Obtient l'évolution du chiffre d'affaires (30 derniers jours)
        /// </summary>
        /// <returns>Données pour graphique en courbes du CA quotidien</returns>
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
                return StatusCode(500, new { message = "Erreur lors de la récupération de l'évolution du CA", error = ex.Message });
            }
        }

        /// <summary>
        /// Obtient la répartition des ventes par société
        /// </summary>
        /// <returns>Données pour graphique en secteurs (pie chart) des ventes par société</returns>
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
                return StatusCode(500, new { message = "Erreur lors de la récupération des ventes par société", error = ex.Message });
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
                return StatusCode(500, new { message = "Erreur lors de la récupération des alertes stock", error = ex.Message });
            }
        }

        /// <summary>
        /// Obtient les statistiques des prix moyens par article
        /// </summary>
        /// <returns>Données des prix (min, max, moyen) par article</returns>
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
                return StatusCode(500, new { message = "Erreur lors de la récupération des prix moyens", error = ex.Message });
            }
        }

        /// <summary>
        /// Obtient les performances des vendeurs
        /// </summary>
        /// <returns>Données des performances de chaque vendeur</returns>
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
                return StatusCode(500, new { message = "Erreur lors de la récupération des performances vendeurs", error = ex.Message });
            }
        }

        /// <summary>
        /// Obtient un résumé complet pour le dashboard principal
        /// </summary>
        /// <returns>Résumé avec toutes les données principales</returns>
        [HttpGet("resume-complet")]
        [ProducesResponseType(200)]
        public async Task<IActionResult> GetResumeComplet()
        {
            try
            {
                var metriques = await _dashboardService.GetMetriquesClésAsync();
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
                return StatusCode(500, new { message = "Erreur lors de la récupération du résumé complet", error = ex.Message });
            }
        }

        /// <summary>
        /// Endpoint pour diagnostiquer les problèmes d'authentification
        /// </summary>
        /// <returns>Informations détaillées sur l'état d'authentification</returns>
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
                userLogin = userLogin ?? "Non trouvé",
                userRole = userRole ?? "Non trouvé",
                claimsCount = User.Claims.Count(),
                allClaims = User.Claims.Select(c => new { c.Type, c.Value }).ToList(),
                timestamp = DateTime.Now,
                defaultAdminInfo = new
                {
                    email = "admin@ConsultStock.com",
                    password = "admin",
                    note = "Identifiants par défaut de l'administrateur (optionnel en mode test)"
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
        /// Endpoint pour vérifier l'existence des administrateurs (développement uniquement)
        /// </summary>
        /// <returns>Informations sur les administrateurs du système</returns>
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
                        status = "Devrait être créé automatiquement au démarrage",
                        required = "Non requis pour accéder au dashboard en mode test"
                    },
                    instructions = new[]
                    {
                        "Mode Test Activé: Tous les endpoints du dashboard sont accessibles sans authentification",
                        "Pour tester avec authentification: utilisez l'endpoint /api/administrateurs/login",
                        "Email: admin@ConsultStock.com",
                        "Mot de passe: admin",
                        "Le token JWT peut être utilisé mais n'est pas obligatoire pour le dashboard"
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
                return StatusCode(500, new { message = "Erreur lors de la vérification du statut admin", error = ex.Message });
            }
        }

        /// <summary>
        /// Endpoint de test pour vérifier que le dashboard fonctionne
        /// </summary>
        /// <returns>Statut de santé du dashboard</returns>
        [HttpGet("health")]
        [ProducesResponseType(200)]
        public IActionResult HealthCheck()
        {
            return Ok(new
            {
                status = "healthy",
                message = "Dashboard opérationnel",
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
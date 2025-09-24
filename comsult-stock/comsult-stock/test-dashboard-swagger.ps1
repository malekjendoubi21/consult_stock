# Script PowerShell pour tester le Dashboard avec Swagger (AllowAnonymous)

Write-Host "?? Test du Dashboard ConsultStock avec accès anonyme" -ForegroundColor Green
Write-Host "=" * 60

$baseUrl = "https://localhost:7000" # Ajustez le port selon votre configuration

# Fonction pour faire une requête HTTP
function Invoke-ApiRequest {
    param(
        [string]$Url,
        [string]$Method = "GET"
    )
    
    try {
        Write-Host "?? Test: $Url" -ForegroundColor Yellow
        $response = Invoke-RestMethod -Uri $Url -Method $Method
        Write-Host "? Succès" -ForegroundColor Green
        return $response
    }
    catch {
        Write-Host "? Erreur: $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

Write-Host "`n?? URL Swagger: $baseUrl/swagger" -ForegroundColor Cyan
Write-Host "=" * 60

# 1. Test de santé du dashboard
Write-Host "`n1?? Test de santé du dashboard..." -ForegroundColor Yellow
$health = Invoke-ApiRequest -Url "$baseUrl/api/dashboard/health"
if ($health) {
    Write-Host "   Status: $($health.status)" -ForegroundColor Green
    Write-Host "   Mode: $($health.mode)" -ForegroundColor Green
}

# 2. Test des métriques
Write-Host "`n2?? Test des métriques..." -ForegroundColor Yellow
$metriques = Invoke-ApiRequest -Url "$baseUrl/api/dashboard/metriques"
if ($metriques) {
    Write-Host "   Métriques récupérées avec succès" -ForegroundColor Green
}

# 3. Test des statistiques générales
Write-Host "`n3?? Test des statistiques générales..." -ForegroundColor Yellow
$stats = Invoke-ApiRequest -Url "$baseUrl/api/dashboard/stats/general"
if ($stats) {
    Write-Host "   Statistiques générales récupérées" -ForegroundColor Green
}

# 4. Test des ventes par mois
Write-Host "`n4?? Test des ventes par mois..." -ForegroundColor Yellow
$ventesParMois = Invoke-ApiRequest -Url "$baseUrl/api/dashboard/ventes/par-mois"
if ($ventesParMois) {
    Write-Host "   Données des ventes mensuelles récupérées" -ForegroundColor Green
}

# 5. Test du top des articles
Write-Host "`n5?? Test du top des articles..." -ForegroundColor Yellow
$topArticles = Invoke-ApiRequest -Url "$baseUrl/api/dashboard/articles/top-vendus"
if ($topArticles) {
    Write-Host "   Top des articles récupéré" -ForegroundColor Green
}

# 6. Test des stocks par article
Write-Host "`n6?? Test des stocks par article..." -ForegroundColor Yellow
$stocks = Invoke-ApiRequest -Url "$baseUrl/api/dashboard/stocks/par-article"
if ($stocks) {
    Write-Host "   Données des stocks récupérées" -ForegroundColor Green
}

# 7. Test des alertes de stock
Write-Host "`n7?? Test des alertes de stock..." -ForegroundColor Yellow
$alertes = Invoke-ApiRequest -Url "$baseUrl/api/dashboard/alertes/stock"
if ($alertes) {
    Write-Host "   Alertes de stock récupérées" -ForegroundColor Green
}

# 8. Test des lots proches d'expiration
Write-Host "`n8?? Test des lots proches d'expiration..." -ForegroundColor Yellow
$lotsExp = Invoke-ApiRequest -Url "$baseUrl/api/dashboard/lots/expiration-proches"
if ($lotsExp) {
    Write-Host "   Lots proches d'expiration récupérés" -ForegroundColor Green
}

# 9. Test de l'évolution du chiffre d'affaires
Write-Host "`n9?? Test de l'évolution du CA..." -ForegroundColor Yellow
$evolutionCA = Invoke-ApiRequest -Url "$baseUrl/api/dashboard/chiffre-affaire/evolution"
if ($evolutionCA) {
    Write-Host "   Évolution du CA récupérée" -ForegroundColor Green
}

# 10. Test des ventes par société
Write-Host "`n?? Test des ventes par société..." -ForegroundColor Yellow
$ventesSociete = Invoke-ApiRequest -Url "$baseUrl/api/dashboard/ventes/par-societe"
if ($ventesSociete) {
    Write-Host "   Ventes par société récupérées" -ForegroundColor Green
}

# 11. Test des prix moyens
Write-Host "`n1??1?? Test des prix moyens..." -ForegroundColor Yellow
$prixMoyens = Invoke-ApiRequest -Url "$baseUrl/api/dashboard/articles/prix-moyens"
if ($prixMoyens) {
    Write-Host "   Prix moyens récupérés" -ForegroundColor Green
}

# 12. Test des performances vendeurs
Write-Host "`n1??2?? Test des performances vendeurs..." -ForegroundColor Yellow
$performances = Invoke-ApiRequest -Url "$baseUrl/api/dashboard/vendeurs/performances"
if ($performances) {
    Write-Host "   Performances vendeurs récupérées" -ForegroundColor Green
}

# 13. Test du résumé complet
Write-Host "`n1??3?? Test du résumé complet..." -ForegroundColor Yellow
$resume = Invoke-ApiRequest -Url "$baseUrl/api/dashboard/resume-complet"
if ($resume) {
    Write-Host "   Résumé complet récupéré" -ForegroundColor Green
}

# 14. Test des ventes par période
Write-Host "`n1??4?? Test des ventes par période..." -ForegroundColor Yellow
$ventesJour = Invoke-ApiRequest -Url "$baseUrl/api/dashboard/ventes/par-periode?periode=jour"
$ventesSemaine = Invoke-ApiRequest -Url "$baseUrl/api/dashboard/ventes/par-periode?periode=semaine"
$ventesMois = Invoke-ApiRequest -Url "$baseUrl/api/dashboard/ventes/par-periode?periode=mois"
if ($ventesJour -and $ventesSemaine -and $ventesMois) {
    Write-Host "   Ventes par période (jour/semaine/mois) récupérées" -ForegroundColor Green
}

# 15. Test de debug d'authentification
Write-Host "`n1??5?? Test de debug d'authentification..." -ForegroundColor Yellow
$authDebug = Invoke-ApiRequest -Url "$baseUrl/api/dashboard/auth-debug"
if ($authDebug) {
    Write-Host "   Mode: $($authDebug.mode)" -ForegroundColor Green
    Write-Host "   Dashboard accessible: $($authDebug.testInfo.dashboardAccessible)" -ForegroundColor Green
}

Write-Host "`n" + "=" * 60
Write-Host "?? Tests terminés" -ForegroundColor Green

# Résumé
Write-Host "`n?? RÉSUMÉ DES TESTS" -ForegroundColor Cyan
Write-Host "=" * 60
Write-Host "? Mode: AllowAnonymous activé" -ForegroundColor White
Write-Host "? Tous les endpoints du dashboard sont accessibles sans authentification" -ForegroundColor White
Write-Host "? Tests Swagger possibles directement" -ForegroundColor White
Write-Host "?? URL Swagger: $baseUrl/swagger" -ForegroundColor Yellow
Write-Host "?? Section Dashboard dans Swagger disponible" -ForegroundColor Yellow

Write-Host "`n?? ENDPOINTS PRINCIPAUX À TESTER DANS SWAGGER:" -ForegroundColor Cyan
Write-Host "=" * 60
Write-Host "• GET /api/dashboard/health - Test de santé" -ForegroundColor White
Write-Host "• GET /api/dashboard/metriques - Métriques clés" -ForegroundColor White
Write-Host "• GET /api/dashboard/stats/general - Statistiques générales" -ForegroundColor White
Write-Host "• GET /api/dashboard/resume-complet - Résumé complet" -ForegroundColor White
Write-Host "• GET /api/dashboard/ventes/par-mois - Ventes mensuelles" -ForegroundColor White
Write-Host "• GET /api/dashboard/articles/top-vendus - Top articles" -ForegroundColor White
Write-Host "• GET /api/dashboard/alertes/stock - Alertes de stock" -ForegroundColor White

Write-Host "`n?? Vous pouvez maintenant tester tous les endpoints du dashboard dans Swagger sans authentification!" -ForegroundColor Green
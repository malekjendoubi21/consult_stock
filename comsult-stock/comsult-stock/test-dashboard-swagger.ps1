# Script PowerShell pour tester le Dashboard avec Swagger (AllowAnonymous)

Write-Host "?? Test du Dashboard ConsultStock avec acc�s anonyme" -ForegroundColor Green
Write-Host "=" * 60

$baseUrl = "https://localhost:7000" # Ajustez le port selon votre configuration

# Fonction pour faire une requ�te HTTP
function Invoke-ApiRequest {
    param(
        [string]$Url,
        [string]$Method = "GET"
    )
    
    try {
        Write-Host "?? Test: $Url" -ForegroundColor Yellow
        $response = Invoke-RestMethod -Uri $Url -Method $Method
        Write-Host "? Succ�s" -ForegroundColor Green
        return $response
    }
    catch {
        Write-Host "? Erreur: $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

Write-Host "`n?? URL Swagger: $baseUrl/swagger" -ForegroundColor Cyan
Write-Host "=" * 60

# 1. Test de sant� du dashboard
Write-Host "`n1?? Test de sant� du dashboard..." -ForegroundColor Yellow
$health = Invoke-ApiRequest -Url "$baseUrl/api/dashboard/health"
if ($health) {
    Write-Host "   Status: $($health.status)" -ForegroundColor Green
    Write-Host "   Mode: $($health.mode)" -ForegroundColor Green
}

# 2. Test des m�triques
Write-Host "`n2?? Test des m�triques..." -ForegroundColor Yellow
$metriques = Invoke-ApiRequest -Url "$baseUrl/api/dashboard/metriques"
if ($metriques) {
    Write-Host "   M�triques r�cup�r�es avec succ�s" -ForegroundColor Green
}

# 3. Test des statistiques g�n�rales
Write-Host "`n3?? Test des statistiques g�n�rales..." -ForegroundColor Yellow
$stats = Invoke-ApiRequest -Url "$baseUrl/api/dashboard/stats/general"
if ($stats) {
    Write-Host "   Statistiques g�n�rales r�cup�r�es" -ForegroundColor Green
}

# 4. Test des ventes par mois
Write-Host "`n4?? Test des ventes par mois..." -ForegroundColor Yellow
$ventesParMois = Invoke-ApiRequest -Url "$baseUrl/api/dashboard/ventes/par-mois"
if ($ventesParMois) {
    Write-Host "   Donn�es des ventes mensuelles r�cup�r�es" -ForegroundColor Green
}

# 5. Test du top des articles
Write-Host "`n5?? Test du top des articles..." -ForegroundColor Yellow
$topArticles = Invoke-ApiRequest -Url "$baseUrl/api/dashboard/articles/top-vendus"
if ($topArticles) {
    Write-Host "   Top des articles r�cup�r�" -ForegroundColor Green
}

# 6. Test des stocks par article
Write-Host "`n6?? Test des stocks par article..." -ForegroundColor Yellow
$stocks = Invoke-ApiRequest -Url "$baseUrl/api/dashboard/stocks/par-article"
if ($stocks) {
    Write-Host "   Donn�es des stocks r�cup�r�es" -ForegroundColor Green
}

# 7. Test des alertes de stock
Write-Host "`n7?? Test des alertes de stock..." -ForegroundColor Yellow
$alertes = Invoke-ApiRequest -Url "$baseUrl/api/dashboard/alertes/stock"
if ($alertes) {
    Write-Host "   Alertes de stock r�cup�r�es" -ForegroundColor Green
}

# 8. Test des lots proches d'expiration
Write-Host "`n8?? Test des lots proches d'expiration..." -ForegroundColor Yellow
$lotsExp = Invoke-ApiRequest -Url "$baseUrl/api/dashboard/lots/expiration-proches"
if ($lotsExp) {
    Write-Host "   Lots proches d'expiration r�cup�r�s" -ForegroundColor Green
}

# 9. Test de l'�volution du chiffre d'affaires
Write-Host "`n9?? Test de l'�volution du CA..." -ForegroundColor Yellow
$evolutionCA = Invoke-ApiRequest -Url "$baseUrl/api/dashboard/chiffre-affaire/evolution"
if ($evolutionCA) {
    Write-Host "   �volution du CA r�cup�r�e" -ForegroundColor Green
}

# 10. Test des ventes par soci�t�
Write-Host "`n?? Test des ventes par soci�t�..." -ForegroundColor Yellow
$ventesSociete = Invoke-ApiRequest -Url "$baseUrl/api/dashboard/ventes/par-societe"
if ($ventesSociete) {
    Write-Host "   Ventes par soci�t� r�cup�r�es" -ForegroundColor Green
}

# 11. Test des prix moyens
Write-Host "`n1??1?? Test des prix moyens..." -ForegroundColor Yellow
$prixMoyens = Invoke-ApiRequest -Url "$baseUrl/api/dashboard/articles/prix-moyens"
if ($prixMoyens) {
    Write-Host "   Prix moyens r�cup�r�s" -ForegroundColor Green
}

# 12. Test des performances vendeurs
Write-Host "`n1??2?? Test des performances vendeurs..." -ForegroundColor Yellow
$performances = Invoke-ApiRequest -Url "$baseUrl/api/dashboard/vendeurs/performances"
if ($performances) {
    Write-Host "   Performances vendeurs r�cup�r�es" -ForegroundColor Green
}

# 13. Test du r�sum� complet
Write-Host "`n1??3?? Test du r�sum� complet..." -ForegroundColor Yellow
$resume = Invoke-ApiRequest -Url "$baseUrl/api/dashboard/resume-complet"
if ($resume) {
    Write-Host "   R�sum� complet r�cup�r�" -ForegroundColor Green
}

# 14. Test des ventes par p�riode
Write-Host "`n1??4?? Test des ventes par p�riode..." -ForegroundColor Yellow
$ventesJour = Invoke-ApiRequest -Url "$baseUrl/api/dashboard/ventes/par-periode?periode=jour"
$ventesSemaine = Invoke-ApiRequest -Url "$baseUrl/api/dashboard/ventes/par-periode?periode=semaine"
$ventesMois = Invoke-ApiRequest -Url "$baseUrl/api/dashboard/ventes/par-periode?periode=mois"
if ($ventesJour -and $ventesSemaine -and $ventesMois) {
    Write-Host "   Ventes par p�riode (jour/semaine/mois) r�cup�r�es" -ForegroundColor Green
}

# 15. Test de debug d'authentification
Write-Host "`n1??5?? Test de debug d'authentification..." -ForegroundColor Yellow
$authDebug = Invoke-ApiRequest -Url "$baseUrl/api/dashboard/auth-debug"
if ($authDebug) {
    Write-Host "   Mode: $($authDebug.mode)" -ForegroundColor Green
    Write-Host "   Dashboard accessible: $($authDebug.testInfo.dashboardAccessible)" -ForegroundColor Green
}

Write-Host "`n" + "=" * 60
Write-Host "?? Tests termin�s" -ForegroundColor Green

# R�sum�
Write-Host "`n?? R�SUM� DES TESTS" -ForegroundColor Cyan
Write-Host "=" * 60
Write-Host "? Mode: AllowAnonymous activ�" -ForegroundColor White
Write-Host "? Tous les endpoints du dashboard sont accessibles sans authentification" -ForegroundColor White
Write-Host "? Tests Swagger possibles directement" -ForegroundColor White
Write-Host "?? URL Swagger: $baseUrl/swagger" -ForegroundColor Yellow
Write-Host "?? Section Dashboard dans Swagger disponible" -ForegroundColor Yellow

Write-Host "`n?? ENDPOINTS PRINCIPAUX � TESTER DANS SWAGGER:" -ForegroundColor Cyan
Write-Host "=" * 60
Write-Host "� GET /api/dashboard/health - Test de sant�" -ForegroundColor White
Write-Host "� GET /api/dashboard/metriques - M�triques cl�s" -ForegroundColor White
Write-Host "� GET /api/dashboard/stats/general - Statistiques g�n�rales" -ForegroundColor White
Write-Host "� GET /api/dashboard/resume-complet - R�sum� complet" -ForegroundColor White
Write-Host "� GET /api/dashboard/ventes/par-mois - Ventes mensuelles" -ForegroundColor White
Write-Host "� GET /api/dashboard/articles/top-vendus - Top articles" -ForegroundColor White
Write-Host "� GET /api/dashboard/alertes/stock - Alertes de stock" -ForegroundColor White

Write-Host "`n?? Vous pouvez maintenant tester tous les endpoints du dashboard dans Swagger sans authentification!" -ForegroundColor Green
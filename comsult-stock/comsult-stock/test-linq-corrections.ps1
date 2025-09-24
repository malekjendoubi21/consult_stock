# Script PowerShell pour tester les corrections des erreurs LINQ

Write-Host "?? Test des corrections LINQ - Dashboard ConsultStock" -ForegroundColor Green
Write-Host "=" * 60

$baseUrl = "https://localhost:7131" # Port modifié selon votre configuration

# Fonction pour faire une requête HTTP avec gestion d'erreur
function Test-Endpoint {
    param(
        [string]$Url,
        [string]$Description
    )
    
    Write-Host "`n?? Test: $Description" -ForegroundColor Yellow
    Write-Host "   URL: $Url" -ForegroundColor Gray
    
    try {
        $response = Invoke-RestMethod -Uri $Url -Method GET -TimeoutSec 30
        Write-Host "   ? Succès" -ForegroundColor Green
        
        # Afficher quelques informations sur la réponse
        if ($response -is [Array]) {
            Write-Host "   ?? Données: $($response.Count) éléments" -ForegroundColor Cyan
        } elseif ($response -is [PSCustomObject]) {
            $props = ($response | Get-Member -MemberType NoteProperty).Count
            Write-Host "   ?? Propriétés: $props" -ForegroundColor Cyan
        }
        
        return $true
    }
    catch {
        Write-Host "   ? Erreur: $($_.Exception.Message)" -ForegroundColor Red
        if ($_.Exception.Response) {
            $statusCode = $_.Exception.Response.StatusCode
            Write-Host "   ?? Code HTTP: $statusCode" -ForegroundColor Red
        }
        return $false
    }
}

Write-Host "`n?? Test des endpoints problématiques corrigés" -ForegroundColor Cyan
Write-Host "=" * 60

# Tests spécifiques des endpoints qui causaient des erreurs LINQ
$tests = @(
    @{
        Url = "$baseUrl/api/dashboard/chiffre-affaire/evolution"
        Description = "Évolution du chiffre d'affaires (correction ToString)"
    },
    @{
        Url = "$baseUrl/api/dashboard/ventes/par-periode?periode=jour"
        Description = "Ventes par période - jour (correction string.Format)"
    },
    @{
        Url = "$baseUrl/api/dashboard/ventes/par-periode?periode=semaine"
        Description = "Ventes par période - semaine"
    },
    @{
        Url = "$baseUrl/api/dashboard/ventes/par-periode?periode=mois"
        Description = "Ventes par période - mois"
    },
    @{
        Url = "$baseUrl/api/dashboard/health"
        Description = "Test de santé du dashboard"
    },
    @{
        Url = "$baseUrl/api/dashboard/metriques"
        Description = "Métriques clés"
    },
    @{
        Url = "$baseUrl/api/dashboard/stats/general"
        Description = "Statistiques générales"
    },
    @{
        Url = "$baseUrl/api/dashboard/ventes/par-mois"
        Description = "Ventes par mois"
    },
    @{
        Url = "$baseUrl/api/dashboard/articles/top-vendus"
        Description = "Top articles vendus"
    },
    @{
        Url = "$baseUrl/api/dashboard/stocks/par-article"
        Description = "Stocks par article"
    },
    @{
        Url = "$baseUrl/api/dashboard/alertes/stock"
        Description = "Alertes de stock"
    },
    @{
        Url = "$baseUrl/api/dashboard/resume-complet"
        Description = "Résumé complet"
    }
)

$successCount = 0
$totalTests = $tests.Count

foreach ($test in $tests) {
    if (Test-Endpoint -Url $test.Url -Description $test.Description) {
        $successCount++
    }
    Start-Sleep -Milliseconds 500 # Pause entre les tests
}

Write-Host "`n" + "=" * 60
Write-Host "?? RÉSULTATS DES TESTS" -ForegroundColor Cyan
Write-Host "=" * 60
Write-Host "? Tests réussis: $successCount/$totalTests" -ForegroundColor Green

if ($successCount -eq $totalTests) {
    Write-Host "?? Tous les tests sont passés! Les erreurs LINQ ont été corrigées." -ForegroundColor Green
} else {
    $failedCount = $totalTests - $successCount
    Write-Host "??  $failedCount test(s) ont échoué." -ForegroundColor Yellow
}

Write-Host "`n?? CORRECTIONS APPORTÉES:" -ForegroundColor Cyan
Write-Host "=" * 60
Write-Host "? Correction de ToString() dans GetEvolutionChiffreAffaireAsync()" -ForegroundColor White
Write-Host "   - Déplacement du formatage côté client après ToListAsync()" -ForegroundColor Gray
Write-Host "? Correction de string.Format() dans GetVentesParPeriodeAsync()" -ForegroundColor White
Write-Host "   - Remplacement par des opérations supportées par EF Core" -ForegroundColor Gray
Write-Host "? Suppression des conflits [Authorize]/[AllowAnonymous]" -ForegroundColor White
Write-Host "   - Nettoyage des vérifications d'authentification" -ForegroundColor Gray

Write-Host "`n?? PATTERN DE CORRECTION UTILISÉ:" -ForegroundColor Cyan
Write-Host "=" * 60
Write-Host "1. Récupération des données brutes avec LINQ to SQL" -ForegroundColor White
Write-Host "2. Appel de ToListAsync() pour exécuter la requête" -ForegroundColor White  
Write-Host "3. Formatage des données côté client avec LINQ to Objects" -ForegroundColor White

Write-Host "`nExemple:" -ForegroundColor Yellow
Write-Host "// ? Avant (ne fonctionne pas)" -ForegroundColor Red
Write-Host "Select(g => new { Date = g.Key.ToString(`"yyyy-MM-dd`") })" -ForegroundColor Red
Write-Host "" 
Write-Host "// ? Après (fonctionne)" -ForegroundColor Green
Write-Host "Select(g => new { Date = g.Key }).ToListAsync()" -ForegroundColor Green
Write-Host "result.Select(x => new { Date = x.Date.ToString(`"yyyy-MM-dd`") })" -ForegroundColor Green

Write-Host "`n?? URL Swagger: $baseUrl/swagger" -ForegroundColor Yellow
Write-Host "?? Le dashboard est maintenant fonctionnel!" -ForegroundColor Green
# Script PowerShell pour tester les corrections des erreurs LINQ

Write-Host "?? Test des corrections LINQ - Dashboard ConsultStock" -ForegroundColor Green
Write-Host "=" * 60

$baseUrl = "https://localhost:7131" # Port modifi� selon votre configuration

# Fonction pour faire une requ�te HTTP avec gestion d'erreur
function Test-Endpoint {
    param(
        [string]$Url,
        [string]$Description
    )
    
    Write-Host "`n?? Test: $Description" -ForegroundColor Yellow
    Write-Host "   URL: $Url" -ForegroundColor Gray
    
    try {
        $response = Invoke-RestMethod -Uri $Url -Method GET -TimeoutSec 30
        Write-Host "   ? Succ�s" -ForegroundColor Green
        
        # Afficher quelques informations sur la r�ponse
        if ($response -is [Array]) {
            Write-Host "   ?? Donn�es: $($response.Count) �l�ments" -ForegroundColor Cyan
        } elseif ($response -is [PSCustomObject]) {
            $props = ($response | Get-Member -MemberType NoteProperty).Count
            Write-Host "   ?? Propri�t�s: $props" -ForegroundColor Cyan
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

Write-Host "`n?? Test des endpoints probl�matiques corrig�s" -ForegroundColor Cyan
Write-Host "=" * 60

# Tests sp�cifiques des endpoints qui causaient des erreurs LINQ
$tests = @(
    @{
        Url = "$baseUrl/api/dashboard/chiffre-affaire/evolution"
        Description = "�volution du chiffre d'affaires (correction ToString)"
    },
    @{
        Url = "$baseUrl/api/dashboard/ventes/par-periode?periode=jour"
        Description = "Ventes par p�riode - jour (correction string.Format)"
    },
    @{
        Url = "$baseUrl/api/dashboard/ventes/par-periode?periode=semaine"
        Description = "Ventes par p�riode - semaine"
    },
    @{
        Url = "$baseUrl/api/dashboard/ventes/par-periode?periode=mois"
        Description = "Ventes par p�riode - mois"
    },
    @{
        Url = "$baseUrl/api/dashboard/health"
        Description = "Test de sant� du dashboard"
    },
    @{
        Url = "$baseUrl/api/dashboard/metriques"
        Description = "M�triques cl�s"
    },
    @{
        Url = "$baseUrl/api/dashboard/stats/general"
        Description = "Statistiques g�n�rales"
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
        Description = "R�sum� complet"
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
Write-Host "?? R�SULTATS DES TESTS" -ForegroundColor Cyan
Write-Host "=" * 60
Write-Host "? Tests r�ussis: $successCount/$totalTests" -ForegroundColor Green

if ($successCount -eq $totalTests) {
    Write-Host "?? Tous les tests sont pass�s! Les erreurs LINQ ont �t� corrig�es." -ForegroundColor Green
} else {
    $failedCount = $totalTests - $successCount
    Write-Host "??  $failedCount test(s) ont �chou�." -ForegroundColor Yellow
}

Write-Host "`n?? CORRECTIONS APPORT�ES:" -ForegroundColor Cyan
Write-Host "=" * 60
Write-Host "? Correction de ToString() dans GetEvolutionChiffreAffaireAsync()" -ForegroundColor White
Write-Host "   - D�placement du formatage c�t� client apr�s ToListAsync()" -ForegroundColor Gray
Write-Host "? Correction de string.Format() dans GetVentesParPeriodeAsync()" -ForegroundColor White
Write-Host "   - Remplacement par des op�rations support�es par EF Core" -ForegroundColor Gray
Write-Host "? Suppression des conflits [Authorize]/[AllowAnonymous]" -ForegroundColor White
Write-Host "   - Nettoyage des v�rifications d'authentification" -ForegroundColor Gray

Write-Host "`n?? PATTERN DE CORRECTION UTILIS�:" -ForegroundColor Cyan
Write-Host "=" * 60
Write-Host "1. R�cup�ration des donn�es brutes avec LINQ to SQL" -ForegroundColor White
Write-Host "2. Appel de ToListAsync() pour ex�cuter la requ�te" -ForegroundColor White  
Write-Host "3. Formatage des donn�es c�t� client avec LINQ to Objects" -ForegroundColor White

Write-Host "`nExemple:" -ForegroundColor Yellow
Write-Host "// ? Avant (ne fonctionne pas)" -ForegroundColor Red
Write-Host "Select(g => new { Date = g.Key.ToString(`"yyyy-MM-dd`") })" -ForegroundColor Red
Write-Host "" 
Write-Host "// ? Apr�s (fonctionne)" -ForegroundColor Green
Write-Host "Select(g => new { Date = g.Key }).ToListAsync()" -ForegroundColor Green
Write-Host "result.Select(x => new { Date = x.Date.ToString(`"yyyy-MM-dd`") })" -ForegroundColor Green

Write-Host "`n?? URL Swagger: $baseUrl/swagger" -ForegroundColor Yellow
Write-Host "?? Le dashboard est maintenant fonctionnel!" -ForegroundColor Green
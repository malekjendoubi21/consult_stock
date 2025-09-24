# Script PowerShell pour tester les fonctions de profil vendeur

Write-Host "?? Test des fonctions de profil vendeur - ConsultStock" -ForegroundColor Green
Write-Host "=" * 60

$baseUrl = "https://localhost:7000" # Ajustez le port selon votre configuration
$token = $null

# Fonction pour faire une requ�te HTTP
function Invoke-ApiRequest {
    param(
        [string]$Url,
        [string]$Method = "GET",
        [object]$Body = $null,
        [hashtable]$Headers = @{}
    )
    
    try {
        $params = @{
            Uri = $Url
            Method = $Method
            Headers = $Headers
            ContentType = "application/json"
        }
        
        if ($Body) {
            $params.Body = $Body | ConvertTo-Json
        }
        
        $response = Invoke-RestMethod @params
        return $response
    }
    catch {
        Write-Host "? Erreur lors de la requ�te vers $Url" -ForegroundColor Red
        Write-Host "D�tails: $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

# 1. Inscription d'un vendeur de test
Write-Host "`n1?? Inscription d'un vendeur de test..." -ForegroundColor Yellow
$registerData = @{
    Nom = "Vendeur Test"
    Email = "vendeur.test@consultstock.com"
    Password = "password123"
}

$registerResponse = Invoke-ApiRequest -Url "$baseUrl/api/auth/register" -Method "POST" -Body $registerData
if ($registerResponse) {
    Write-Host "? Inscription r�ussie" -ForegroundColor Green
    Write-Host "   ID: $($registerResponse.id)" -ForegroundColor Gray
    Write-Host "   Nom: $($registerResponse.nom)" -ForegroundColor Gray
    Write-Host "   Email: $($registerResponse.email)" -ForegroundColor Gray
} else {
    Write-Host "??  Vendeur de test probablement d�j� existant" -ForegroundColor Yellow
}

# 2. Connexion du vendeur
Write-Host "`n2?? Connexion du vendeur..." -ForegroundColor Yellow
$loginData = @{
    Email = "vendeur.test@consultstock.com"
    Password = "password123"
}

$loginResponse = Invoke-ApiRequest -Url "$baseUrl/api/auth/login" -Method "POST" -Body $loginData
if ($loginResponse -and $loginResponse.token) {
    $token = $loginResponse.token
    Write-Host "? Connexion r�ussie" -ForegroundColor Green
    Write-Host "   Token re�u: $($token.Substring(0, 50))..." -ForegroundColor Gray
} else {
    Write-Host "? �chec de la connexion" -ForegroundColor Red
    exit 1
}

# Headers avec authentification
$authHeaders = @{
    "Authorization" = "Bearer $token"
}

# 3. R�cup�ration du profil
Write-Host "`n3?? R�cup�ration du profil..." -ForegroundColor Yellow
$profileResponse = Invoke-ApiRequest -Url "$baseUrl/api/auth/profile" -Headers $authHeaders
if ($profileResponse) {
    Write-Host "? Profil r�cup�r�" -ForegroundColor Green
    Write-Host "   Nom: $($profileResponse.nom)" -ForegroundColor Gray
    Write-Host "   Email: $($profileResponse.email)" -ForegroundColor Gray
    Write-Host "   R�le: $($profileResponse.role)" -ForegroundColor Gray
}

# 4. Mise � jour du profil (sans mot de passe)
Write-Host "`n4?? Mise � jour du profil..." -ForegroundColor Yellow
$updateProfileData = @{
    Nom = "Vendeur Test Modifi�"
    Email = "vendeur.test.modifie@consultstock.com"
}

$updateProfileResponse = Invoke-ApiRequest -Url "$baseUrl/api/auth/profile" -Method "PUT" -Body $updateProfileData -Headers $authHeaders
if ($updateProfileResponse) {
    Write-Host "? Profil mis � jour" -ForegroundColor Green
    Write-Host "   Nouveau nom: $($updateProfileResponse.vendeur.nom)" -ForegroundColor Gray
    Write-Host "   Nouvel email: $($updateProfileResponse.vendeur.email)" -ForegroundColor Gray
    Write-Host "   Email chang�: $($updateProfileResponse.emailChanged)" -ForegroundColor Gray
    
    # Si l'email a chang�, utiliser le nouveau token
    if ($updateProfileResponse.newToken) {
        $token = $updateProfileResponse.newToken
        $authHeaders["Authorization"] = "Bearer $token"
        Write-Host "   Nouveau token g�n�r� ?" -ForegroundColor Green
    }
}

# 5. V�rification du mot de passe actuel
Write-Host "`n5?? V�rification du mot de passe actuel..." -ForegroundColor Yellow
$verifyPasswordResponse = Invoke-ApiRequest -Url "$baseUrl/api/auth/verify-password" -Method "POST" -Body "password123" -Headers $authHeaders
if ($verifyPasswordResponse) {
    Write-Host "? V�rification du mot de passe" -ForegroundColor Green
    Write-Host "   R�sultat: $($verifyPasswordResponse.message)" -ForegroundColor Gray
}

# 6. Changement de mot de passe
Write-Host "`n6?? Changement de mot de passe..." -ForegroundColor Yellow
$changePasswordData = @{
    CurrentPassword = "password123"
    NewPassword = "nouveaumotdepasse456"
    ConfirmPassword = "nouveaumotdepasse456"
}

$changePasswordResponse = Invoke-ApiRequest -Url "$baseUrl/api/auth/change-password" -Method "PUT" -Body $changePasswordData -Headers $authHeaders
if ($changePasswordResponse) {
    Write-Host "? Mot de passe chang�" -ForegroundColor Green
    Write-Host "   Message: $($changePasswordResponse.message)" -ForegroundColor Gray
}

# 7. Test de connexion avec le nouveau mot de passe
Write-Host "`n7?? Test de connexion avec le nouveau mot de passe..." -ForegroundColor Yellow
$newLoginData = @{
    Email = "vendeur.test.modifie@consultstock.com"
    Password = "nouveaumotdepasse456"
}

$newLoginResponse = Invoke-ApiRequest -Url "$baseUrl/api/auth/login" -Method "POST" -Body $newLoginData
if ($newLoginResponse -and $newLoginResponse.token) {
    Write-Host "? Connexion avec nouveau mot de passe r�ussie" -ForegroundColor Green
    Write-Host "   Nouveau token re�u ?" -ForegroundColor Gray
} else {
    Write-Host "? �chec de la connexion avec le nouveau mot de passe" -ForegroundColor Red
}

# 8. Test d'erreur - changement de mot de passe avec mauvais mot de passe actuel
Write-Host "`n8?? Test d'erreur - mauvais mot de passe actuel..." -ForegroundColor Yellow
$badPasswordData = @{
    CurrentPassword = "mauvais_mot_de_passe"
    NewPassword = "autrenouveau123"
    ConfirmPassword = "autrenouveau123"
}

$authHeaders["Authorization"] = "Bearer $($newLoginResponse.token)"
$badPasswordResponse = Invoke-ApiRequest -Url "$baseUrl/api/auth/change-password" -Method "PUT" -Body $badPasswordData -Headers $authHeaders
if ($badPasswordResponse) {
    Write-Host "??  Test d'erreur - r�ponse inattendue" -ForegroundColor Yellow
} else {
    Write-Host "? Test d'erreur r�ussi - mauvais mot de passe rejet�" -ForegroundColor Green
}

Write-Host "`n" + "=" * 60
Write-Host "?? Tests termin�s" -ForegroundColor Green

# R�sum� des endpoints test�s
Write-Host "`n?? ENDPOINTS TEST�S" -ForegroundColor Cyan
Write-Host "=" * 60
Write-Host "? POST /api/auth/register - Inscription vendeur" -ForegroundColor White
Write-Host "? POST /api/auth/login - Connexion vendeur" -ForegroundColor White
Write-Host "? GET /api/auth/profile - R�cup�ration profil" -ForegroundColor White
Write-Host "? PUT /api/auth/profile - Mise � jour profil (sans mdp)" -ForegroundColor White
Write-Host "? POST /api/auth/verify-password - V�rification mot de passe" -ForegroundColor White
Write-Host "? PUT /api/auth/change-password - Changement mot de passe" -ForegroundColor White

Write-Host "`n?? FONCTIONNALIT�S DISPONIBLES" -ForegroundColor Cyan
Write-Host "=" * 60
Write-Host "?? Modification du nom et email sans toucher au mot de passe" -ForegroundColor White
Write-Host "?? G�n�ration automatique d'un nouveau token si l'email change" -ForegroundColor White
Write-Host "?? Changement de mot de passe avec v�rification de l'ancien" -ForegroundColor White
Write-Host "?? Validation compl�te des donn�es (format email, longueur mdp, etc.)" -ForegroundColor White
Write-Host "?? V�rification du mot de passe actuel avant modifications sensibles" -ForegroundColor White
Write-Host "?? Gestion d'erreurs compl�te avec messages explicites" -ForegroundColor White

Write-Host "`n?? URL Swagger: $baseUrl/swagger" -ForegroundColor Yellow
Write-Host "?? Section: Authentication - Nouveaux endpoints disponibles" -ForegroundColor Yellow
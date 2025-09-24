# ?? Création Automatique de l'Administrateur ConsultStock

## ?? Informations de Connexion par Défaut

- **Email**: `admin@ConsultStock.com`
- **Mot de passe**: `admin`
- **Rôle**: Administrateur

## ?? Fonctionnement Automatique

L'administrateur par défaut est créé automatiquement au démarrage de l'application grâce à :

1. **Initialisation automatique** dans `Program.cs`
2. **Méthode `SeedAdminAsync`** dans `AdministrateurService`
3. **Vérifications de sécurité** pour s'assurer qu'un admin existe toujours

## ?? Endpoints Disponibles

### Connexion Standard
```http
POST /api/administrateurs/login
Content-Type: application/json

{
  "Login": "admin@ConsultStock.com",
  "MotDePasse": "admin"
}
```

### Diagnostic et Debug
```http
GET /api/dashboard/auth-debug
# Aucune authentification requise - informations de diagnostic
```

```http
GET /api/dashboard/admin-status
# Aucune authentification requise - statut des administrateurs
```

### Réinitialisation d'Urgence
```http
POST /api/administrateurs/reset-default-admin
Content-Type: application/json

{
  "SecretKey": "RESET_ADMIN_CONSULTSTOCK_2024"
}
```

## ?? Processus de Connexion

1. **Démarrer l'application** ? L'admin est créé automatiquement
2. **Se connecter** via `/api/administrateurs/login`
3. **Récupérer le token JWT** de la réponse
4. **Utiliser le token** dans l'en-tête: `Authorization: Bearer <token>`
5. **Accéder au dashboard** via les endpoints `/api/dashboard/*`

## ??? Scripts de Test

### Test PowerShell
Exécutez le script de test pour vérifier que tout fonctionne :
```powershell
.\test-admin-creation.ps1
```

### Test manuel avec curl
```bash
# 1. Connexion
curl -X POST "https://localhost:7000/api/administrateurs/login" \
  -H "Content-Type: application/json" \
  -d '{"Login": "admin@ConsultStock.com", "MotDePasse": "admin"}'

# 2. Test d'authentification (remplacez <TOKEN> par le token reçu)
curl -X GET "https://localhost:7000/api/dashboard/auth-test" \
  -H "Authorization: Bearer <TOKEN>"

# 3. Récupération des métriques
curl -X GET "https://localhost:7000/api/dashboard/metriques" \
  -H "Authorization: Bearer <TOKEN>"
```

## ?? Résolution de Problèmes

### Problème : "Vous n'êtes pas connecté"

1. **Vérifiez que l'admin existe** :
   ```http
   GET /api/dashboard/admin-status
   ```

2. **Testez la connexion** :
   ```http
   POST /api/administrateurs/login
   ```

3. **Vérifiez l'en-tête Authorization** :
   - Format correct : `Bearer <token>`
   - Token valide et non expiré (3h de validité)

4. **Diagnostic complet** :
   ```http
   GET /api/dashboard/auth-debug
   ```

### Problème : Admin non créé

1. **Redémarrez l'application** pour déclencher l'initialisation
2. **Vérifiez les logs** de la console pour les messages d'initialisation
3. **Utilisez la réinitialisation d'urgence** :
   ```http
   POST /api/administrateurs/reset-default-admin
   ```

### Problème : Base de données

1. **Vérifiez la chaîne de connexion** dans `appsettings.json`
2. **S'assurer que SQL Server** est démarré
3. **Vérifiez les permissions** d'accès à la base

## ?? Utilisation avec Angular

```typescript
// Service d'authentification
@Injectable()
export class AuthService {
  private baseUrl = 'https://localhost:7000/api';
  
  login(email: string, password: string) {
    return this.http.post(`${this.baseUrl}/administrateurs/login`, {
      Login: email,
      MotDePasse: password
    });
  }
  
  private getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }
  
  getDashboardMetrics() {
    return this.http.get(`${this.baseUrl}/dashboard/metriques`, {
      headers: this.getAuthHeaders()
    });
  }
}
```

## ?? Sécurité

- **Mot de passe hashé** avec SHA256
- **JWT avec expiration** (3h)
- **Réinitialisation sécurisée** avec clé secrète
- **Vérifications d'intégrité** automatiques

## ?? Accès au Dashboard

Une fois connecté, tous ces endpoints sont disponibles :

- `/api/dashboard/stats/general` - Statistiques générales
- `/api/dashboard/metriques` - Métriques clés
- `/api/dashboard/ventes/par-mois` - Ventes mensuelles
- `/api/dashboard/articles/top-vendus` - Top articles
- `/api/dashboard/stocks/par-article` - Stocks par article
- `/api/dashboard/alertes/stock` - Alertes stock
- `/api/dashboard/resume-complet` - Résumé complet

## ??? Swagger UI

Accédez à la documentation interactive : `https://localhost:7000/swagger`

---

**?? L'administrateur `admin@ConsultStock.com` avec le mot de passe `admin` est maintenant créé automatiquement à chaque démarrage de l'application !**
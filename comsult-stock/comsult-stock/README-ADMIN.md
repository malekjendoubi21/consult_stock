# ?? Cr�ation Automatique de l'Administrateur ConsultStock

## ?? Informations de Connexion par D�faut

- **Email**: `admin@ConsultStock.com`
- **Mot de passe**: `admin`
- **R�le**: Administrateur

## ?? Fonctionnement Automatique

L'administrateur par d�faut est cr�� automatiquement au d�marrage de l'application gr�ce � :

1. **Initialisation automatique** dans `Program.cs`
2. **M�thode `SeedAdminAsync`** dans `AdministrateurService`
3. **V�rifications de s�curit�** pour s'assurer qu'un admin existe toujours

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

### R�initialisation d'Urgence
```http
POST /api/administrateurs/reset-default-admin
Content-Type: application/json

{
  "SecretKey": "RESET_ADMIN_CONSULTSTOCK_2024"
}
```

## ?? Processus de Connexion

1. **D�marrer l'application** ? L'admin est cr�� automatiquement
2. **Se connecter** via `/api/administrateurs/login`
3. **R�cup�rer le token JWT** de la r�ponse
4. **Utiliser le token** dans l'en-t�te: `Authorization: Bearer <token>`
5. **Acc�der au dashboard** via les endpoints `/api/dashboard/*`

## ??? Scripts de Test

### Test PowerShell
Ex�cutez le script de test pour v�rifier que tout fonctionne :
```powershell
.\test-admin-creation.ps1
```

### Test manuel avec curl
```bash
# 1. Connexion
curl -X POST "https://localhost:7000/api/administrateurs/login" \
  -H "Content-Type: application/json" \
  -d '{"Login": "admin@ConsultStock.com", "MotDePasse": "admin"}'

# 2. Test d'authentification (remplacez <TOKEN> par le token re�u)
curl -X GET "https://localhost:7000/api/dashboard/auth-test" \
  -H "Authorization: Bearer <TOKEN>"

# 3. R�cup�ration des m�triques
curl -X GET "https://localhost:7000/api/dashboard/metriques" \
  -H "Authorization: Bearer <TOKEN>"
```

## ?? R�solution de Probl�mes

### Probl�me : "Vous n'�tes pas connect�"

1. **V�rifiez que l'admin existe** :
   ```http
   GET /api/dashboard/admin-status
   ```

2. **Testez la connexion** :
   ```http
   POST /api/administrateurs/login
   ```

3. **V�rifiez l'en-t�te Authorization** :
   - Format correct : `Bearer <token>`
   - Token valide et non expir� (3h de validit�)

4. **Diagnostic complet** :
   ```http
   GET /api/dashboard/auth-debug
   ```

### Probl�me : Admin non cr��

1. **Red�marrez l'application** pour d�clencher l'initialisation
2. **V�rifiez les logs** de la console pour les messages d'initialisation
3. **Utilisez la r�initialisation d'urgence** :
   ```http
   POST /api/administrateurs/reset-default-admin
   ```

### Probl�me : Base de donn�es

1. **V�rifiez la cha�ne de connexion** dans `appsettings.json`
2. **S'assurer que SQL Server** est d�marr�
3. **V�rifiez les permissions** d'acc�s � la base

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

## ?? S�curit�

- **Mot de passe hash�** avec SHA256
- **JWT avec expiration** (3h)
- **R�initialisation s�curis�e** avec cl� secr�te
- **V�rifications d'int�grit�** automatiques

## ?? Acc�s au Dashboard

Une fois connect�, tous ces endpoints sont disponibles :

- `/api/dashboard/stats/general` - Statistiques g�n�rales
- `/api/dashboard/metriques` - M�triques cl�s
- `/api/dashboard/ventes/par-mois` - Ventes mensuelles
- `/api/dashboard/articles/top-vendus` - Top articles
- `/api/dashboard/stocks/par-article` - Stocks par article
- `/api/dashboard/alertes/stock` - Alertes stock
- `/api/dashboard/resume-complet` - R�sum� complet

## ??? Swagger UI

Acc�dez � la documentation interactive : `https://localhost:7000/swagger`

---

**?? L'administrateur `admin@ConsultStock.com` avec le mot de passe `admin` est maintenant cr�� automatiquement � chaque d�marrage de l'application !**
# ?? Gestion de Profil Vendeur - ConsultStock

## ? Nouvelles Fonctionnalit�s Ajout�es

### **1. Modification du Profil (sans mot de passe)**
- ? Modification du nom et email
- ? Validation automatique des donn�es
- ? G�n�ration d'un nouveau token si l'email change
- ? V�rification d'unicit� de l'email

### **2. Changement de Mot de Passe**
- ? V�rification du mot de passe actuel
- ? Validation du nouveau mot de passe
- ? Confirmation du nouveau mot de passe
- ? S�curit� renforc�e

### **3. V�rification de Mot de Passe**
- ? Endpoint pour v�rifier le mot de passe actuel
- ? Utile pour les interfaces utilisateur

## ?? Nouveaux Endpoints

### **PUT /api/auth/profile**
Modifie le profil du vendeur (nom et email uniquement)

**Requ�te :**
```http
PUT /api/auth/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "nom": "Nouveau Nom",
  "email": "nouvel.email@example.com"
}
```

**R�ponse Succ�s :**
```json
{
  "message": "Profil mis � jour avec succ�s",
  "vendeur": {
    "id": 1,
    "nom": "Nouveau Nom",
    "email": "nouvel.email@example.com",
    "role": "Vendeur"
  },
  "newToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...", // Si email chang�
  "emailChanged": true
}
```

**Validation :**
- ? Nom requis et non vide
- ? Email requis et format valide
- ? Email unique dans le syst�me

### **PUT /api/auth/change-password**
Change le mot de passe du vendeur

**Requ�te :**
```http
PUT /api/auth/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "ancien_mot_de_passe",
  "newPassword": "nouveau_mot_de_passe",
  "confirmPassword": "nouveau_mot_de_passe"
}
```

**R�ponse Succ�s :**
```json
{
  "message": "Mot de passe modifi� avec succ�s"
}
```

**Validation :**
- ? Mot de passe actuel correct
- ? Nouveau mot de passe ? 6 caract�res
- ? Confirmation identique au nouveau mot de passe

### **POST /api/auth/verify-password**
V�rifie si un mot de passe est correct

**Requ�te :**
```http
POST /api/auth/verify-password
Authorization: Bearer <token>
Content-Type: application/json

"mot_de_passe_a_verifier"
```

**R�ponse :**
```json
{
  "isValid": true,
  "message": "Mot de passe correct"
}
```

## ??? DTOs Cr��s

### **UpdateProfileVendeurDto**
```csharp
public class UpdateProfileVendeurDto
{
    public string Nom { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    
    public List<string> Valider() // Validation automatique
}
```

### **ChangePasswordVendeurDto**
```csharp
public class ChangePasswordVendeurDto
{
    public string CurrentPassword { get; set; } = string.Empty;
    public string NewPassword { get; set; } = string.Empty;
    public string ConfirmPassword { get; set; } = string.Empty;
    
    public List<string> Valider() // Validation automatique
}
```

## ?? M�thodes Service Ajout�es

### **VendeurService**
```csharp
// Mise � jour du profil
public async Task<Vendeur?> UpdateProfileAsync(string currentEmail, string newNom, string newEmail)

// Changement de mot de passe
public async Task<bool> ChangePasswordAsync(string email, string currentPassword, string newPassword)

// V�rification de mot de passe
public async Task<bool> VerifyPasswordAsync(string email, string password)
```

## ?? S�curit� et Validations

### **Validation du Profil**
- ? **Nom** : Requis, non vide
- ? **Email** : Requis, format valide, unique

### **Validation du Mot de Passe**
- ? **Mot de passe actuel** : Requis, v�rifi� en base
- ? **Nouveau mot de passe** : Requis, minimum 6 caract�res
- ? **Confirmation** : Requise, identique au nouveau

### **S�curit�**
- ? **Token JWT requis** pour tous les endpoints
- ? **V�rification d'identit�** via token
- ? **Hachage des mots de passe** (SHA256)
- ? **G�n�ration nouveau token** si email chang�

## ?? Tests avec Swagger

### **1. Connexion**
```http
POST /api/auth/login
{
  "email": "vendeur@example.com",
  "password": "password123"
}
```

### **2. R�cup�ration du Profil**
```http
GET /api/auth/profile
Authorization: Bearer <token_de_connexion>
```

### **3. Modification du Profil**
```http
PUT /api/auth/profile
Authorization: Bearer <token>
{
  "nom": "Nouveau Nom",
  "email": "nouveau@example.com"
}
```

### **4. Changement de Mot de Passe**
```http
PUT /api/auth/change-password
Authorization: Bearer <token>
{
  "currentPassword": "password123",
  "newPassword": "nouveaumotdepasse456",
  "confirmPassword": "nouveaumotdepasse456"
}
```

### **5. V�rification de Mot de Passe**
```http
POST /api/auth/verify-password
Authorization: Bearer <token>
"password_a_verifier"
```

## ?? Exemples Frontend Angular

### **Service TypeScript**
```typescript
@Injectable()
export class AuthService {
  private baseUrl = '/api/auth';
  
  updateProfile(profileData: any) {
    return this.http.put(`${this.baseUrl}/profile`, profileData, {
      headers: this.getAuthHeaders()
    });
  }
  
  changePassword(passwordData: any) {
    return this.http.put(`${this.baseUrl}/change-password`, passwordData, {
      headers: this.getAuthHeaders()
    });
  }
  
  verifyPassword(password: string) {
    return this.http.post(`${this.baseUrl}/verify-password`, password, {
      headers: this.getAuthHeaders()
    });
  }
  
  private getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }
}
```

### **Composant Profil**
```typescript
export class ProfileComponent {
  profileForm = this.fb.group({
    nom: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]]
  });
  
  passwordForm = this.fb.group({
    currentPassword: ['', Validators.required],
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required]
  }, { validators: this.passwordMatchValidator });
  
  async updateProfile() {
    if (this.profileForm.valid) {
      try {
        const result = await this.authService.updateProfile(this.profileForm.value).toPromise();
        
        // Si l'email a chang�, mettre � jour le token
        if (result.emailChanged && result.newToken) {
          localStorage.setItem('authToken', result.newToken);
        }
        
        this.showSuccess('Profil mis � jour avec succ�s');
      } catch (error) {
        this.showError('Erreur lors de la mise � jour');
      }
    }
  }
  
  async changePassword() {
    if (this.passwordForm.valid) {
      try {
        await this.authService.changePassword(this.passwordForm.value).toPromise();
        this.showSuccess('Mot de passe modifi� avec succ�s');
        this.passwordForm.reset();
      } catch (error) {
        this.showError('Erreur lors du changement de mot de passe');
      }
    }
  }
  
  private passwordMatchValidator(form: AbstractControl) {
    const newPassword = form.get('newPassword');
    const confirmPassword = form.get('confirmPassword');
    
    if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
      confirmPassword.setErrors({ mismatch: true });
    }
    return null;
  }
}
```

## ?? Cas d'Usage

### **1. Modification du Nom**
- Vendeur change son nom d'affichage
- Email reste identique
- Pas de nouveau token g�n�r�

### **2. Modification de l'Email**
- Vendeur change son email de connexion
- Nouveau token g�n�r� automatiquement
- Frontend doit mettre � jour le token stock�

### **3. Changement de Mot de Passe**
- Vendeur change son mot de passe pour la s�curit�
- V�rification de l'ancien mot de passe obligatoire
- Confirmation du nouveau mot de passe requise

### **4. V�rification de S�curit�**
- Avant une action sensible, v�rifier le mot de passe
- Confirmation d'identit� sans changer de donn�es

## ?? Script de Test Automatis�

```powershell
# Ex�cuter le script de test complet
.\test-auth-profile.ps1
```

Ce script teste automatiquement :
- ? Inscription et connexion
- ? R�cup�ration du profil
- ? Modification du profil
- ? V�rification de mot de passe
- ? Changement de mot de passe
- ? Tests d'erreur

## ?? R�sum� des Am�liorations

### **Avant**
- ? Pas de modification de profil
- ? Pas de changement de mot de passe
- ? Profil en lecture seule

### **Apr�s** 
- ? Modification compl�te du profil (nom/email)
- ? Changement s�curis� du mot de passe
- ? V�rification de mot de passe
- ? Gestion automatique des tokens
- ? Validation compl�te des donn�es
- ? S�curit� renforc�e

**?? Les vendeurs peuvent maintenant g�rer leur profil de mani�re autonome et s�curis�e !**
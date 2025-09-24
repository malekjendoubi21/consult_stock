# ?? VenteArticleDto avec Calcul Automatique des Prix

## ?? Fonctionnalités Ajoutées

### ? **Calcul Automatique des Prix**
- **PrixUnitaire** : Récupéré automatiquement du lot ou spécifié manuellement
- **PrixTotal** : Calculé automatiquement (PrixUnitaire × Quantité)
- **Validation** : Vérifications automatiques des données
- **Gestion des stocks** : Mise à jour automatique des quantités disponibles

## ?? Nouveaux DTOs

### 1. **VenteArticleDto** (Création)
```csharp
{
  "societeId": 1,
  "codeArticle": "ART001",
  "numLot": "LOT001",
  "quantite": 5,
  "imprimerTicket": true,
  "dateVente": "2024-01-15T10:00:00",
  "prixUnitaireFourni": 15.50  // Optionnel - sinon prix du lot
}
```

### 2. **VenteCreatedResponseDto** (Réponse)
```csharp
{
  "id": 123,
  "societeId": 1,
  "societeNom": "Société ABC",
  "article": "Produit XYZ",
  "lot": "LOT001",
  "qteVendu": 5,
  "date": "2024-01-15T10:00:00",
  "prixUnitaire": 15.50,      // Calculé automatiquement
  "prixTotal": 77.50,         // Calculé automatiquement
  "ticketImprime": true,
  "tickets": [
    {
      "id": 1,
      "codeBarre": "ART001-LOT001-20240115100000-1",
      "dateCreation": "2024-01-15T10:00:00",
      "isImprime": false,
      "venteId": 123,
      "article": "Produit XYZ",
      "societe": "Société ABC"
    }
  ]
}
```

## ?? Nouveaux Endpoints

### **POST /api/ventes/avec-calcul**
Création d'une vente avec calcul automatique des prix
```http
POST /api/ventes/avec-calcul
Content-Type: application/json
Authorization: Bearer <token>

{
  "societeId": 1,
  "codeArticle": "ART001",
  "numLot": "LOT001",
  "quantite": 3,
  "imprimerTicket": true
}
```

### **POST /api/ventes/vente-rapide**
Endpoint optimisé pour les vendeurs (sans authentification)
```http
POST /api/ventes/vente-rapide
Content-Type: application/json

{
  "societeId": 1,
  "codeArticle": "ART001", 
  "numLot": "LOT001",
  "quantite": 2,
  "imprimerTicket": true
}
```

### **POST /api/ventes/valider**
Validation et simulation avant création
```http
POST /api/ventes/valider
Content-Type: application/json

{
  "societeId": 1,
  "codeArticle": "ART001",
  "numLot": "LOT001",
  "quantite": 1
}
```

### **PUT /api/ventes/{id}/avec-calcul**
Mise à jour avec recalcul automatique
```http
PUT /api/ventes/123/avec-calcul
Content-Type: application/json
Authorization: Bearer <token>

{
  "societeId": 1,
  "codeArticle": "ART001",
  "numLot": "LOT001",
  "quantite": 4,
  "prixUnitaireFourni": 16.00
}
```

## ?? Avantages du Nouveau Système

### **Automatisation Complète**
- ? Prix récupérés automatiquement depuis les lots
- ? Calcul automatique du prix total
- ? Mise à jour automatique des stocks
- ? Génération automatique des tickets
- ? Validation automatique des données

### **Gestion des Erreurs Améliorée**
- ? Vérification de l'existence des articles/lots
- ? Contrôle de la disponibilité en stock
- ? Validation des quantités
- ? Messages d'erreur détaillés

### **Fonctionnalités Avancées**
- ? Possibilité de surcharger le prix unitaire
- ? Support des tickets avec codes-barres uniques
- ? Traçabilité complète des ventes
- ? Simulation/validation avant création

## ?? Exemples d'Utilisation

### **Frontend Angular**
```typescript
// Service de vente
@Injectable()
export class VenteService {
  constructor(private http: HttpClient) {}

  // Vente rapide pour les vendeurs
  venteRapide(vente: VenteArticleDto) {
    return this.http.post<VenteCreatedResponseDto>(
      '/api/ventes/vente-rapide', 
      vente
    );
  }

  // Validation avant vente
  validerVente(vente: VenteArticleDto) {
    return this.http.post('/api/ventes/valider', vente);
  }

  // Création avec authentification admin
  creerVenteAvecCalcul(vente: VenteArticleDto) {
    return this.http.post<VenteCreatedResponseDto>(
      '/api/ventes/avec-calcul', 
      vente,
      { headers: this.getAuthHeaders() }
    );
  }
}

// Composant de vente
export class VenteComponent {
  async effectuerVente() {
    const vente: VenteArticleDto = {
      societeId: this.selectedSociete,
      codeArticle: this.selectedArticle,
      numLot: this.selectedLot,
      quantite: this.quantite,
      imprimerTicket: true
    };

    try {
      // 1. Valider d'abord
      const validation = await this.venteService.validerVente(vente).toPromise();
      console.log('Prix calculé:', validation.simulation.prixTotal);

      // 2. Créer la vente
      const result = await this.venteService.venteRapide(vente).toPromise();
      console.log('Vente créée:', result);
      
      // 3. Afficher les tickets générés
      result.tickets.forEach(ticket => {
        console.log('Ticket:', ticket.codeBarre);
      });

    } catch (error) {
      console.error('Erreur:', error);
    }
  }
}
```

### **Test avec curl**
```bash
# 1. Validation
curl -X POST "https://localhost:7000/api/ventes/valider" \
  -H "Content-Type: application/json" \
  -d '{
    "societeId": 1,
    "codeArticle": "ART001",
    "numLot": "LOT001",
    "quantite": 2,
    "imprimerTicket": true
  }'

# 2. Vente rapide
curl -X POST "https://localhost:7000/api/ventes/vente-rapide" \
  -H "Content-Type: application/json" \
  -d '{
    "societeId": 1,
    "codeArticle": "ART001",
    "numLot": "LOT001",
    "quantite": 2,
    "imprimerTicket": true
  }'
```

## ?? Processus de Calcul Automatique

1. **Validation des données d'entrée**
   - Vérification des IDs et codes
   - Contrôle des quantités positives

2. **Récupération des informations**
   - Article par code
   - Lot par numéro et article
   - Société par ID

3. **Vérification de disponibilité**
   - Stock suffisant dans le lot
   - Lot non expiré

4. **Calcul automatique**
   - Prix unitaire du lot (ou fourni)
   - Prix total = Prix unitaire × Quantité

5. **Mise à jour des données**
   - Création de la vente
   - Réduction du stock du lot
   - Génération des tickets

6. **Réponse enrichie**
   - Vente créée avec prix calculés
   - Tickets générés
   - Informations de traçabilité

## ?? Résultat Final

Avec ces améliorations, vous avez maintenant :

- ? **Calcul automatique** des prix unitaires et totaux
- ? **Validation complète** des données
- ? **Gestion automatique** des stocks
- ? **Génération automatique** des tickets
- ? **API simplifiée** pour les vendeurs
- ? **Traçabilité complète** des opérations

Le système calcule automatiquement `PrixUnitaire` et `PrixTotal` en récupérant les informations depuis les lots, tout en permettant une surcharge manuelle si nécessaire ! ??
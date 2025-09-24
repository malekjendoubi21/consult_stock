# ?? VenteArticleDto avec Calcul Automatique des Prix

## ?? Fonctionnalit�s Ajout�es

### ? **Calcul Automatique des Prix**
- **PrixUnitaire** : R�cup�r� automatiquement du lot ou sp�cifi� manuellement
- **PrixTotal** : Calcul� automatiquement (PrixUnitaire � Quantit�)
- **Validation** : V�rifications automatiques des donn�es
- **Gestion des stocks** : Mise � jour automatique des quantit�s disponibles

## ?? Nouveaux DTOs

### 1. **VenteArticleDto** (Cr�ation)
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

### 2. **VenteCreatedResponseDto** (R�ponse)
```csharp
{
  "id": 123,
  "societeId": 1,
  "societeNom": "Soci�t� ABC",
  "article": "Produit XYZ",
  "lot": "LOT001",
  "qteVendu": 5,
  "date": "2024-01-15T10:00:00",
  "prixUnitaire": 15.50,      // Calcul� automatiquement
  "prixTotal": 77.50,         // Calcul� automatiquement
  "ticketImprime": true,
  "tickets": [
    {
      "id": 1,
      "codeBarre": "ART001-LOT001-20240115100000-1",
      "dateCreation": "2024-01-15T10:00:00",
      "isImprime": false,
      "venteId": 123,
      "article": "Produit XYZ",
      "societe": "Soci�t� ABC"
    }
  ]
}
```

## ?? Nouveaux Endpoints

### **POST /api/ventes/avec-calcul**
Cr�ation d'une vente avec calcul automatique des prix
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
Endpoint optimis� pour les vendeurs (sans authentification)
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
Validation et simulation avant cr�ation
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
Mise � jour avec recalcul automatique
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

## ?? Avantages du Nouveau Syst�me

### **Automatisation Compl�te**
- ? Prix r�cup�r�s automatiquement depuis les lots
- ? Calcul automatique du prix total
- ? Mise � jour automatique des stocks
- ? G�n�ration automatique des tickets
- ? Validation automatique des donn�es

### **Gestion des Erreurs Am�lior�e**
- ? V�rification de l'existence des articles/lots
- ? Contr�le de la disponibilit� en stock
- ? Validation des quantit�s
- ? Messages d'erreur d�taill�s

### **Fonctionnalit�s Avanc�es**
- ? Possibilit� de surcharger le prix unitaire
- ? Support des tickets avec codes-barres uniques
- ? Tra�abilit� compl�te des ventes
- ? Simulation/validation avant cr�ation

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

  // Cr�ation avec authentification admin
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
      console.log('Prix calcul�:', validation.simulation.prixTotal);

      // 2. Cr�er la vente
      const result = await this.venteService.venteRapide(vente).toPromise();
      console.log('Vente cr��e:', result);
      
      // 3. Afficher les tickets g�n�r�s
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

1. **Validation des donn�es d'entr�e**
   - V�rification des IDs et codes
   - Contr�le des quantit�s positives

2. **R�cup�ration des informations**
   - Article par code
   - Lot par num�ro et article
   - Soci�t� par ID

3. **V�rification de disponibilit�**
   - Stock suffisant dans le lot
   - Lot non expir�

4. **Calcul automatique**
   - Prix unitaire du lot (ou fourni)
   - Prix total = Prix unitaire � Quantit�

5. **Mise � jour des donn�es**
   - Cr�ation de la vente
   - R�duction du stock du lot
   - G�n�ration des tickets

6. **R�ponse enrichie**
   - Vente cr��e avec prix calcul�s
   - Tickets g�n�r�s
   - Informations de tra�abilit�

## ?? R�sultat Final

Avec ces am�liorations, vous avez maintenant :

- ? **Calcul automatique** des prix unitaires et totaux
- ? **Validation compl�te** des donn�es
- ? **Gestion automatique** des stocks
- ? **G�n�ration automatique** des tickets
- ? **API simplifi�e** pour les vendeurs
- ? **Tra�abilit� compl�te** des op�rations

Le syst�me calcule automatiquement `PrixUnitaire` et `PrixTotal` en r�cup�rant les informations depuis les lots, tout en permettant une surcharge manuelle si n�cessaire ! ??
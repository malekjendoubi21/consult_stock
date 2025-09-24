namespace comsult_stock.DTOs
{
    /// <summary>
    /// DTO pour la création d'une vente avec calcul automatique des prix
    /// </summary>
    public class VenteArticleDto
    {
        // Identifiants obligatoires
        public int SocieteId { get; set; }
        public string CodeArticle { get; set; } = string.Empty;
        public string NumLot { get; set; } = string.Empty;
        public int Quantite { get; set; }
        
        // Options
        public bool ImprimerTicket { get; set; } = true;
        public DateTime? DateVente { get; set; } // Si null, utilise DateTime.Now
        
        // Prix unitaire (optionnel - sera récupéré du lot si non fourni)
        public double? PrixUnitaireFourni { get; set; }
        
        // Propriétés calculées en lecture seule (pour les réponses)
        public double PrixUnitaire { get; private set; }
        public double PrixTotal { get; private set; }
        
        // Informations de l'article et du lot (pour les réponses)
        public string NomArticle { get; private set; } = string.Empty;
        public string NomSociete { get; private set; } = string.Empty;
        public DateTime? DateExpiration { get; private set; }
        public int QuantiteDisponible { get; private set; }
        
        /// <summary>
        /// Calcule automatiquement les prix basés sur les données du lot
        /// </summary>
        /// <param name="prixUnitaireLot">Prix unitaire du lot</param>
        /// <param name="quantite">Quantité vendue</param>
        public void CalculerPrix(double prixUnitaireLot, int quantite)
        {
            // Utiliser le prix fourni ou celui du lot
            PrixUnitaire = PrixUnitaireFourni ?? prixUnitaireLot;
            
            // Calculer le prix total
            PrixTotal = PrixUnitaire * quantite;
        }
        
        /// <summary>
        /// Met à jour les informations complémentaires
        /// </summary>
        public void SetInformationsComplementaires(
            string nomArticle, 
            string nomSociete, 
            DateTime? dateExpiration, 
            int quantiteDisponible)
        {
            NomArticle = nomArticle;
            NomSociete = nomSociete;
            DateExpiration = dateExpiration;
            QuantiteDisponible = quantiteDisponible;
        }
        
        /// <summary>
        /// Valide les données de base
        /// </summary>
        /// <returns>Liste des erreurs de validation</returns>
        public List<string> Valider()
        {
            var erreurs = new List<string>();
            
            if (SocieteId <= 0)
                erreurs.Add("L'ID de la société est requis et doit être positif.");
                
            if (string.IsNullOrWhiteSpace(CodeArticle))
                erreurs.Add("Le code article est requis.");
                
            if (string.IsNullOrWhiteSpace(NumLot))
                erreurs.Add("Le numéro de lot est requis.");
                
            if (Quantite <= 0)
                erreurs.Add("La quantité doit être supérieure à zéro.");
                
            if (PrixUnitaireFourni.HasValue && PrixUnitaireFourni.Value < 0)
                erreurs.Add("Le prix unitaire ne peut pas être négatif.");
                
            return erreurs;
        }
    }
    
    /// <summary>
    /// DTO de réponse pour une vente créée
    /// </summary>
    public class VenteCreatedResponseDto
    {
        public int Id { get; set; }
        public int SocieteId { get; set; }
        public string SocieteNom { get; set; } = string.Empty;
        public string Article { get; set; } = string.Empty;
        public string Lot { get; set; } = string.Empty;
        public int QteVendu { get; set; }
        public DateTime Date { get; set; }
        public double PrixUnitaire { get; set; }
        public double PrixTotal { get; set; }
        public bool TicketImprime { get; set; }
        public List<TicketDto> Tickets { get; set; } = new List<TicketDto>();
    }
    
    /// <summary>
    /// DTO pour la mise à jour d'une vente avec recalcul automatique
    /// </summary>
    public class UpdateVenteArticleDto
    {
        public int SocieteId { get; set; }
        public string CodeArticle { get; set; } = string.Empty;
        public string NumLot { get; set; } = string.Empty;
        public int Quantite { get; set; }
        public double? PrixUnitaireFourni { get; set; }
        public DateTime? DateVente { get; set; }
        
        // Propriétés calculées
        public double PrixUnitaire { get; private set; }
        public double PrixTotal { get; private set; }
        
        /// <summary>
        /// Calcule automatiquement les prix
        /// </summary>
        public void CalculerPrix(double prixUnitaireLot, int quantite)
        {
            PrixUnitaire = PrixUnitaireFourni ?? prixUnitaireLot;
            PrixTotal = PrixUnitaire * quantite;
        }
        
        /// <summary>
        /// Valide les données de mise à jour
        /// </summary>
        public List<string> Valider()
        {
            var erreurs = new List<string>();
            
            if (SocieteId <= 0)
                erreurs.Add("L'ID de la société est requis et doit être positif.");
                
            if (string.IsNullOrWhiteSpace(CodeArticle))
                erreurs.Add("Le code article est requis.");
                
            if (string.IsNullOrWhiteSpace(NumLot))
                erreurs.Add("Le numéro de lot est requis.");
                
            if (Quantite <= 0)
                erreurs.Add("La quantité doit être supérieure à zéro.");
                
            if (PrixUnitaireFourni.HasValue && PrixUnitaireFourni.Value < 0)
                erreurs.Add("Le prix unitaire ne peut pas être négatif.");
                
            return erreurs;
        }
    }
}

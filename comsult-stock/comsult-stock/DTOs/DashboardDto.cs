namespace comsult_stock.DTOs
{
    /// <summary>
    /// Statistiques générales de l'application
    /// </summary>
    public class GeneralStatsDto
    {
        public int TotalArticles { get; set; }
        public int TotalLots { get; set; }
        public int TotalStock { get; set; }
        public int TotalVentes { get; set; }
        public int TotalSocietes { get; set; }
        public int TotalVendeurs { get; set; }
        public double ChiffreAffaireMensuel { get; set; }
    }

    /// <summary>
    /// Statistiques des ventes par mois
    /// </summary>
    public class VenteParMoisDto
    {
        public string Mois { get; set; } = string.Empty;
        public int Annee { get; set; }
        public int MoisNum { get; set; }
        public int NombreVentes { get; set; }
        public int QuantiteVendue { get; set; }
        public double ChiffreAffaire { get; set; }
    }

    /// <summary>
    /// Top des articles les plus vendus
    /// </summary>
    public class TopArticleDto
    {
        public string Article { get; set; } = string.Empty;
        public int QuantiteVendue { get; set; }
        public int NombreVentes { get; set; }
        public double ChiffreAffaire { get; set; }
    }

    /// <summary>
    /// Statistiques des stocks par article
    /// </summary>
    public class StockParArticleDto
    {
        public string Article { get; set; } = string.Empty;
        public int QuantiteStock { get; set; }
        public int NombreLots { get; set; }
        public double ValeurStock { get; set; }
    }

    /// <summary>
    /// Informations sur les lots proches de l'expiration
    /// </summary>
    public class LotExpirationDto
    {
        public int Id { get; set; }
        public string NumLot { get; set; } = string.Empty;
        public string ArticleNom { get; set; } = string.Empty;
        public int QuantiteDisponible { get; set; }
        public DateTime? DateExpiration { get; set; }
        public int JoursRestants { get; set; }
    }

    /// <summary>
    /// Évolution du chiffre d'affaires
    /// </summary>
    public class EvolutionCADto
    {
        public string Date { get; set; } = string.Empty;
        public double ChiffreAffaire { get; set; }
        public int NombreVentes { get; set; }
    }

    /// <summary>
    /// Répartition des ventes par société
    /// </summary>
    public class VenteParSocieteDto
    {
        public string Societe { get; set; } = string.Empty;
        public int NombreVentes { get; set; }
        public int QuantiteVendue { get; set; }
        public double ChiffreAffaire { get; set; }
        public double PourcentageCA { get; set; }
    }

    /// <summary>
    /// Alertes de stock
    /// </summary>
    public class AlertStockDto
    {
        public string ArticleNom { get; set; } = string.Empty;
        public string LotNum { get; set; } = string.Empty;
        public int QuantiteActuelle { get; set; }
        public string Statut { get; set; } = string.Empty;
        public string SocieteNom { get; set; } = string.Empty;
        public DateTime? DateExpiration { get; set; }
    }

    /// <summary>
    /// Prix moyens par article
    /// </summary>
    public class PrixMoyenDto
    {
        public string Article { get; set; } = string.Empty;
        public double PrixMoyen { get; set; }
        public double PrixMin { get; set; }
        public double PrixMax { get; set; }
        public int NombreLots { get; set; }
    }

    /// <summary>
    /// Métriques clés pour le dashboard
    /// </summary>
    public class MetriquesClésDto
    {
        public int VentesAujourdhui { get; set; }
        public double CAaujourdhui { get; set; }
        public int VentesMoisActuel { get; set; }
        public double CAMoisActuel { get; set; }
        public double EvolutionVentesMois { get; set; }
        public double EvolutionCAMois { get; set; }
        public int AlertesStockCritique { get; set; }
        public int LotsProchesExpiration { get; set; }
    }

    /// <summary>
    /// Données des ventes par période
    /// </summary>
    public class VenteParPeriodeDto
    {
        public string Periode { get; set; } = string.Empty;
        public int NombreVentes { get; set; }
        public int QuantiteVendue { get; set; }
        public double ChiffreAffaire { get; set; }
    }

    /// <summary>
    /// Performances des vendeurs
    /// </summary>
    public class PerformanceVendeurDto
    {
        public int Id { get; set; }
        public string Nom { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public int NombreVentes { get; set; }
        public double ChiffreAffaire { get; set; }
        public DateTime DateCreation { get; set; }
    }

    /// <summary>
    /// Résumé complet du dashboard
    /// </summary>
    public class ResumeCompletDto
    {
        public object Metriques { get; set; }
        public object VentesParMois { get; set; }
        public object TopArticles { get; set; }
        public object Alertes { get; set; }
    }
}
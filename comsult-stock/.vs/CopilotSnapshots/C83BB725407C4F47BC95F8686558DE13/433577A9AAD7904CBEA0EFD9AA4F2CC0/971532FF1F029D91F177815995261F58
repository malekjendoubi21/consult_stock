namespace comsult_stock.Models
{
    public class Vente
    {
        public int Id { get; set; }
        public string Article { get; set; } = string.Empty;
        public string Lot { get; set; } = string.Empty;
        public int QteVendu { get; set; }
        public DateTime Date { get; set; } = DateTime.Now;
        public double PrixUnitaire { get; set; }
        public double PrixTotal { get; set; }

        // Relations
        public int SocieteId { get; set; }
        public Societe Societe { get; set; }
        
        // Relations directes pour faciliter les opérations
        public int? ArticleId { get; set; }
        public Article? ArticleEntity { get; set; }
        
        public int? LotId { get; set; }
        public Lot? LotEntity { get; set; }
        
        public ICollection<Ticket> Tickets { get; set; } = new List<Ticket>();
    }
}

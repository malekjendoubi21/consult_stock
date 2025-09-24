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
        
        public ICollection<Ticket> Tickets { get; set; } = new List<Ticket>();
    }
}

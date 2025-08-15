namespace comsult_stock.Models
{
    public class Ticket
    {
        public int Id { get; set; }
        public string CodeBarre { get; set; } = string.Empty;
        public DateTime DateCreation { get; set; } = DateTime.Now;
        public bool IsImprime { get; set; } = false;
        public DateTime? DateImpression { get; set; }
        
        // Relations
        public int VenteId { get; set; }
        public Vente Vente { get; set; }
    }
}

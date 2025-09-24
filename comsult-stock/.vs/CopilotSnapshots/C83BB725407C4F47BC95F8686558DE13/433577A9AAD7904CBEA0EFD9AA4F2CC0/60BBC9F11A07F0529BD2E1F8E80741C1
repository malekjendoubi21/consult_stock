namespace comsult_stock.Models
{
    public class Lot
    {
        public int Id { get; set; }
        public string NumLot { get; set; } = string.Empty;
        public int QuantiteDisponible { get; set; }
        public DateTime? DateExpiration { get; set; }
        public double PrixUnitaire { get; set; }

        // Relations
        public int ArticleId { get; set; }
        public Article Article { get; set; }
        
        // Relations avec Stock
        public ICollection<Stock> Stocks { get; set; } = new List<Stock>();
    }
}

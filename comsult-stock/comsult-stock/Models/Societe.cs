namespace comsult_stock.Models
{
    public class Societe
    {
        public int Id { get; set; }
        public string Nom { get; set; } = string.Empty;
        public string Adresse { get; set; } = string.Empty;

        // Relations
        public ICollection<Stock> Stocks { get; set; } = new List<Stock>();
        public ICollection<Vente> Ventes { get; set; } = new List<Vente>();
    }
}

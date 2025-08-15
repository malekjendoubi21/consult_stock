namespace comsult_stock.Models
{
    public class Article
    {
        public int Id { get; set; }
        public string Nom { get; set; } = string.Empty;
        public string CodeArticle { get; set; } = string.Empty;
        public double PrixTTC { get; set; }
        public double PrixHT { get; set; }

        // Relations
        public ICollection<Lot> Lots { get; set; } = new List<Lot>();
    }
}

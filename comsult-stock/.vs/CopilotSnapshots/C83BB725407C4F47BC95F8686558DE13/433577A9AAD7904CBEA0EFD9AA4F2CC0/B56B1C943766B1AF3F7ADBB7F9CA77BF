namespace comsult_stock.Models
{
    public class Stock
    {
        public int Id { get; set; }
        public int SocieteId { get; set; }
        public string CodeBarre { get; set; } = string.Empty;
        public string NumLot { get; set; } = string.Empty;
        public int QteDispo { get; set; }
        public double PrixTTC { get; set; }
        public DateTime? DateExpiration { get; set; }

        // Relations
        public Societe Societe { get; set; }
    }
}

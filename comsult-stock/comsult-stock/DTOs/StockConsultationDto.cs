namespace comsult_stock.DTOs
{
    public class StockConsultationDto
    {
        public int Id { get; set; }
        public string CodeBarre { get; set; } = string.Empty;
        public string NumLot { get; set; } = string.Empty;
        public int QteDispo { get; set; }
        public double PrixTTC { get; set; }
        public string SocieteNom { get; set; } = string.Empty;
        public DateTime? DateExpiration { get; set; }
    }
}

namespace comsult_stock.DTOs
{
    public class CreateStockDto
    {
        public int SocieteId { get; set; }
        public int ArticleId { get; set; }
        public int LotId { get; set; }
        public string CodeBarre { get; set; } = string.Empty;
        public string NumLot { get; set; } = string.Empty;
        public int QteDispo { get; set; }
        // PrixTTC sera calculé automatiquement
    }
}

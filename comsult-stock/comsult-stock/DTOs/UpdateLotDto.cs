namespace comsult_stock.DTOs
{
    public class UpdateLotDto
    {
        public int ArticleId { get; set; }
        public string NumLot { get; set; } = string.Empty;
        public int QuantiteDisponible { get; set; }
        public DateTime? DateExpiration { get; set; }
        public double PrixUnitaire { get; set; }
    }
}

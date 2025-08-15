namespace comsult_stock.DTOs
{
    public class UpdateLotDto
    {
        public int ArticleId { get; set; }
        public int QuantiteDisponible { get; set; }
        public string ArticleCode { get; set; } = string.Empty;
    }
}

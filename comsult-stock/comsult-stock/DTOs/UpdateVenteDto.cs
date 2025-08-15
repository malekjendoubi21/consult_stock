namespace comsult_stock.DTOs
{
    public class UpdateVenteDto
    {
        public int SocieteId { get; set; }
        public string Article { get; set; } = string.Empty;
        public string Lot { get; set; } = string.Empty;
        public int QteVendu { get; set; }
        public DateTime Date { get; set; }
    }
}

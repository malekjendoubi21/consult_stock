namespace comsult_stock.DTOs
{
    public class VenteArticleDto
    {
        public int SocieteId { get; set; }
        public string CodeArticle { get; set; } = string.Empty;
        public string NumLot { get; set; } = string.Empty;
        public int Quantite { get; set; }
        public bool ImprimerTicket { get; set; } = true;
    }
}

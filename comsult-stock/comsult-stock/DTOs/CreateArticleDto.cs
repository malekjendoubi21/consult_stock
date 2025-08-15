namespace comsult_stock.DTOs
{
    public class CreateArticleDto
    {
        public string Nom { get; set; } = string.Empty;
        public string CodeArticle { get; set; } = string.Empty;
        public double PrixTTC { get; set; }
        public double PrixHT { get; set; }
    }
}

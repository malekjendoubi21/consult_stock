namespace comsult_stock.DTOs
{
    public class UpdateVendeurDto
    {
        public string Nom { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Password { get; set; } // Optionnel pour la mise à jour
    }
}

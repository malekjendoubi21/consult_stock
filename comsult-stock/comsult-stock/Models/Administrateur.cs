namespace comsult_stock.Models
{
    public class Administrateur : User
    {
        public string Nom { get; set; } = string.Empty;
        public string Login { get; set; } = string.Empty;
        public string MotDePasse { get; set; } = string.Empty;
    }
}

namespace comsult_stock.DTOs
{
    public class TicketDto
    {
        public int Id { get; set; }
        public string CodeBarre { get; set; } = string.Empty;
        public DateTime DateCreation { get; set; }
        public int VenteId { get; set; }
        public string Article { get; set; } = string.Empty;
        public string Societe { get; set; } = string.Empty;
    }
}

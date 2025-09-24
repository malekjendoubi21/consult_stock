using comsult_stock.Models;
using consult_stock.Data;
using Microsoft.EntityFrameworkCore;

namespace consult_stock.Services
{
    public class TicketService
    {
        private readonly AppDbContext _context;

        public TicketService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Ticket> CreateTicketAsync(string codeBarre, int venteId)
        {
            var ticket = new Ticket
            {
                CodeBarre = codeBarre,
                VenteId = venteId,
                DateCreation = DateTime.Now
            };

            _context.Tickets.Add(ticket);
            await _context.SaveChangesAsync();
            return ticket;
        }

        public async Task<Ticket?> GetByCodeBarreAsync(string codeBarre)
        {
            return await _context.Tickets
                .Include(t => t.Vente)
                .ThenInclude(v => v.Societe)
                .FirstOrDefaultAsync(t => t.CodeBarre == codeBarre);
        }

        public async Task<IEnumerable<Ticket>> GetAllAsync()
        {
            return await _context.Tickets
                .Include(t => t.Vente)
                .ThenInclude(v => v.Societe)
                .ToListAsync();
        }

        public async Task<Ticket?> GetByIdAsync(int id)
        {
            return await _context.Tickets
                .Include(t => t.Vente)
                .ThenInclude(v => v.Societe)
                .FirstOrDefaultAsync(t => t.Id == id);
        }

        public string GenerateBarcode()
        {
            // Générer un code-barres unique basé sur timestamp + random
            var timestamp = DateTimeOffset.Now.ToUnixTimeSeconds();
            var random = new Random().Next(1000, 9999);
            return $"{timestamp}{random}";
        }

        public async Task<byte[]> GenerateTicketPdfAsync(int ticketId)
        {
            var ticket = await GetByIdAsync(ticketId);
            if (ticket == null)
                throw new ArgumentException("Ticket introuvable.");

            // Ici vous pouvez implémenter la génération PDF
            // Pour l'instant, retourner un tableau de bytes vide
            // Dans une vraie implémentation, utilisez une librairie comme iTextSharp
            return new byte[0];
        }
    }
}

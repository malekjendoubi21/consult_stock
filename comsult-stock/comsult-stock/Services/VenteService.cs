using comsult_stock.Models;
using consult_stock.Data;
using Microsoft.EntityFrameworkCore;

namespace consult_stock.Services
{
    public class VenteService
    {
        private readonly AppDbContext _context;

        public VenteService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Vente>> GetAllAsync()
        {
            return await _context.Ventes
                .Include(v => v.Societe)
                .ToListAsync();
        }

        public async Task<Vente?> GetByIdAsync(int id)
        {
            return await _context.Ventes
                .Include(v => v.Societe)
                .FirstOrDefaultAsync(v => v.Id == id);
        }

        public async Task<IEnumerable<Vente>> GetBySocieteIdAsync(int societeId)
        {
            return await _context.Ventes
                .Include(v => v.Societe)
                .Where(v => v.SocieteId == societeId)
                .ToListAsync();
        }

        public async Task<Vente> CreateAsync(Vente vente)
        {
            // Verify that Societe exists
            var societeExists = await _context.Societes.AnyAsync(s => s.Id == vente.SocieteId);
            if (!societeExists)
                throw new ArgumentException("Société introuvable.");

            _context.Ventes.Add(vente);
            await _context.SaveChangesAsync();
            return vente;
        }

        public async Task<Vente?> UpdateAsync(int id, Vente vente)
        {
            var existing = await _context.Ventes.FindAsync(id);
            if (existing == null) return null;

            // Verify that Societe exists if changing SocieteId
            if (existing.SocieteId != vente.SocieteId)
            {
                var societeExists = await _context.Societes.AnyAsync(s => s.Id == vente.SocieteId);
                if (!societeExists)
                    throw new ArgumentException("Société introuvable.");
            }

            existing.SocieteId = vente.SocieteId;
            existing.Article = vente.Article;
            existing.Lot = vente.Lot;
            existing.QteVendu = vente.QteVendu;
            existing.Date = vente.Date;

            await _context.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var vente = await _context.Ventes.FindAsync(id);
            if (vente == null) return false;

            _context.Ventes.Remove(vente);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}

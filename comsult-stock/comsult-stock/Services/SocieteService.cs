using comsult_stock.Models;
using consult_stock.Data;
using Microsoft.EntityFrameworkCore;

namespace consult_stock.Services
{
    public class SocieteService
    {
        private readonly AppDbContext _context;

        public SocieteService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Societe>> GetAllAsync()
        {
            return await _context.Societes
                .Include(s => s.Stocks)
                .Include(s => s.Ventes)
                .ToListAsync();
        }

        public async Task<Societe?> GetByIdAsync(int id)
        {
            return await _context.Societes
                .Include(s => s.Stocks)
                .Include(s => s.Ventes)
                .FirstOrDefaultAsync(s => s.Id == id);
        }

        public async Task<Societe> CreateAsync(Societe societe)
        {
            _context.Societes.Add(societe);
            await _context.SaveChangesAsync();
            return societe;
        }

        public async Task<Societe?> UpdateAsync(int id, Societe societe)
        {
            var existing = await _context.Societes.FindAsync(id);
            if (existing == null) return null;

            existing.Nom = societe.Nom;
            existing.Adresse = societe.Adresse;

            await _context.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var societe = await _context.Societes.FindAsync(id);
            if (societe == null) return false;

            _context.Societes.Remove(societe);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}

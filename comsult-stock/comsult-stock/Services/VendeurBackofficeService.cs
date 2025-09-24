using comsult_stock.Models;
using consult_stock.Data;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace consult_stock.Services
{
    public class VendeurBackofficeService
    {
        private readonly AppDbContext _context;

        public VendeurBackofficeService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Vendeur>> GetAllAsync()
        {
            return await _context.Vendeurs.ToListAsync();
        }

        public async Task<Vendeur?> GetByIdAsync(int id)
        {
            return await _context.Vendeurs.FindAsync(id);
        }

        public async Task<Vendeur?> GetByEmailAsync(string email)
        {
            return await _context.Vendeurs.FirstOrDefaultAsync(v => v.Email == email);
        }

        public async Task<IEnumerable<Vendeur>> SearchAsync(string searchTerm)
        {
            if (string.IsNullOrWhiteSpace(searchTerm))
                return await GetAllAsync();

            return await _context.Vendeurs
                .Where(v => v.Nom.Contains(searchTerm) || v.Email.Contains(searchTerm))
                .ToListAsync();
        }

        public async Task<Vendeur> CreateAsync(Vendeur vendeur)
        {
            // Vérifier si l'email existe déjà
            if (await _context.Vendeurs.AnyAsync(v => v.Email == vendeur.Email))
                throw new ArgumentException("Email déjà utilisé.");

            // Hasher le mot de passe
            if (!string.IsNullOrEmpty(vendeur.PasswordHash))
                vendeur.PasswordHash = HashPassword(vendeur.PasswordHash);

            vendeur.Role = "Vendeur"; // Forcer le rôle
            
            _context.Vendeurs.Add(vendeur);
            await _context.SaveChangesAsync();
            return vendeur;
        }

        public async Task<Vendeur?> UpdateAsync(int id, Vendeur vendeur)
        {
            var existing = await _context.Vendeurs.FindAsync(id);
            if (existing == null) return null;

            // Vérifier si le nouvel email existe déjà (sauf pour le vendeur actuel)
            if (existing.Email != vendeur.Email && 
                await _context.Vendeurs.AnyAsync(v => v.Email == vendeur.Email && v.Id != id))
                throw new ArgumentException("Email déjà utilisé.");

            existing.Nom = vendeur.Nom;
            existing.Email = vendeur.Email;

            // Mettre à jour le mot de passe seulement s'il est fourni
            if (!string.IsNullOrEmpty(vendeur.PasswordHash))
                existing.PasswordHash = HashPassword(vendeur.PasswordHash);

            await _context.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var vendeur = await _context.Vendeurs.FindAsync(id);
            if (vendeur == null) return false;

            _context.Vendeurs.Remove(vendeur);
            await _context.SaveChangesAsync();
            return true;
        }

        private string HashPassword(string password)
        {
            using var sha = SHA256.Create();
            var bytes = sha.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(bytes);
        }
    }
}

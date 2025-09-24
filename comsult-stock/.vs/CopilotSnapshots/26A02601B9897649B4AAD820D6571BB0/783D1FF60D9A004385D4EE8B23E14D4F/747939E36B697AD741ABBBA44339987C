using comsult_stock.Models;
using consult_stock.Data;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace consult_stock.Services
{
    public class AdministrateurService
    {
        private readonly AppDbContext _context;

        public AdministrateurService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Administrateur> RegisterAsync(string nom, string login, string motDePasse)
        {
            if (await _context.Administrateurs.AnyAsync(a => a.Login == login))
                throw new Exception("Login déjà utilisé.");

            var passwordHash = HashPassword(motDePasse);

            var admin = new Administrateur
            {
                Nom = nom,
                Login = login,
                MotDePasse = passwordHash
            };

            _context.Administrateurs.Add(admin);
            await _context.SaveChangesAsync();
            return admin;
        }

        public async Task<Administrateur> LoginAsync(string login, string motDePasse)
        {
            var admin = await _context.Administrateurs.FirstOrDefaultAsync(a => a.Login == login);
            if (admin == null || admin.MotDePasse != HashPassword(motDePasse))
                throw new Exception("Login ou mot de passe incorrect.");
            return admin;
        }

        public async Task<Administrateur?> GetByLoginAsync(string login)
        {
            return await _context.Administrateurs.FirstOrDefaultAsync(a => a.Login == login);
        }

        public async Task<IEnumerable<Administrateur>> GetAllAsync()
        {
            return await _context.Administrateurs.ToListAsync();
        }

        public async Task<Administrateur?> GetByIdAsync(int id)
        {
            return await _context.Administrateurs.FindAsync(id);
        }

        public async Task<Administrateur?> UpdateAsync(int id, Administrateur admin)
        {
            var existing = await _context.Administrateurs.FindAsync(id);
            if (existing == null) return null;

            existing.Nom = admin.Nom;
            existing.Login = admin.Login;
            if (!string.IsNullOrEmpty(admin.MotDePasse))
                existing.MotDePasse = HashPassword(admin.MotDePasse);

            await _context.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var admin = await _context.Administrateurs.FindAsync(id);
            if (admin == null) return false;

            _context.Administrateurs.Remove(admin);
            await _context.SaveChangesAsync();
            return true;
        }

        private string HashPassword(string password)
        {
            using var sha = SHA256.Create();
            var bytes = sha.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(bytes);
        }
        public static async Task SeedAdminAsync(AppDbContext context)
        {
            // Vérifier si un admin avec l'email spécifique existe déjà
            if (!await context.Administrateurs.AnyAsync(a => a.Login == "admin@ConsultStock.com"))
            {
                using var sha = SHA256.Create();
                var passwordHash = Convert.ToBase64String(
                    sha.ComputeHash(Encoding.UTF8.GetBytes("admin"))
                );

                var admin = new Administrateur
                {
                    Nom = "Administrateur Principal",
                    Login = "admin@ConsultStock.com",
                    MotDePasse = passwordHash
                };

                context.Administrateurs.Add(admin);
                await context.SaveChangesAsync();

                Console.WriteLine("✅ Administrateur par défaut créé:");
                Console.WriteLine($"   Email: admin@ConsultStock.com");
                Console.WriteLine($"   Mot de passe: admin");
                Console.WriteLine($"   Nom: Administrateur Principal");
            }
            else
            {
                Console.WriteLine("ℹ️  Administrateur par défaut déjà existant.");
            }

            // Créer aussi un admin de secours si aucun admin n'existe
            await EnsureAtLeastOneAdminExistsAsync(context);
        }

        /// <summary>
        /// S'assure qu'au moins un administrateur existe dans le système
        /// </summary>
        public static async Task EnsureAtLeastOneAdminExistsAsync(AppDbContext context)
        {
            var adminCount = await context.Administrateurs.CountAsync();
            
            if (adminCount == 0)
            {
                using var sha = SHA256.Create();
                var passwordHash = Convert.ToBase64String(
                    sha.ComputeHash(Encoding.UTF8.GetBytes("admin"))
                );

                var emergencyAdmin = new Administrateur
                {
                    Nom = "Admin Urgence",
                    Login = "admin@ConsultStock.com",
                    MotDePasse = passwordHash
                };

                context.Administrateurs.Add(emergencyAdmin);
                await context.SaveChangesAsync();

                Console.WriteLine("🚨 Administrateur d'urgence créé car aucun admin n'existait!");
                Console.WriteLine($"   Email: admin@ConsultStock.com");
                Console.WriteLine($"   Mot de passe: admin");
            }
        }

        /// <summary>
        /// Méthode pour réinitialiser le mot de passe de l'admin principal
        /// </summary>
        public static async Task ResetDefaultAdminPasswordAsync(AppDbContext context)
        {
            var admin = await context.Administrateurs
                .FirstOrDefaultAsync(a => a.Login == "admin@ConsultStock.com");

            if (admin != null)
            {
                using var sha = SHA256.Create();
                admin.MotDePasse = Convert.ToBase64String(
                    sha.ComputeHash(Encoding.UTF8.GetBytes("admin"))
                );

                await context.SaveChangesAsync();
                Console.WriteLine("🔄 Mot de passe de l'administrateur principal réinitialisé.");
            }
        }
    }
}

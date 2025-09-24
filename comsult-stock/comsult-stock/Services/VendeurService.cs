using comsult_stock.Models;
using comsult_stock.Services;
using consult_stock.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System.Net;
using System.Net.Mail;
using System.Security.Cryptography;
using System.Text;

namespace consult_stock.Services
{
    public class VendeurService
    {
        private readonly AppDbContext _context;



        private static readonly Dictionary<string, string> _resetCodes = new();
        private readonly SmtpSettings _smtpSettings;

        public VendeurService(AppDbContext context, IOptions<SmtpSettings> smtpSettings)
        {
            _context = context;
            _smtpSettings = smtpSettings.Value;
        }





        // --- AUTHENTIFICATION ---
        public async Task<Vendeur> RegisterAsync(string nom, string email, string password)
        {
            if (await _context.Vendeurs.AnyAsync(v => v.Email == email))
                throw new Exception("Email déjà utilisé.");

            var passwordHash = HashPassword(password);

            var vendeur = new Vendeur
            {
                Nom = nom,
                Email = email,
                PasswordHash = passwordHash,
                Role = "Vendeur"
            };

            _context.Vendeurs.Add(vendeur);
            await _context.SaveChangesAsync();
            return vendeur;
        }

        public async Task<Vendeur> LoginAsync(string email, string password)
        {
            var vendeur = await _context.Vendeurs.FirstOrDefaultAsync(v => v.Email == email);
            if (vendeur == null || vendeur.PasswordHash != HashPassword(password))
                throw new Exception("Email ou mot de passe incorrect.");
            return vendeur;
        }

        public async Task<Vendeur?> GetByEmailAsync(string email)
        {
            return await _context.Vendeurs.FirstOrDefaultAsync(v => v.Email == email);
        }

        /// <summary>
        /// Met à jour le profil du vendeur (nom et email uniquement)
        /// </summary>
        public async Task<Vendeur?> UpdateProfileAsync(string currentEmail, string newNom, string newEmail)
        {
            var vendeur = await _context.Vendeurs.FirstOrDefaultAsync(v => v.Email == currentEmail);
            if (vendeur == null) return null;

            // Vérifier si le nouvel email est déjà utilisé (par un autre vendeur)
            if (newEmail != currentEmail)
            {
                var emailExists = await _context.Vendeurs.AnyAsync(v => v.Email == newEmail && v.Id != vendeur.Id);
                if (emailExists)
                    throw new ArgumentException("Cet email est déjà utilisé par un autre vendeur.");
            }

            vendeur.Nom = newNom;
            vendeur.Email = newEmail;

            await _context.SaveChangesAsync();
            return vendeur;
        }

        /// <summary>
        /// Change le mot de passe du vendeur après vérification de l'ancien
        /// </summary>
        public async Task<bool> ChangePasswordAsync(string email, string currentPassword, string newPassword)
        {
            var vendeur = await _context.Vendeurs.FirstOrDefaultAsync(v => v.Email == email);
            if (vendeur == null) return false;

            // Vérifier l'ancien mot de passe
            if (vendeur.PasswordHash != HashPassword(currentPassword))
                throw new ArgumentException("Le mot de passe actuel est incorrect.");

            // Mettre à jour avec le nouveau mot de passe
            vendeur.PasswordHash = HashPassword(newPassword);
            await _context.SaveChangesAsync();
            return true;
        }

        /// <summary>
        /// Vérifie si un mot de passe est correct pour un vendeur
        /// </summary>
        public async Task<bool> VerifyPasswordAsync(string email, string password)
        {
            var vendeur = await _context.Vendeurs.FirstOrDefaultAsync(v => v.Email == email);
            if (vendeur == null) return false;
            return vendeur.PasswordHash == HashPassword(password);
        }

        // --- CRUD OPERATIONS ---
        public async Task<IEnumerable<Vendeur>> GetAllAsync()
        {
            return await _context.Vendeurs.ToListAsync();
        }

        public async Task<Vendeur?> GetByIdAsync(int id)
        {
            return await _context.Vendeurs.FindAsync(id);
        }

        public async Task<Vendeur> CreateAsync(Vendeur vendeur)
        {
            vendeur.PasswordHash = HashPassword(vendeur.PasswordHash);
            _context.Vendeurs.Add(vendeur);
            await _context.SaveChangesAsync();
            return vendeur;
        }

        public async Task<Vendeur?> UpdateAsync(int id, Vendeur vendeur)
        {
            var existing = await _context.Vendeurs.FindAsync(id);
            if (existing == null) return null;

            existing.Nom = vendeur.Nom;
            existing.Email = vendeur.Email;

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

        // --- HASH PASSWORD ---
        private string HashPassword(string password)
        {
            using var sha = SHA256.Create();
            var bytes = sha.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(bytes);
        }
        // Envoie un code de réinitialisation par mail
        public async Task<bool> ForgotPasswordAsync(string email)
        {
            var vendeur = await _context.Vendeurs.FirstOrDefaultAsync(v => v.Email == email);
            if (vendeur == null) return false;

            var ResetCode = new Random().Next(100000, 999999).ToString();
            _resetCodes[email] = ResetCode;

            await SendEmailAsync(email, "Réinitialisation du mot de passe",
                $"Votre code de réinitialisation est : {ResetCode}");

            return true;
        }

        // Vérifie le code et change le mot de passe
        public async Task<bool> ResetPasswordAsync(string email, string ResetCode, string newPassword)
        {

            Console.WriteLine($"Tentative reset: email={email}, ResetCode={ResetCode}");

            if (_resetCodes.ContainsKey(email))
                Console.WriteLine($"Code attendu: {_resetCodes[email]}");
            else
                Console.WriteLine("Aucun code trouvé pour cet email.");


            if (!_resetCodes.ContainsKey(email) || _resetCodes[email] != ResetCode)
                return false;

            var vendeur = await _context.Vendeurs.FirstOrDefaultAsync(v => v.Email == email);
            if (vendeur == null) return false;

            vendeur.PasswordHash = HashPassword(newPassword);
            await _context.SaveChangesAsync();

            _resetCodes.Remove(email);
            return true;
        }

        private async Task SendEmailAsync(string to, string subject, string body)
        {
            // Validation des adresses e-mail
            if (!IsValidEmail(to))
                throw new ArgumentException($"Adresse e-mail destinataire invalide : {to}");

            if (!IsValidEmail(_smtpSettings.From))
                throw new ArgumentException($"Adresse e-mail expéditeur invalide : {_smtpSettings.From}");

            using (var client = new SmtpClient(_smtpSettings.Host, _smtpSettings.Port))
            {
                client.Credentials = new NetworkCredential(_smtpSettings.Username, _smtpSettings.Password);
                client.EnableSsl = _smtpSettings.EnableSsl;

                var mailMessage = new MailMessage(_smtpSettings.From, to, subject, body);

                // Log pour vérifier les adresses avant envoi
                Console.WriteLine($"Envoi d'e-mail de '{_smtpSettings.From}' vers '{to}'");

                await client.SendMailAsync(mailMessage);
            }
        }

        // Méthode utilitaire pour vérifier le format de l'e-mail
        private bool IsValidEmail(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
                return false;

            try
            {
                var addr = new MailAddress(email);
                return addr.Address == email;
            }
            catch
            {
                return false;
            }
        }

    }
}

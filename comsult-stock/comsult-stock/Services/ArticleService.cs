using comsult_stock.Models;
using consult_stock.Data;
using Microsoft.EntityFrameworkCore;

namespace consult_stock.Services
{
    public class ArticleService
    {
        private readonly AppDbContext _context;

        public ArticleService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Article>> GetAllAsync()
        {
            return await _context.Articles
                .Include(a => a.Lots)
                .ToListAsync();
        }

        public async Task<Article?> GetByIdAsync(int id)
        {
            return await _context.Articles
                .Include(a => a.Lots)
                .FirstOrDefaultAsync(a => a.Id == id);
        }

        public async Task<IEnumerable<Article>> GetBySocieteIdAsync(int societeId)
        {
            // Get articles that have stocks in the specified societe
            var articleCodes = await _context.Stocks
                .Where(s => s.SocieteId == societeId)
                .Select(s => s.CodeBarre)
                .Distinct()
                .ToListAsync();

            return await _context.Articles
                .Include(a => a.Lots)
                .Where(a => articleCodes.Contains(a.CodeArticle))
                .ToListAsync();
        }

        public async Task<IEnumerable<Article>> SearchAsync(string searchTerm)
        {
            return await _context.Articles
                .Include(a => a.Lots)
                .Where(a => a.Nom.Contains(searchTerm) || a.CodeArticle.Contains(searchTerm))
                .ToListAsync();
        }

        public async Task<Article?> GetByCodeAsync(string code)
        {
            return await _context.Articles
                .Include(a => a.Lots)
                .FirstOrDefaultAsync(a => a.CodeArticle == code);
        }

        public async Task<Article> CreateAsync(Article article)
        {
            // Vérifier si le code article existe déjà
            var existingCode = await _context.Articles
                .AnyAsync(a => a.CodeArticle == article.CodeArticle);
            if (existingCode)
                throw new ArgumentException("Code article déjà utilisé.");

            _context.Articles.Add(article);
            await _context.SaveChangesAsync();
            return article;
        }

        public async Task<Article?> UpdateAsync(int id, Article article)
        {
            var existing = await _context.Articles.FindAsync(id);
            if (existing == null) return null;

            // Vérifier si le nouveau code article existe déjà (sauf pour l'article actuel)
            var codeExists = await _context.Articles
                .AnyAsync(a => a.CodeArticle == article.CodeArticle && a.Id != id);
            if (codeExists)
                throw new ArgumentException("Code article déjà utilisé.");

            existing.Nom = article.Nom;
            existing.CodeArticle = article.CodeArticle;
            existing.PrixTTC = article.PrixTTC;
            existing.PrixHT = article.PrixHT;

            await _context.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var article = await _context.Articles.FindAsync(id);
            if (article == null) return false;

            _context.Articles.Remove(article);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}

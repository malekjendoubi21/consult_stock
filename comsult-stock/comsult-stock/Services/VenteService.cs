using comsult_stock.Models;
using comsult_stock.DTOs;
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
                .Include(v => v.ArticleEntity)
                .Include(v => v.LotEntity)
                .ToListAsync();
        }

        public async Task<Vente?> GetByIdAsync(int id)
        {
            return await _context.Ventes
                .Include(v => v.Societe)
                .Include(v => v.ArticleEntity)
                .Include(v => v.LotEntity)
                .FirstOrDefaultAsync(v => v.Id == id);
        }

        public async Task<IEnumerable<Vente>> GetBySocieteIdAsync(int societeId)
        {
            return await _context.Ventes
                .Include(v => v.Societe)
                .Include(v => v.ArticleEntity)
                .Include(v => v.LotEntity)
                .Where(v => v.SocieteId == societeId)
                .ToListAsync();
        }

        /// <summary>
        /// Cr�e une vente avec calcul automatique des prix bas� sur VenteArticleDto
        /// </summary>
        public async Task<VenteCreatedResponseDto> CreateVenteAvecCalculAsync(VenteArticleDto dto)
        {
            // 1. Validation du DTO
            var erreurs = dto.Valider();
            if (erreurs.Any())
                throw new ArgumentException($"Erreurs de validation: {string.Join(", ", erreurs)}");

            // 2. V�rifier que la soci�t� existe
            var societe = await _context.Societes.FindAsync(dto.SocieteId);
            if (societe == null)
                throw new ArgumentException("Soci�t� introuvable.");

            // 3. R�cup�rer l'article par son code
            var article = await _context.Articles
                .FirstOrDefaultAsync(a => a.CodeArticle == dto.CodeArticle);
            if (article == null)
                throw new ArgumentException($"Article avec le code '{dto.CodeArticle}' introuvable.");

            // 4. R�cup�rer le lot
            var lot = await _context.Lots
                .Include(l => l.Article)
                .FirstOrDefaultAsync(l => l.NumLot == dto.NumLot && l.ArticleId == article.Id);
            if (lot == null)
                throw new ArgumentException($"Lot '{dto.NumLot}' introuvable pour l'article '{dto.CodeArticle}'.");

            // 5. V�rifier la disponibilit�
            if (lot.QuantiteDisponible < dto.Quantite)
                throw new ArgumentException($"Quantit� insuffisante. Disponible: {lot.QuantiteDisponible}, Demand�e: {dto.Quantite}");

            // 6. Calculer les prix automatiquement
            dto.CalculerPrix(lot.PrixUnitaire, dto.Quantite);
            dto.SetInformationsComplementaires(article.Nom, societe.Nom, lot.DateExpiration, lot.QuantiteDisponible);

            // 7. Cr�er la vente
            var vente = new Vente
            {
                SocieteId = dto.SocieteId,
                Article = article.Nom,
                Lot = lot.NumLot,
                QteVendu = dto.Quantite,
                Date = dto.DateVente ?? DateTime.Now,
                PrixUnitaire = dto.PrixUnitaire,
                PrixTotal = dto.PrixTotal,
                ArticleId = article.Id,
                LotId = lot.Id
            };

            _context.Ventes.Add(vente);

            // 8. Mettre � jour la quantit� disponible du lot
            lot.QuantiteDisponible -= dto.Quantite;

            // 9. Mettre � jour le stock si il existe
            var stock = await _context.Stocks
                .FirstOrDefaultAsync(s => s.SocieteId == dto.SocieteId && 
                                        s.LotId == lot.Id);
            if (stock != null)
            {
                stock.QteDispo -= dto.Quantite;
                if (stock.QteDispo < 0) stock.QteDispo = 0;
            }

            // 10. Sauvegarder
            await _context.SaveChangesAsync();

            // 11. Cr�er des tickets si demand�
            var tickets = new List<TicketDto>();
            if (dto.ImprimerTicket)
            {
                for (int i = 0; i < dto.Quantite; i++)
                {
                    var ticket = new Ticket
                    {
                        VenteId = vente.Id,
                        CodeBarre = $"{article.CodeArticle}-{lot.NumLot}-{DateTime.Now:yyyyMMddHHmmss}-{i+1}",
                        DateCreation = DateTime.Now,
                        IsImprime = false
                    };
                    _context.Tickets.Add(ticket);
                    
                    tickets.Add(new TicketDto
                    {
                        Id = ticket.Id,
                        CodeBarre = ticket.CodeBarre,
                        DateCreation = ticket.DateCreation,
                        IsImprime = ticket.IsImprime,
                        DateImpression = ticket.DateImpression,
                        VenteId = ticket.VenteId,
                        Article = article.Nom,
                        Societe = societe.Nom
                    });
                }
                await _context.SaveChangesAsync();
            }

            // 12. Retourner la r�ponse compl�te
            return new VenteCreatedResponseDto
            {
                Id = vente.Id,
                SocieteId = vente.SocieteId,
                SocieteNom = societe.Nom,
                Article = vente.Article,
                Lot = vente.Lot,
                QteVendu = vente.QteVendu,
                Date = vente.Date,
                PrixUnitaire = vente.PrixUnitaire,
                PrixTotal = vente.PrixTotal,
                TicketImprime = dto.ImprimerTicket,
                Tickets = tickets
            };
        }

        /// <summary>
        /// Met � jour une vente avec recalcul automatique des prix
        /// </summary>
        public async Task<VenteCreatedResponseDto?> UpdateVenteAvecCalculAsync(int id, UpdateVenteArticleDto dto)
        {
            // 1. Validation
            var erreurs = dto.Valider();
            if (erreurs.Any())
                throw new ArgumentException($"Erreurs de validation: {string.Join(", ", erreurs)}");

            // 2. R�cup�rer la vente existante
            var existing = await _context.Ventes
                .Include(v => v.Societe)
                .Include(v => v.LotEntity)
                .Include(v => v.ArticleEntity)
                .FirstOrDefaultAsync(v => v.Id == id);
            
            if (existing == null) return null;

            // 3. V�rifier la soci�t�
            var societe = await _context.Societes.FindAsync(dto.SocieteId);
            if (societe == null)
                throw new ArgumentException("Soci�t� introuvable.");

            // 4. R�cup�rer l'article
            var article = await _context.Articles
                .FirstOrDefaultAsync(a => a.CodeArticle == dto.CodeArticle);
            if (article == null)
                throw new ArgumentException($"Article avec le code '{dto.CodeArticle}' introuvable.");

            // 5. R�cup�rer le lot
            var lot = await _context.Lots
                .FirstOrDefaultAsync(l => l.NumLot == dto.NumLot && l.ArticleId == article.Id);
            if (lot == null)
                throw new ArgumentException($"Lot '{dto.NumLot}' introuvable pour l'article '{dto.CodeArticle}'.");

            // 6. Calculer la diff�rence de quantit�
            var differenteQuantite = dto.Quantite - existing.QteVendu;
            
            // 7. V�rifier la disponibilit� si augmentation
            if (differenteQuantite > 0 && lot.QuantiteDisponible < differenteQuantite)
                throw new ArgumentException($"Quantit� insuffisante pour l'augmentation. Disponible: {lot.QuantiteDisponible}, Demand�e en plus: {differenteQuantite}");

            // 8. Calculer les nouveaux prix
            dto.CalculerPrix(lot.PrixUnitaire, dto.Quantite);

            // 9. Mettre � jour la vente
            existing.SocieteId = dto.SocieteId;
            existing.Article = article.Nom;
            existing.Lot = lot.NumLot;
            existing.QteVendu = dto.Quantite;
            existing.Date = dto.DateVente ?? existing.Date;
            existing.PrixUnitaire = dto.PrixUnitaire;
            existing.PrixTotal = dto.PrixTotal;
            existing.ArticleId = article.Id;
            existing.LotId = lot.Id;

            // 10. Ajuster les stocks
            if (existing.LotEntity != null)
            {
                existing.LotEntity.QuantiteDisponible += existing.QteVendu; // Remettre l'ancienne quantit�
            }
            lot.QuantiteDisponible -= dto.Quantite; // Retirer la nouvelle quantit�

            await _context.SaveChangesAsync();

            // 11. Retourner la r�ponse
            return new VenteCreatedResponseDto
            {
                Id = existing.Id,
                SocieteId = existing.SocieteId,
                SocieteNom = societe.Nom,
                Article = existing.Article,
                Lot = existing.Lot,
                QteVendu = existing.QteVendu,
                Date = existing.Date,
                PrixUnitaire = existing.PrixUnitaire,
                PrixTotal = existing.PrixTotal,
                TicketImprime = false,
                Tickets = new List<TicketDto>()
            };
        }

        // M�thodes existantes conserv�es pour compatibilit�
        public async Task<Vente> CreateAsync(Vente vente)
        {
            // Verify that Societe exists
            var societeExists = await _context.Societes.AnyAsync(s => s.Id == vente.SocieteId);
            if (!societeExists)
                throw new ArgumentException("Soci�t� introuvable.");

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
                    throw new ArgumentException("Soci�t� introuvable.");
            }

            existing.SocieteId = vente.SocieteId;
            existing.Article = vente.Article;
            existing.Lot = vente.Lot;
            existing.QteVendu = vente.QteVendu;
            existing.Date = vente.Date;
            existing.PrixUnitaire = vente.PrixUnitaire;
            existing.PrixTotal = vente.PrixTotal;

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

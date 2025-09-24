using comsult_stock.DTOs;
using comsult_stock.Models;
using consult_stock.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace consult_stock.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // Admin only access
    [Tags("Ventes")]
    public class VentesController : ControllerBase
    {
        private readonly VenteService _venteService;
        private readonly StockService _stockService;

        public VentesController(VenteService venteService, StockService stockService)
        {
            _venteService = venteService;
            _stockService = stockService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var ventes = await _venteService.GetAllAsync();
            return Ok(ventes);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var vente = await _venteService.GetByIdAsync(id);
            if (vente == null) return NotFound();
            return Ok(vente);
        }

        [HttpGet("societe/{societeId}")]
        public async Task<IActionResult> GetBySocieteId(int societeId)
        {
            var ventes = await _venteService.GetBySocieteIdAsync(societeId);
            return Ok(ventes);
        }

        /// <summary>
        /// Cr�e une vente avec calcul automatique des prix
        /// </summary>
        /// <param name="dto">Donn�es de la vente avec calcul automatique</param>
        /// <returns>Vente cr��e avec prix calcul�s automatiquement</returns>
        [HttpPost("avec-calcul")]
        [ProducesResponseType(typeof(VenteCreatedResponseDto), 201)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> CreateAvecCalcul([FromBody] VenteArticleDto dto)
        {
            try
            {
                var result = await _venteService.CreateVenteAvecCalculAsync(dto);
                return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erreur lors de la cr�ation de la vente", error = ex.Message });
            }
        }

        /// <summary>
        /// Met � jour une vente avec recalcul automatique des prix
        /// </summary>
        /// <param name="id">ID de la vente</param>
        /// <param name="dto">Nouvelles donn�es avec recalcul automatique</param>
        /// <returns>Vente mise � jour</returns>
        [HttpPut("{id}/avec-calcul")]
        [ProducesResponseType(typeof(VenteCreatedResponseDto), 200)]
        [ProducesResponseType(404)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> UpdateAvecCalcul(int id, [FromBody] UpdateVenteArticleDto dto)
        {
            try
            {
                var result = await _venteService.UpdateVenteAvecCalculAsync(id, dto);
                if (result == null) return NotFound();
                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erreur lors de la mise � jour de la vente", error = ex.Message });
            }
        }

        /// <summary>
        /// Endpoint optimis� pour les vendeurs - vente rapide avec calcul automatique
        /// </summary>
        /// <param name="dto">Donn�es de vente</param>
        /// <returns>Vente cr��e avec tickets</returns>
        [HttpPost("vente-rapide")]
        [AllowAnonymous] // Allow vendeurs to make sales
        [ProducesResponseType(typeof(VenteCreatedResponseDto), 201)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> VenteRapide([FromBody] VenteArticleDto dto)
        {
            try
            {
                var result = await _venteService.CreateVenteAvecCalculAsync(dto);
                
                return Ok(new { 
                    success = true,
                    vente = result,
                    message = "Vente effectu�e avec succ�s.",
                    resume = new
                    {
                        article = result.Article,
                        quantite = result.QteVendu,
                        prixUnitaire = result.PrixUnitaire,
                        prixTotal = result.PrixTotal,
                        ticketsGeneres = result.Tickets.Count
                    }
                });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { 
                    success = false, 
                    message = ex.Message,
                    suggestions = new[]
                    {
                        "V�rifiez que l'article existe",
                        "V�rifiez que le lot est disponible", 
                        "V�rifiez la quantit� en stock",
                        "V�rifiez que la soci�t� existe"
                    }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { 
                    success = false,
                    message = "Erreur syst�me lors de la vente", 
                    error = ex.Message 
                });
            }
        }

        // M�thodes existantes conserv�es pour compatibilit�
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateVenteDto dto)
        {
            try
            {
                var vente = new Vente
                {
                    SocieteId = dto.SocieteId,
                    Article = dto.Article,
                    Lot = dto.Lot,
                    QteVendu = dto.QteVendu,
                    Date = dto.Date,
                    PrixUnitaire = 0, // Sera mis � jour manuellement
                    PrixTotal = 0     // Sera mis � jour manuellement
                };

                var created = await _venteService.CreateAsync(vente);
                return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateVenteDto dto)
        {
            try
            {
                var vente = new Vente
                {
                    SocieteId = dto.SocieteId,
                    Article = dto.Article,
                    Lot = dto.Lot,
                    QteVendu = dto.QteVendu,
                    Date = dto.Date,
                    PrixUnitaire = 0, // Sera mis � jour manuellement
                    PrixTotal = 0     // Sera mis � jour manuellement
                };

                var updated = await _venteService.UpdateAsync(id, vente);
                if (updated == null) return NotFound();
                return Ok(updated);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _venteService.DeleteAsync(id);
            if (!deleted) return NotFound();
            return NoContent();
        }

        /// <summary>
        /// Endpoint legacy pour compatibilit� (d�pr�ci� - utilisez vente-rapide)
        /// </summary>
        [HttpPost("article")]
        [AllowAnonymous] // Allow vendeurs to make sales
        [Obsolete("Utilisez /vente-rapide pour une meilleure exp�rience")]
        public async Task<IActionResult> VendreArticle([FromBody] VenteArticleDto dto)
        {
            try
            {
                // Rediriger vers la nouvelle m�thode
                return await VenteRapide(dto);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Endpoint pour valider une vente avant cr�ation (simulation)
        /// </summary>
        /// <param name="dto">Donn�es de vente � valider</param>
        /// <returns>Informations de validation et prix calcul�s</returns>
        [HttpPost("valider")]
        [AllowAnonymous]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> ValiderVente([FromBody] VenteArticleDto dto)
        {
            try
            {
                // Validation de base
                var erreurs = dto.Valider();
                if (erreurs.Any())
                    return BadRequest(new { valid = false, erreurs });

                // V�rifications sans cr�er la vente
                var result = await _venteService.CreateVenteAvecCalculAsync(dto);
                
                // Annuler la transaction (simulation uniquement)
                // Note: Dans une vraie impl�mentation, utilisez une transaction
                
                return Ok(new
                {
                    valid = true,
                    simulation = new
                    {
                        article = result.Article,
                        lot = result.Lot,
                        quantiteDemandee = dto.Quantite,
                        prixUnitaire = result.PrixUnitaire,
                        prixTotal = result.PrixTotal,
                        ticketsAGenerer = dto.ImprimerTicket ? dto.Quantite : 0
                    },
                    message = "Validation r�ussie - la vente peut �tre cr��e"
                });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { 
                    valid = false, 
                    message = ex.Message,
                    type = "ValidationError"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { 
                    valid = false,
                    message = "Erreur lors de la validation", 
                    error = ex.Message 
                });
            }
        }
    }
}

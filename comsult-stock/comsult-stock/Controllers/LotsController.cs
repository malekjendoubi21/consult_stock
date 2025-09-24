using comsult_stock.DTOs;
using comsult_stock.Models;
using consult_stock.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace consult_stock.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Tags("Lots")]
    public class LotsController : ControllerBase
    {
        private readonly LotService _lotService;

        public LotsController(LotService lotService)
        {
            _lotService = lotService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var lots = await _lotService.GetAllAsync();
            return Ok(lots);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var lot = await _lotService.GetByIdAsync(id);
            if (lot == null) return NotFound();
            return Ok(lot);
        }

        [HttpGet("article/{articleId}")]
        public async Task<IActionResult> GetByArticleId(int articleId)
        {
            var lots = await _lotService.GetByArticleIdAsync(articleId);
            return Ok(lots);
        }

        [HttpGet("select/article/{articleId}")]
        public async Task<IActionResult> GetLotsForSelect(int articleId)
        {
            var lots = await _lotService.GetLotsForSelectAsync(articleId);
            return Ok(lots);
        }

        [HttpPost]
        [Authorize] // Admin only access

        public async Task<IActionResult> Create([FromBody] CreateLotDto dto)
        {
            try
            {
                var lot = new Lot
                {
                    ArticleId = dto.ArticleId,
                    NumLot = dto.NumLot,
                    QuantiteDisponible = dto.QuantiteDisponible,
                    DateExpiration = dto.DateExpiration,
                    PrixUnitaire = dto.PrixUnitaire
                };

                var created = await _lotService.CreateAsync(lot);
                return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        [Authorize] // Admin only access

        public async Task<IActionResult> Update(int id, [FromBody] UpdateLotDto dto)
        {
            try
            {
                var lot = new Lot
                {
                    ArticleId = dto.ArticleId,
                    NumLot = dto.NumLot,
                    QuantiteDisponible = dto.QuantiteDisponible,
                    DateExpiration = dto.DateExpiration,
                    PrixUnitaire = dto.PrixUnitaire
                };

                var updated = await _lotService.UpdateAsync(id, lot);
                if (updated == null) return NotFound();
                return Ok(updated);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        [Authorize] // Admin only access

        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _lotService.DeleteAsync(id);
            if (!deleted) return NotFound();
            return NoContent();
        }

        [HttpPatch("{id}/quantite")]
        public async Task<IActionResult> UpdateQuantite(int id, [FromBody] int nouvelleQuantite)
        {
            var updated = await _lotService.UpdateQuantiteAsync(id, nouvelleQuantite);
            if (!updated) return NotFound();
            return Ok(new { message = "Quantit� mise � jour avec succ�s" });
        }
    }
}

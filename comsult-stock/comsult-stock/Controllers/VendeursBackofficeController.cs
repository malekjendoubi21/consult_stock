using comsult_stock.DTOs;
using comsult_stock.Models;
using consult_stock.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace consult_stock.Controllers
{
    [ApiController]
    [Route("api/backoffice/vendeurs")]
    [Authorize] // Admin only access
    public class VendeursBackofficeController : ControllerBase
    {
        private readonly VendeurBackofficeService _vendeurService;

        public VendeursBackofficeController(VendeurBackofficeService vendeurService)
        {
            _vendeurService = vendeurService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var vendeurs = await _vendeurService.GetAllAsync();
            var vendeurDtos = vendeurs.Select(v => new
            {
                v.Id,
                v.Nom,
                v.Email,
                v.Role,
                DateCreation = DateTime.Now // Vous pourriez ajouter cette propriété au modèle
            });
            return Ok(vendeurDtos);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var vendeur = await _vendeurService.GetByIdAsync(id);
            if (vendeur == null) return NotFound();
            
            var vendeurDto = new
            {
                vendeur.Id,
                vendeur.Nom,
                vendeur.Email,
                vendeur.Role
            };
            return Ok(vendeurDto);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateVendeurDto dto)
        {
            try
            {
                var vendeur = new Vendeur
                {
                    Nom = dto.Nom,
                    Email = dto.Email,
                    PasswordHash = dto.Password,
                    Role = "Vendeur"
                };

                var created = await _vendeurService.CreateAsync(vendeur);
                var result = new
                {
                    created.Id,
                    created.Nom,
                    created.Email,
                    created.Role
                };
                return CreatedAtAction(nameof(GetById), new { id = created.Id }, result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateVendeurDto dto)
        {
            try
            {
                var vendeur = new Vendeur
                {
                    Nom = dto.Nom,
                    Email = dto.Email,
                    PasswordHash = dto.Password ?? ""
                };

                var updated = await _vendeurService.UpdateAsync(id, vendeur);
                if (updated == null) return NotFound();
                
                var result = new
                {
                    updated.Id,
                    updated.Nom,
                    updated.Email,
                    updated.Role
                };
                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _vendeurService.DeleteAsync(id);
            if (!deleted) return NotFound();
            return NoContent();
        }

        [HttpGet("search")]
        public async Task<IActionResult> Search([FromQuery] string term = "")
        {
            var vendeurs = await _vendeurService.SearchAsync(term);
            var vendeurDtos = vendeurs.Select(v => new
            {
                v.Id,
                v.Nom,
                v.Email,
                v.Role
            });
            return Ok(vendeurDtos);
        }
    }
}

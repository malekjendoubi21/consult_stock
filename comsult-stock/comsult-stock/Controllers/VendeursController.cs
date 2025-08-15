using comsult_stock.Models;
using consult_stock.Services;
using Microsoft.AspNetCore.Mvc;

namespace consult_stock.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VendeursController : ControllerBase
    {
        private readonly VendeurService _vendeurService;

        public VendeursController(VendeurService vendeurService)
        {
            _vendeurService = vendeurService;
        }

        // --- GET ALL ---
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var vendeurs = await _vendeurService.GetAllAsync();
            return Ok(vendeurs);
        }

        // --- GET BY ID ---
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var vendeur = await _vendeurService.GetByIdAsync(id);
            if (vendeur == null) return NotFound();
            return Ok(vendeur);
        }

        // --- CREATE ---
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Vendeur vendeur)
        {
            var created = await _vendeurService.CreateAsync(vendeur);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        // --- UPDATE ---
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Vendeur vendeur)
        {
            var updated = await _vendeurService.UpdateAsync(id, vendeur);
            if (updated == null) return NotFound();
            return Ok(updated);
        }

        // --- DELETE ---
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _vendeurService.DeleteAsync(id);
            if (!deleted) return NotFound();
            return NoContent();
        }
    }
}

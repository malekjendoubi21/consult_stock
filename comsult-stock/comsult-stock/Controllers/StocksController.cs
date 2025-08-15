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
    public class StocksController : ControllerBase
    {
        private readonly StockService _stockService;

        public StocksController(StockService stockService)
        {
            _stockService = stockService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var stocks = await _stockService.GetAllAsync();
            return Ok(stocks);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var stock = await _stockService.GetByIdAsync(id);
            if (stock == null) return NotFound();
            return Ok(stock);
        }

        [HttpGet("societe/{societeId}")]
        public async Task<IActionResult> GetBySocieteId(int societeId)
        {
            var stocks = await _stockService.GetBySocieteIdAsync(societeId);
            return Ok(stocks);
        }

        [HttpGet("consultation/societe/{societeId}")]
        [AllowAnonymous] // Allow vendeurs to consult stock
        public async Task<IActionResult> GetStockConsultation(int societeId)
        {
            var stocks = await _stockService.GetBySocieteIdAsync(societeId);
            var stockConsultation = stocks.Select(s => new StockConsultationDto
            {
                Id = s.Id,
                CodeBarre = s.CodeBarre,
                NumLot = s.NumLot,
                QteDispo = s.QteDispo,
                PrixTTC = s.PrixTTC,
                SocieteNom = s.Societe?.Nom ?? "",
                DateExpiration = s.DateExpiration
            });

            return Ok(stockConsultation);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateStockDto dto)
        {
            try
            {
                var stock = new Stock
                {
                    SocieteId = dto.SocieteId,
                    CodeBarre = dto.CodeBarre,
                    NumLot = dto.NumLot,
                    QteDispo = dto.QteDispo,
                    PrixTTC = dto.PrixTTC
                };

                var created = await _stockService.CreateAsync(stock);
                return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateStockDto dto)
        {
            try
            {
                var stock = new Stock
                {
                    SocieteId = dto.SocieteId,
                    CodeBarre = dto.CodeBarre,
                    NumLot = dto.NumLot,
                    QteDispo = dto.QteDispo,
                    PrixTTC = dto.PrixTTC
                };

                var updated = await _stockService.UpdateAsync(id, stock);
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
            var deleted = await _stockService.DeleteAsync(id);
            if (!deleted) return NotFound();
            return NoContent();
        }
    }
}

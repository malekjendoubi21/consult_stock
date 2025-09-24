using comsult_stock.DTOs;
using consult_stock.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace consult_stock.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TicketsController : ControllerBase
    {
        private readonly TicketService _ticketService;

        public TicketsController(TicketService ticketService)
        {
            _ticketService = ticketService;
        }

        [HttpGet("barcode/{codeBarre}")]
        public async Task<IActionResult> GetByCodeBarre(string codeBarre)
        {
            var ticket = await _ticketService.GetByCodeBarreAsync(codeBarre);
            if (ticket == null) return NotFound();

            var ticketDto = new TicketDto
            {
                Id = ticket.Id,
                CodeBarre = ticket.CodeBarre,
                DateCreation = ticket.DateCreation,
                VenteId = ticket.VenteId,
                Article = ticket.Vente?.Article ?? "",
                Societe = ticket.Vente?.Societe?.Nom ?? ""
            };

            return Ok(ticketDto);
        }

        [Authorize] // Admin access
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var tickets = await _ticketService.GetAllAsync();
            var ticketDtos = tickets.Select(t => new TicketDto
            {
                Id = t.Id,
                CodeBarre = t.CodeBarre,
                DateCreation = t.DateCreation,
                VenteId = t.VenteId,
                Article = t.Vente?.Article ?? "",
                Societe = t.Vente?.Societe?.Nom ?? ""
            });

            return Ok(ticketDtos);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var ticket = await _ticketService.GetByIdAsync(id);
            if (ticket == null) return NotFound();

            var ticketDto = new TicketDto
            {
                Id = ticket.Id,
                CodeBarre = ticket.CodeBarre,
                DateCreation = ticket.DateCreation,
                VenteId = ticket.VenteId,
                Article = ticket.Vente?.Article ?? "",
                Societe = ticket.Vente?.Societe?.Nom ?? ""
            };

            return Ok(ticketDto);
        }

        [HttpGet("{id}/pdf")]
        public async Task<IActionResult> GetTicketPdf(int id)
        {
            try
            {
                var pdfBytes = await _ticketService.GenerateTicketPdfAsync(id);
                return File(pdfBytes, "application/pdf", $"ticket_{id}.pdf");
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("generate")]
        public IActionResult GenerateBarcode()
        {
            var barcode = _ticketService.GenerateBarcode();
            return Ok(new { codeBarre = barcode });
        }
    }
}

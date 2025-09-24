using consult_stock.DTOs;
using consult_stock.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace consult_stock.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly VendeurService _vendeurService;
        private readonly IConfiguration _config;

        public AuthController(VendeurService vendeurService, IConfiguration config)
        {
            _vendeurService = vendeurService;
            _config = config;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterVendeurDto dto)
        {
            var vendeur = await _vendeurService.RegisterAsync(dto.Nom, dto.Email, dto.Password);
            return Ok(new { vendeur.Id, vendeur.Nom, vendeur.Email });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginVendeurDto dto)
        {
            var vendeur = await _vendeurService.LoginAsync(dto.Email, dto.Password);
            var token = GenerateJwtToken(vendeur);
            return Ok(new { token });
        }

        private string GenerateJwtToken(comsult_stock.Models.Vendeur vendeur)
        {
            var key = Encoding.UTF8.GetBytes(_config["Jwt:Key"]); // Utilise la clé du fichier de configuration
            var claims = new[]
            {
                new Claim(ClaimTypes.Name, vendeur.Email),
                new Claim(ClaimTypes.Role, vendeur.Role)
            };
            var creds = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256);
            var token = new JwtSecurityToken(claims: claims, expires: DateTime.Now.AddHours(3), signingCredentials: creds);
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
        [Authorize]
        [HttpGet("profile")]
        public async Task<IActionResult> Profile()
        {
            // Récupère l'email à partir du token
            var email = User.FindFirstValue(ClaimTypes.Name);
            if (string.IsNullOrEmpty(email))
                return Unauthorized(new { message = "Utilisateur non authentifié." });

            // Récupère les infos du vendeur
            var vendeur = await _vendeurService.GetByEmailAsync(email);
            if (vendeur == null)
                return NotFound(new { message = "Vendeur introuvable." });

            return Ok(new
            {
                vendeur.Id,
                vendeur.Nom,
                vendeur.Email,
                vendeur.Role
            });
        }


    }
}

using Microsoft.AspNetCore.Mvc;
using FaceGlassesApi.Models;
using FaceGlassesApi.Services;
using Microsoft.AspNetCore.Authorization;

namespace FaceGlassesApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AuthenticationService _authService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(AuthenticationService authService, ILogger<AuthController> logger)
        {
            _authService = authService;
            _logger = logger;
        }

        [HttpPost("login")]
        [Consumes("application/json")]
        [Produces("application/json")]
        public async Task<ActionResult<LoginResponse>> Login([FromBody] LoginRequest loginRequest)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var errors = ModelState
                        .Where(x => x.Value?.Errors.Count > 0)
                        .SelectMany(x => x.Value!.Errors)
                        .Select(x => x.ErrorMessage)
                        .ToList();

                    return BadRequest(new LoginResponse
                    {
                        Success = false,
                        Message = string.Join(", ", errors)
                    });
                }

                var result = await _authService.LoginAsync(loginRequest);

                if (!result.Success)
                {
                    return Unauthorized(result);
                }

                _logger.LogInformation("Kullanıcı başarıyla giriş yaptı: {Email}", loginRequest.Email);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Login işlemi sırasında hata oluştu: {Email}", loginRequest.Email);
                return StatusCode(500, new LoginResponse
                {
                    Success = false,
                    Message = "Sunucu hatası oluştu"
                });
            }
        }

        [HttpGet("profile")]
        [Produces("application/json")] 
        [Authorize]
        public async Task<ActionResult<UserDto>> GetProfile()
        {
            try
            {
                var userId = User.FindFirst("userId")?.Value;
                
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { message = "Geçersiz token" });
                }

                var user = await _authService.GetUserByIdAsync(userId);
                
                if (user == null)
                {
                    return NotFound(new { message = "Kullanıcı bulunamadı" });
                }

                return Ok(new UserDto
                {
                    Id = user.Id,
                    Email = user.Email,
                    Name = user.Name,
                    Role = user.Role
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Profil bilgisi alınırken hata oluştu");
                return StatusCode(500, new { message = "Sunucu hatası oluştu" });
            }
        }

        [HttpPost("logout")]
        [Produces("application/json")]
        [Authorize]
        public IActionResult Logout()
        {
            // JWT token'lar stateless olduğu için server-side logout işlemi yok
            // Client-side'da token'ı silmek yeterli
            return Ok(new { message = "Başarıyla çıkış yapıldı" });
        }
    }
} 
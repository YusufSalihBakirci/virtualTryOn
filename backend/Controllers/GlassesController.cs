using FaceGlassesApp.Services;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;

namespace FaceGlassesApp.Controllers
{
    /// <summary>
    /// Base64 görüntü işleme isteği modeli
    /// </summary>
    public class Base64ImageRequest
    {
        [Required(ErrorMessage = "Base64 görüntü verisi gerekli.")]
        public string Base64Image { get; set; } = string.Empty;

        public string? Prompt { get; set; }
    }

    /// <summary>
    /// Görüntü işleme yanıt modeli
    /// </summary>
    public class ImageProcessingResponse
    {
        public bool Success { get; set; }
        public string? EnhancedImageBase64 { get; set; }
        public string? Message { get; set; }
        public string? Error { get; set; }
        public DateTime ProcessedAt { get; set; } = DateTime.UtcNow;
        public string ProcessingMethod { get; set; } = string.Empty;
        public string? UsedPrompt { get; set; }
        public string? GeminiTextResponse { get; set; } // Gemini'nin text yanıtı
        public string? GlassesCoordinates { get; set; } // Gözlük yerleştirme koordinatları
    }

    [Route("api/[controller]")]
    [ApiController]
    public class GlassesController : ControllerBase
    {
        private readonly GeminiProService _geminiProService;
        private readonly ILogger<GlassesController> _logger;

        public GlassesController(GeminiProService geminiProService, ILogger<GlassesController> logger)
        {
            _geminiProService = geminiProService;
            _logger = logger;
        }

        [HttpPost("enhance")]
        public async Task<IActionResult> ProcessImage([FromBody] Base64ImageRequest request)
        {
            if (request == null || string.IsNullOrEmpty(request.Base64Image))
            {
                _logger.LogWarning("Boş base64 görüntü verisi.");
                return BadRequest(new ImageProcessingResponse
                {
                    Success = false,
                    Error = "Base64 görüntü verisi gerekli."
                });
            }

            var defaultPrompt = "stylish sunglasses";
            var actualPrompt = !string.IsNullOrEmpty(request.Prompt) ? request.Prompt : defaultPrompt;

            _logger.LogInformation("Base64 görüntü işleme isteği. Prompt: {Prompt}", actualPrompt);

            // Base64 string'ten içerik tipi ve gerçek veriyi ayır
            string contentType = "image/jpeg"; // fallback
            string base64Data = request.Base64Image;

            if (base64Data.Contains(','))
            {
                var parts = base64Data.Split(',');
                base64Data = parts[1];

                var mimeMatch = Regex.Match(parts[0], @"data:(?<mime>.*?);base64");
                if (mimeMatch.Success)
                {
                    contentType = mimeMatch.Groups["mime"].Value;
                    _logger.LogInformation("Algılanan MIME türü: {ContentType}", contentType);
                }
            }

            // Desteklenen görsel formatlarını kontrol et
            var supportedTypes = new[] { "image/jpeg", "image/png", "image/webp", "image/gif" };
            if (!supportedTypes.Contains(contentType))
            {
                _logger.LogWarning("Desteklenmeyen MIME türü: {ContentType}", contentType);
                return BadRequest(new ImageProcessingResponse
                {
                    Success = false,
                    Error = $"Desteklenmeyen görsel türü: {contentType}"
                });
            }

            // Base64 string'i decode et
            byte[] imageBytes;
            try
            {
                base64Data = base64Data.Trim()
                                       .Replace(" ", "")
                                       .Replace("\n", "")
                                       .Replace("\r", "");

                imageBytes = Convert.FromBase64String(base64Data);
                _logger.LogDebug("Base64 decode başarılı. Boyut: {Size} bytes", imageBytes.Length);
            }
            catch (FormatException ex)
            {
                _logger.LogError(ex, "Geçersiz base64 format");
                return BadRequest(new ImageProcessingResponse
                {
                    Success = false,
                    Error = "Geçersiz base64 görüntü formatı."
                });
            }

            // Byte array'i MemoryStream'e çevir
            using var imageStream = new MemoryStream(imageBytes);
            FaceGlassesApp.Services.ImageProcessingResult result;

            try
            {
                result = await _geminiProService.EnhanceImageWithAnalysisPrompt(
                    imageStream: imageStream,
                    prompt: actualPrompt,
                    contentType: contentType
                );
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Gemini servisinde hata oluştu. Hata: {Error}", ex.Message);
                return StatusCode(500, new ImageProcessingResponse
                {
                    Success = false,
                    Error = $"Görüntü işleme sırasında Gemini servisinde hata oluştu. Detay: {ex.Message}"
                });
            }

            _logger.LogInformation("Gemini Pro görüntü işleme tamamlandı. Sonuç boyutu: {Size} bytes", result.ImageBytes.Length);

            // Orijinal görüntü + Gemini'nin gözlük yerleştirme koordinatlarını döndür
            var originalImageBase64 = Convert.ToBase64String(result.ImageBytes);
            
            return Ok(new ImageProcessingResponse
            {
                Success = true,
                EnhancedImageBase64 = originalImageBase64, // Orijinal görüntü
                Message = "Gözlük yerleştirme koordinatları başarıyla hesaplandı.",
                ProcessingMethod = "Coordinate Analysis with Gemini",
                UsedPrompt = actualPrompt,
                GeminiTextResponse = result.TextResponse,
                GlassesCoordinates = result.TextResponse.Contains("POSITION_DATA:") ? 
                    result.TextResponse.Substring(result.TextResponse.IndexOf("POSITION_DATA:") + "POSITION_DATA:".Length).Trim() : 
                    (result.TextResponse.Contains("GLASSES_POSITION:") ? 
                        result.TextResponse.Substring(result.TextResponse.IndexOf("GLASSES_POSITION:") + "GLASSES_POSITION:".Length).Trim() : 
                        null)
            });
        }

        [HttpPost("enhance-conservative")]
        public async Task<IActionResult> EnhanceConservative([FromBody] Base64ImageRequest request)
        {
            try
            {
                if (request == null || string.IsNullOrEmpty(request.Base64Image))
                {
                    _logger.LogWarning("Boş base64 görüntü verisi.");
                    return BadRequest(new ImageProcessingResponse
                    {
                        Success = false,
                        Error = "Base64 görüntü verisi gerekli."
                    });
                }

                var defaultPrompt = "stylish sunglasses";
                var actualPrompt = !string.IsNullOrEmpty(request.Prompt) ? request.Prompt : defaultPrompt;

                _logger.LogInformation("Konservatif base64 görüntü işleme isteği. Prompt: {Prompt}", actualPrompt);

                // Base64 string'i decode et
                byte[] imageBytes;
                try
                {
                    // Data URL prefix'ini temizle (data:image/jpeg;base64, gibi)
                    var base64Data = request.Base64Image;
                    if (base64Data.Contains(','))
                    {
                        base64Data = base64Data.Split(',')[1];
                    }
                    
                    imageBytes = Convert.FromBase64String(base64Data);
                    _logger.LogDebug("Base64 decode başarılı. Boyut: {Size} bytes", imageBytes.Length);
                }
                catch (FormatException ex)
                {
                    _logger.LogError(ex, "Geçersiz base64 format");
                    return BadRequest(new ImageProcessingResponse
                    {
                        Success = false,
                        Error = "Geçersiz base64 görüntü formatı."
                    });
                }

                // Byte array'i MemoryStream'e çevir
                using var imageStream = new MemoryStream(imageBytes);
                var result = await _geminiProService.EnhanceImageWithPrompt(
                    imageStream: imageStream,
                    prompt: actualPrompt,
                    contentType: "image/jpeg"
                );

                _logger.LogInformation("Gemini Pro konservatif görüntü işleme tamamlandı. Sonuç boyutu: {Size} bytes", result.ImageBytes.Length);
                
                // Orijinal görüntü + Gemini'nin gözlük yerleştirme koordinatlarını döndür
                var originalImageBase64 = Convert.ToBase64String(result.ImageBytes);
                
                return Ok(new ImageProcessingResponse
                {
                    Success = true,
                    EnhancedImageBase64 = originalImageBase64, // Orijinal görüntü
                    Message = "Gözlük yerleştirme koordinatları başarıyla hesaplandı (konservatif yaklaşım).",
                    ProcessingMethod = "Conservative Coordinate Analysis with Gemini",
                    UsedPrompt = actualPrompt,
                    GeminiTextResponse = result.TextResponse,
                    GlassesCoordinates = result.TextResponse.Contains("POSITION_DATA:") ? 
                        result.TextResponse.Substring(result.TextResponse.IndexOf("POSITION_DATA:") + "POSITION_DATA:".Length).Trim() : 
                        (result.TextResponse.Contains("GLASSES_POSITION:") ? 
                            result.TextResponse.Substring(result.TextResponse.IndexOf("GLASSES_POSITION:") + "GLASSES_POSITION:".Length).Trim() : 
                            null)
                });
            }
            catch (GeminiProServiceException ex)
            {
                _logger.LogError(ex, "Gemini Pro servis hatası: {Message}", ex.Message);
                return BadRequest(new ImageProcessingResponse
                {
                    Success = false,
                    Error = $"Gemini Pro servis hatası: {ex.Message}"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Beklenmedik hata: {Message}", ex.Message);
                return StatusCode(500, new ImageProcessingResponse
                {
                    Success = false,
                    Error = $"Dahili sunucu hatası. Detay: {ex.Message}"
                });
            }
        }

        [HttpGet("models")]
        public async Task<IActionResult> GetAvailableModels()
        {
            try
            {
                var models = await _geminiProService.GetAvailableModelsAsync();
                return Ok(new { models, provider = "Gemini Pro" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Model bilgileri alınırken hata: {Message}", ex.Message);
                return StatusCode(500, new { error = "Model bilgileri alınamadı." });
            }
        }

        [HttpGet("health")]
        public IActionResult HealthCheck()
        {
            return Ok(new { status = "healthy", timestamp = DateTime.UtcNow });
        }

        [HttpPost("test-gemini")]
        public async Task<IActionResult> TestGemini()
        {
            try
            {
                // Basit bir test görüntüsü (1x1 pixel)
                var testImageBytes = Convert.FromBase64String("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==");
                
                using var testStream = new MemoryStream(testImageBytes);
                var result = await _geminiProService.EnhanceImageWithPrompt(testStream, "test", "image/png");
                
                return Ok(new
                {
                    success = true,
                    message = "Gemini API bağlantısı başarılı",
                    responseLength = result.TextResponse?.Length ?? 0,
                    hasImageData = !string.IsNullOrEmpty(result.ImageBytes.ToString()),
                    textResponse = result.TextResponse
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Gemini test hatası: {Error}", ex.Message);
                return BadRequest(new
                {
                    success = false,
                    error = ex.Message,
                    innerError = ex.InnerException?.Message
                });
            }
        }
    }
}
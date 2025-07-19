// Controllers/ImageProcessingController.cs
using FaceGlassesApi.Models;
using FaceGlassesApi.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;
using System.Collections.Generic; // List için
using System.Linq; // SelectMany için

namespace FaceGlassesApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ImageProcessingController : ControllerBase
    {
        private readonly GeminiProService _geminiService;
        private readonly ILogger<ImageProcessingController> _logger;

        public ImageProcessingController(
            GeminiProService geminiService,
            ILogger<ImageProcessingController> logger)
        {
            _geminiService = geminiService;
            _logger = logger;
        }

        /// <summary>
        /// İki Base64 görseli (insan ve gözlük) ve bir prompt alarak Gemini AI'ye gönderir ve
        /// üzerinde gözlük yerleştirilmiş modifiye görseli Base64 olarak döndürür.
        /// </summary>
        /// <param name="request">Ana görsel Base64, gözlük görseli Base64 ve işlem prompt'u.</param>
        /// <returns>AI tarafından işlenmiş görsel Base64 veya hata mesajı.</returns>
        [HttpPost("overlay-glasses-with-gemini-ai")] // Endpoint adını değiştirdik
        public async Task<IActionResult> OverlayGlassesWithGeminiAI([FromBody] ProcessImageRequest request)
        {
            if (!ModelState.IsValid)
            {
                _logger.LogWarning("Geçersiz istek modeli: {Errors}", ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage));
                return BadRequest(ModelState);
            }

            // Görsel Base64'leri byte dizilerine dönüştürme ve MIME tipi tespiti
            byte[] primaryImageBytes;
            string primaryImageMimeType;
            byte[] glassesImageBytes;
            string glassesImageMimeType;

            try
            {
                primaryImageBytes = Convert.FromBase64String(request.PrimaryImageBase64!);
                primaryImageMimeType = GetMimeTypeFromBase64(request.PrimaryImageBase64!);

                glassesImageBytes = Convert.FromBase64String(request.GlassesImageBase64!);
                glassesImageMimeType = GetMimeTypeFromBase64(request.GlassesImageBase64!);
            }
            catch (FormatException ex)
            {
                _logger.LogError(ex, "Base64 string dönüştürülemedi.");
                return BadRequest("Geçersiz Base64 formatı.");
            }

            _logger.LogInformation("AI ile gözlük yerleştirme isteği alındı. Prompt: '{Prompt}'", request.ImageProcessingPrompt);

            // AI'ya gönderilecek görselleri hazırlıyoruz
            var imageInputs = new List<ImagePart>
            {
                new ImagePart { Base64Data = request.PrimaryImageBase64!, MimeType = primaryImageMimeType },
                new ImagePart { Base64Data = request.GlassesImageBase64!, MimeType = glassesImageMimeType }
            };

            // AI'ya gidecek prompt. İki görselden de bahsetmeli.
            // Bu prompt'u çok detaylı ve açıklayıcı yazmak çok önemli!
            string aiPrompt = $"Resim 1'deki kişinin yüzüne Resim 2'deki gözlüğü doğal ve gerçekçi bir şekilde yerleştir. Kişinin yüz hatlarını ve ifadesini olduğu gibi koru. Arkaplanı değiştirme. Sadece gözlük eklemesini yap ve düzenlenmiş resmi geri döndür. Gözlük, Resim 1'deki kişinin gözlerine mükemmel şekilde uymalıdır.";
            if (!string.IsNullOrEmpty(request.ImageProcessingPrompt))
            {
                aiPrompt += " Ek talimatlar: " + request.ImageProcessingPrompt;
            }

            var geminiApiResponse = await _geminiService.PerformImageOperationWithGeminiKeyAsync(
                aiPrompt,
                imageInputs // İki görseli de gönderiyoruz
            );

            if (geminiApiResponse.IsSuccessful && !string.IsNullOrEmpty(geminiApiResponse.ImageBase64Output))
            {
                // API'den modifiye edilmiş görsel geldi
                return Ok(new ProcessImageResponse
                {
                    Success = true,
                    Message = "Gözlük AI tarafından başarıyla yerleştirildi.",
                    ModifiedImageBase64 = geminiApiResponse.ImageBase64Output, // Modifiye edilmiş görsel
                    Error = geminiApiResponse.ErrorMessage // Hata değil, ek bilgi olabilir
                });
            }
            else
            {
                _logger.LogError("Gözlük yerleştirme başarısız: {Error}. Gemini Metin Yanıtı: {Text}",
                                 geminiApiResponse.ErrorMessage ?? "Bilinmeyen hata.", geminiApiResponse.Text);
                return StatusCode(500, new ProcessImageResponse
                {
                    Success = false,
                    Error = geminiApiResponse.ErrorMessage ?? "AI yanıtı alınamadı veya boş.",
                    Message = "Gözlük yerleştirme başarısız. Gemini Metin Yanıtı: " + geminiApiResponse.Text
                });
            }
        }

        // Basit MIME tipi tespit metodu (daha sağlamı için FileExtensionContentTypeProvider kullanılabilir)
        private string GetMimeTypeFromBase64(string base64String)
        {
            var data = base64String.Substring(0, Math.Min(50, base64String.Length)); // İlk birkaç karakter
            if (data.Contains("iVBORw0KGgo")) return "image/png";
            if (data.Contains("/9j/")) return "image/jpeg";
            if (data.Contains("R0lGOD")) return "image/gif";
            if (data.Contains("UklGR")) return "image/webp";
            return "application/octet-stream";
        }
    }
}
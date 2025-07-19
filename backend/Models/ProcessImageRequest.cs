using System.ComponentModel.DataAnnotations;

namespace FaceGlassesApi.Models
{
    public class ProcessImageRequest
    {
        [Required(ErrorMessage = "Ana görsel Base64 formatında gereklidir.")]
        public string? PrimaryImageBase64 { get; set; } // Üzerine işlem yapılacak ana insan görseli

        [Required(ErrorMessage = "Gözlük görseli Base64 formatında gereklidir.")]
        public string? GlassesImageBase64 { get; set; } // Yerleştirilecek gözlüğün görseli

        [Required(ErrorMessage = "Görsel işlem prompt'u gerekli.")]
        public string? ImageProcessingPrompt { get; set; } // Gözlük yerleştirme talimatı
    }
}


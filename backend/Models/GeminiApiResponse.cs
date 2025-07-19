namespace FaceGlassesApi.Models
{
    public class GeminiApiResponse
    {
        public string Text { get; set; } = string.Empty; // Modelden gelen metin (varsa)
        public string? ImageBase64Output { get; set; } // Modifiye edilmiş/oluşturulmuş resim Base64
        public bool IsSuccessful { get; set; }
        public string? ErrorMessage { get; set; }
    }
}

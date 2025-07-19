namespace FaceGlassesApi.Models
{
    public class GeminiApiRequest
    {
        public string Prompt { get; set; } = string.Empty;

        // Birden fazla girdi görseli için liste kullanıyoruz
        public List<ImagePart> ImageInputs { get; set; } = new List<ImagePart>(); // Giriş görselleri listesi

        public double Temperature { get; set; }
        public double TopP { get; set; }
        public int CandidateCount { get; set; } = 1;
    }

    public class ImagePart // Görsel girdinin detayları
    {
        public string Base64Data { get; set; } = string.Empty;
        public string MimeType { get; set; } = "image/jpeg";
    }
}

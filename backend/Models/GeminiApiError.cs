using System.Text.Json.Serialization;

namespace FaceGlassesApi.Models
{
    public class GeminiApiError
    {
        [JsonPropertyName("code")]
        public int Code { get; set; }

        [JsonPropertyName("message")]
        public string? Message { get; set; }

        [JsonPropertyName("status")]
        public string? Status { get; set; }

        // Daha fazla detay varsa buraya eklenebilir (fieldViolations vb.)
    }
}

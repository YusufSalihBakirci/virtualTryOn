using System.Text.Json.Serialization;

namespace FaceGlassesApi.Models
{
    public class GeminiInlineData
    {
        [JsonPropertyName("mime_type")]
        public string? MimeType { get; set; }

        [JsonPropertyName("data")]
        public string? Data { get; set; } // Base64 görsel verisi
    }
}

using System.Text.Json.Serialization;

namespace FaceGlassesApi.Models
{
    public class GeminiRawApiResponse
    {
        [JsonPropertyName("candidates")]
        public List<GeminiCandidate>? Candidates { get; set; }

        [JsonPropertyName("error")]
        public GeminiApiError? Error { get; set; }
        [JsonPropertyName("usageMetadata")]
        public object? UsageMetadata { get; set; } // Tamamen deserialize etmek için object olarak bırakılabilir.
    }
}

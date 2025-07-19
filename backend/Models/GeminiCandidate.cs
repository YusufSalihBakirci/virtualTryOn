using System.Text.Json.Serialization;

namespace FaceGlassesApi.Models
{
    public class GeminiCandidate
    {
        [JsonPropertyName("content")]
        public GeminiContent? Content { get; set; }

        [JsonPropertyName("finishReason")]
        public string? FinishReason { get; set; } // STOP, SAFETY gibi
    }
}

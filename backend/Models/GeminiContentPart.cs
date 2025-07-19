using System.Text.Json.Serialization;

namespace FaceGlassesApi.Models
{
    public class GeminiContentPart
    {
        [JsonPropertyName("text")]
        public string? Text { get; set; }

        [JsonPropertyName("inline_data")]
        public GeminiInlineData? InlineData { get; set; }

    }
}

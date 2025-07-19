using System.Text.Json;
using System.Text.Json.Serialization;

namespace FaceGlassesApi.Models
{
    public class GeminiContent
    {
        [JsonPropertyName("parts")]
        public List<JsonElement>? PartsElements { get; set; } // --> DİKKAT: Burayı değiştirdik!


        [JsonPropertyName("role")] // Genellikle "model" veya "user"
        public string? Role { get; set; }
    }
}

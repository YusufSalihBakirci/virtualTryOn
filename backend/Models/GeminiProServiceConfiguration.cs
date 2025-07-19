using System.ComponentModel.DataAnnotations;

namespace FaceGlassesApi.Models
{
    public class GoogleGeminiApiConfiguration
    {
        [Required]
        public string ApiKey { get; set; } = Environment.GetEnvironmentVariable("GEMINI_API_KEY") ?? string.Empty;

        [Required]
        public string ModelName { get; set; } = "gemini-2.0-flash-exp";

        [Required]
        public string BaseUrl { get; set; } = "https://generativelanguage.googleapis.com/v1beta";

        [Range(1, 10)]
        public int RequestTimeoutMinutes { get; set; } = 2;

        [Range(1, 10)]
        public int MaxRetryAttempts { get; set; } = 3;

        [Range(1, 60)]
        public int RetryDelaySeconds { get; set; } = 1;

        [Range(0.1, 2.0)]
        public double Temperature { get; set; } = 0.4;

        [Range(0.1, 1.0)]
        public double TopP { get; set; } = 0.8;
    }
}

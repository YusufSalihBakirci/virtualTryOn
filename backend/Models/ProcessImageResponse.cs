namespace FaceGlassesApi.Models
{
    public class ProcessImageResponse
    {
        public bool Success { get; set; }
        public string? Message { get; set; }
        public string? ModifiedImageBase64 { get; set; } // Modifiye edilmiş görsel Base64
        public string? Error { get; set; }
    }
}

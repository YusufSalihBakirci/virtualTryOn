namespace FaceGlassesApi.Services
{

    public class GeminiProServiceException : Exception
    {
        public GeminiProServiceException(string message) : base(message) { }
        public GeminiProServiceException(string message, Exception innerException) : base(message, innerException) { }
    }

}

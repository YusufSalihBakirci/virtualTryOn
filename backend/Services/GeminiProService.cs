using Google.Cloud.AIPlatform.V1;
using Google.Protobuf.WellKnownTypes;
using Grpc.Core;
using Microsoft.Extensions.Options;
using System.ComponentModel.DataAnnotations;
using System.Text.Json;
using System.Text;

namespace FaceGlassesApp.Services
{
    /// <summary>
    /// Gemini Pro servisi için yapılandırma sınıfı
    /// </summary>
    public class GeminiProServiceConfiguration
    {
        [Required]
        public string ProjectId { get; set; } = string.Empty; // appsettings.json'dan okunur

        [Required]
        public string Location { get; set; } = "us-central1"; // Varsayılan: us-central1

        [Required]
        public string Model { get; set; } = string.Empty; // appsettings.json'dan okunur

        [Range(1024, 50 * 1024 * 1024)] // 1KB - 50MB
        public long MaxImageSizeBytes { get; set; } = 10 * 1024 * 1024; // 10MB

        [Range(1, 10)]
        public int RequestTimeoutMinutes { get; set; } = 2;

        [Range(1, 10)]
        public int MaxRetryAttempts { get; set; } = 3;

        [Range(1, 60)]
        public int RetryDelaySeconds { get; set; } = 1;

        public string[] SupportedImageFormats { get; set; } = { "image/jpeg", "image/png", "image/webp", "image/gif" };

        [Range(256, 2048)]
        public int OutputImageSize { get; set; } = 1024;

        [Range(1, 8)]
        public int SampleCount { get; set; } = 1;

        public string Language { get; set; } = "en";

        [Range(0.1, 2.0)]
        public double Temperature { get; set; } = 0.4;

        [Range(0.1, 1.0)]
        public double TopP { get; set; } = 0.8;

        public string ApiKey { get; set; } = string.Empty; // Gelecek kullanım için - şu anda kullanılmıyor
    }

    /// <summary>
    /// Gemini Pro servis istisnası
    /// </summary>
    public class GeminiProServiceException : Exception
    {
        public GeminiProServiceException(string message) : base(message) { }
        public GeminiProServiceException(string message, Exception innerException) : base(message, innerException) { }
    }

    /// <summary>
    /// Gemini Pro API yanıt modeli
    /// </summary>
    public class GeminiApiResponse
    {
        public string Text { get; set; } = string.Empty;
        public string? ImageData { get; set; }
        public bool IsSuccessful { get; set; }
        public string? ErrorMessage { get; set; }
    }

    /// <summary>
    /// Görüntü işleme sonuç modeli
    /// </summary>
    public class ImageProcessingResult
    {
        public byte[] ImageBytes { get; set; } = Array.Empty<byte>();
        public string TextResponse { get; set; } = string.Empty;
        public bool IsSuccessful { get; set; }
        public string? ErrorMessage { get; set; }
    }

    /// <summary>
    /// Gemini Pro API istek modeli
    /// </summary>
    public class GeminiApiRequest
    {
        public string Prompt { get; set; } = string.Empty;
        public string? ImageBase64 { get; set; }
        public double Temperature { get; set; } = 0.4;
        public double TopP { get; set; } = 0.8;
        public int CandidateCount { get; set; } = 1;
    }

    /// <summary>
    /// Gemini Pro hizmet sınıfı - Görüntü işleme ve yapay zeka entegrasyonu
    /// </summary>
    public class GeminiProService
    {
        #region Özel Alanlar

        private readonly GeminiProServiceConfiguration _config;
        private readonly ILogger<GeminiProService> _logger;
        private readonly HttpClient _httpClient;
        private readonly string _credentialsPath;

        #endregion

        #region Yapıcı Metod

        /// <summary>
        /// GeminiProService yapıcı metodu
        /// </summary>
        /// <param name="env">Web host ortamı</param>
        /// <param name="config">Servis yapılandırması</param>
        /// <param name="logger">Loglama servisi</param>
        /// <param name="httpClient">HTTP client</param>
        public GeminiProService(
            IWebHostEnvironment env,
            IOptions<GeminiProServiceConfiguration> config,
            ILogger<GeminiProService> logger,
            HttpClient httpClient)
        {
            _config = config.Value;
            _logger = logger;
            _httpClient = httpClient;
            _credentialsPath = Path.Combine(env.ContentRootPath, "credentials.json");

            YapilandirmaDogrula();
            HttpClientAyarla();
        }

        #endregion

        #region Yapılandırma ve Doğrulama

        /// <summary>
        /// Servis yapılandırmasını doğrular
        /// </summary>
        private void YapilandirmaDogrula()
        {
            if (string.IsNullOrEmpty(_config.ProjectId))
            {
                var hata = "ProjectId yapılandırması gerekli.";
                _logger.LogError(hata);
                throw new GeminiProServiceException(hata);
            }

            if (!File.Exists(_credentialsPath))
            {
                var hata = $"Kimlik bilgileri dosyası bulunamadı: {_credentialsPath}";
                _logger.LogError(hata);
                throw new GeminiProServiceException(hata);
            }

            _logger.LogInformation("GeminiProService yapılandırması doğrulandı. ProjectId: {ProjectId}, Model: {Model}",
                _config.ProjectId, _config.Model);
        }

        /// <summary>
        /// HTTP client ayarlarını yapar
        /// </summary>
        private void HttpClientAyarla()
        {
            _httpClient.Timeout = TimeSpan.FromMinutes(_config.RequestTimeoutMinutes);
            _httpClient.DefaultRequestHeaders.Add("User-Agent", "FaceGlassesApp/1.0");
            
            _logger.LogDebug("HTTP client ayarları tamamlandı. Timeout: {Timeout} dakika", 
                _config.RequestTimeoutMinutes);
        }

        #endregion

        #region Kimlik Doğrulama

        /// <summary>
        /// Google Cloud access token alır
        /// </summary>
        /// <returns>Access token</returns>
        private async Task<string> AccessTokenAl()
        {
            try
            {
                _logger.LogDebug("Google Cloud access token alınıyor. Credentials file: {CredentialsPath}", _credentialsPath);
                
                if (!File.Exists(_credentialsPath))
                {
                    throw new FileNotFoundException($"Credentials dosyası bulunamadı: {_credentialsPath}");
                }

                var credential = Google.Apis.Auth.OAuth2.GoogleCredential.FromFile(_credentialsPath)
                    .CreateScoped("https://www.googleapis.com/auth/cloud-platform");

                var token = await credential.UnderlyingCredential.GetAccessTokenForRequestAsync();
                
                _logger.LogDebug("Access token başarıyla alındı. Token uzunluk: {TokenLength}", token?.Length ?? 0);
                return token ?? string.Empty;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Access token alınamadı. Credentials path: {CredentialsPath}, Hata: {Error}", 
                    _credentialsPath, ex.Message);
                throw new GeminiProServiceException($"Access token alınamadı. Detay: {ex.Message}", ex);
            }
        }

        #endregion

        #region Dosya ve Stream İşlemleri

        /// <summary>
        /// Görüntü dosyasını doğrular
        /// </summary>
        /// <param name="imagePath">Görüntü dosya yolu</param>
        private void GoruntuDosyasiDogrula(string imagePath)
        {
            if (string.IsNullOrEmpty(imagePath))
            {
                throw new ArgumentException("Görüntü dosya yolu boş olamaz.");
            }

            if (!File.Exists(imagePath))
            {
                throw new FileNotFoundException($"Görüntü dosyası bulunamadı: {imagePath}");
            }

            var fileInfo = new FileInfo(imagePath);
            if (fileInfo.Length > _config.MaxImageSizeBytes)
            {
                var maxMB = _config.MaxImageSizeBytes / 1024 / 1024;
                throw new GeminiProServiceException($"Görüntü dosyası çok büyük. Maksimum boyut: {maxMB} MB");
            }

            var extension = Path.GetExtension(imagePath).ToLowerInvariant();
            var contentType = DosyaUzantisindanContentTypeAl(extension);

            if (!GoruntuFormatDestekliyorMu(contentType))
            {
                throw new GeminiProServiceException($"Desteklenmeyen görüntü formatı: {extension}");
            }

            _logger.LogDebug("Görüntü dosyası doğrulandı. Dosya: {FilePath}, Boyut: {Size} bytes", 
                imagePath, fileInfo.Length);
        }

        /// <summary>
        /// Görüntü stream'ini doğrular
        /// </summary>
        /// <param name="imageStream">Görüntü stream'i</param>
        /// <param name="contentType">İçerik tipi</param>
        private void GoruntuStreamDogrula(Stream imageStream, string? contentType)
        {
            if (imageStream == null)
            {
                throw new ArgumentNullException(nameof(imageStream));
            }

            if (imageStream.Length > _config.MaxImageSizeBytes)
            {
                var maxMB = _config.MaxImageSizeBytes / 1024 / 1024;
                throw new GeminiProServiceException($"Görüntü çok büyük. Maksimum boyut: {maxMB} MB");
            }

            if (!string.IsNullOrEmpty(contentType) && !GoruntuFormatDestekliyorMu(contentType))
            {
                throw new GeminiProServiceException($"Desteklenmeyen görüntü formatı: {contentType}");
            }

            _logger.LogDebug("Görüntü stream'i doğrulandı. Boyut: {Size} bytes", imageStream.Length);
        }

        /// <summary>
        /// Görüntü formatının desteklenip desteklenmediğini kontrol eder
        /// </summary>
        /// <param name="contentType">İçerik tipi</param>
        /// <returns>Destekleniyorsa true</returns>
        private bool GoruntuFormatDestekliyorMu(string contentType)
        {
            return _config.SupportedImageFormats.Contains(contentType, StringComparer.OrdinalIgnoreCase);
        }

        /// <summary>
        /// Dosya uzantısından content type alır
        /// </summary>
        /// <param name="extension">Dosya uzantısı</param>
        /// <returns>Content type</returns>
        private string DosyaUzantisindanContentTypeAl(string extension)
        {
            return extension switch
            {
                ".jpg" or ".jpeg" => "image/jpeg",
                ".png" => "image/png",
                ".gif" => "image/gif",
                ".webp" => "image/webp",
                _ => "application/octet-stream"
            };
        }

        /// <summary>
        /// Görüntü dosyasını asenkron olarak okur
        /// </summary>
        /// <param name="imagePath">Görüntü dosya yolu</param>
        /// <returns>Dosya byte array'i</returns>
        private async Task<byte[]> GoruntuDosyasiOku(string imagePath)
        {
            try
            {
                var bytes = await File.ReadAllBytesAsync(imagePath);
                _logger.LogDebug("Görüntü dosyası okundu. Boyut: {Size} bytes", bytes.Length);
                return bytes;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Görüntü dosyası okunamadı: {FilePath}", imagePath);
                throw new GeminiProServiceException($"Görüntü dosyası okunamadı: {imagePath}", ex);
            }
        }

        /// <summary>
        /// Görüntü stream'ini asenkron olarak okur
        /// </summary>
        /// <param name="imageStream">Görüntü stream'i</param>
        /// <returns>Stream byte array'i</returns>
        private async Task<byte[]> GoruntuStreamOku(Stream imageStream)
        {
            try
            {
                using var memoryStream = new MemoryStream();
                await imageStream.CopyToAsync(memoryStream);
                var bytes = memoryStream.ToArray();
                
                _logger.LogDebug("Görüntü stream'i okundu. Boyut: {Size} bytes", bytes.Length);
                return bytes;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Görüntü stream'i okunamadı");
                throw new GeminiProServiceException("Görüntü stream'i okunamadı.", ex);
            }
        }

        #endregion

        #region API İstek Oluşturma

        /// <summary>
        /// Gemini API için istek payload'ını oluşturur
        /// </summary>
        /// <param name="request">API istek modeli</param>
        /// <returns>JSON string</returns>
        private string ApiIstekPayloadOlustur(GeminiApiRequest request)
        {
            var parts = new List<object>
            {
                new { text = request.Prompt }
            };

            // Eğer görüntü varsa ekle
            if (!string.IsNullOrEmpty(request.ImageBase64))
            {
                parts.Add(new
                {
                    inline_data = new
                    {
                        mime_type = "image/jpeg",
                        data = request.ImageBase64
                    }
                });
            }

            var requestPayload = new
            {
                contents = new[]
                {
                    new
                    {
                        role = "user",
                        parts = parts.ToArray()
                    }
                },
                generation_config = new
                {
                    temperature = request.Temperature,
                    top_p = request.TopP,
                    candidate_count = request.CandidateCount
                }
            };

            var json = JsonSerializer.Serialize(requestPayload);
            _logger.LogDebug("API istek payload'ı oluşturuldu. Boyut: {Size} karakter", json.Length);
            
            return json;
        }

        /// <summary>
        /// Gemini API endpoint URL'ini oluşturur
        /// </summary>
        /// <returns>API endpoint URL</returns>
        private string ApiEndpointUrlOlustur()
        {
            var url = $"https://{_config.Location}-aiplatform.googleapis.com/v1/projects/{_config.ProjectId}/locations/{_config.Location}/publishers/google/models/{_config.Model}:generateContent";
            
            _logger.LogDebug("API endpoint URL oluşturuldu: {Url}", url);
            return url;
        }

        #endregion

        #region API Yanıt İşleme

        /// <summary>
        /// Gemini API yanıtını işler
        /// </summary>
        /// <param name="responseContent">API yanıt içeriği</param>
        /// <returns>İşlenmiş API yanıtı</returns>
        private GeminiApiResponse ApiYanitIsle(string responseContent)
        {
            try
            {
                using var jsonDoc = JsonDocument.Parse(responseContent);
                var root = jsonDoc.RootElement;

                var response = new GeminiApiResponse { IsSuccessful = false };

                if (root.TryGetProperty("candidates", out var candidatesElement) && candidatesElement.GetArrayLength() > 0)
                {
                    var candidate = candidatesElement[0];
                    if (candidate.TryGetProperty("content", out var contentElement) &&
                        contentElement.TryGetProperty("parts", out var partsElement) &&
                        partsElement.GetArrayLength() > 0)
                    {
                        foreach (var part in partsElement.EnumerateArray())
                        {
                            // Text yanıtını kontrol et
                            if (part.TryGetProperty("text", out var textElement))
                            {
                                var textResponse = textElement.GetString() ?? string.Empty;
                                response.Text = textResponse;
                                response.IsSuccessful = true;
                                
                                _logger.LogDebug("API text yanıtı bulundu. Uzunluk: {Length} karakter", textResponse.Length);

                                // Text response'da koordinat bilgileri var mı kontrol et
                                const string coordPrefix = "GLASSES_POSITION:";
                                const string positionPrefix = "POSITION_DATA:";
                                
                                if (textResponse.Contains(coordPrefix))
                                {
                                    var coordStartIndex = textResponse.IndexOf(coordPrefix) + coordPrefix.Length;
                                    var coordData = textResponse.Substring(coordStartIndex).Trim();
                                    response.ImageData = coordData; // Koordinat verilerini ImageData'ya koy
                                    _logger.LogDebug("Text response'da koordinat bilgileri bulundu: {Data}", coordData);
                                }
                                else if (textResponse.Contains(positionPrefix))
                                {
                                    var posStartIndex = textResponse.IndexOf(positionPrefix) + positionPrefix.Length;
                                    var posData = textResponse.Substring(posStartIndex).Trim();
                                    response.ImageData = posData; // Pozisyon verilerini ImageData'ya koy
                                    _logger.LogDebug("Text response'da pozisyon bilgileri bulundu: {Data}", posData);
                                }
                            }

                            // Görüntü yanıtını kontrol et (eğer varsa)
                            if (part.TryGetProperty("inline_data", out var inlineDataElement) &&
                                inlineDataElement.TryGetProperty("data", out var dataElement))
                            {
                                response.ImageData = dataElement.GetString();
                                _logger.LogDebug("API inline_data görüntü yanıtı bulundu");
                            }
                        }
                    }
                }

                if (!response.IsSuccessful)
                {
                    response.ErrorMessage = "API yanıtı beklenmedik format";
                    _logger.LogWarning("API yanıtı beklenmedik format: {Response}", responseContent);
                }

                return response;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "API yanıtı işlenirken hata oluştu");
                return new GeminiApiResponse
                {
                    IsSuccessful = false,
                    ErrorMessage = ex.Message
                };
            }
        }

        #endregion

        #region Yeniden Deneme Mekanizması

        /// <summary>
        /// Yeniden deneme mekanizması ile görüntü işler
        /// </summary>
        /// <param name="imageBytes">Görüntü byte array'i</param>
        /// <param name="prompt">İşleme promptu</param>
        /// <returns>İşlem sonucu</returns>
        private async Task<ImageProcessingResult> YenidenDenemeMekanizmasiIleGoruntuIsle(byte[] imageBytes, string prompt)
        {
            var attempt = 0;
            Exception? lastException = null;

            while (attempt < _config.MaxRetryAttempts)
            {
                try
                {
                    attempt++;
                    _logger.LogDebug("Gemini API çağrısı. Deneme: {Attempt}/{MaxAttempts}", attempt, _config.MaxRetryAttempts);

                    return await GoruntuIsle(imageBytes, prompt);
                }
                catch (HttpRequestException ex) when (ex.Message.Contains("timeout") || ex.Message.Contains("unavailable"))
                {
                    lastException = ex;
                    _logger.LogWarning(ex, "Gemini API geçici hatası. Deneme: {Attempt}/{MaxAttempts}. Hata: {Error}",
                        attempt, _config.MaxRetryAttempts, ex.Message);

                    if (attempt < _config.MaxRetryAttempts)
                    {
                        var delay = TimeSpan.FromSeconds(_config.RetryDelaySeconds * attempt);
                        _logger.LogInformation("Yeniden deneme öncesi bekleme: {Delay} saniye", delay.TotalSeconds);
                        await Task.Delay(delay);
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Gemini API kalıcı hatası. Deneme: {Attempt}", attempt);
                    throw new GeminiProServiceException($"Gemini API hatası: {ex.Message}", ex);
                }
            }

            throw new GeminiProServiceException($"Gemini API {_config.MaxRetryAttempts} deneme sonrası başarısız oldu.", lastException);
        }

        #endregion

        #region Ana İşleme Metotları

        /// <summary>
        /// Görüntüyü işler (ana metot)
        /// </summary>
        /// <param name="imageBytes">Görüntü byte array'i</param>
        /// <param name="prompt">İşleme promptu</param>
        /// <returns>İşlenmiş görüntü byte array'i</returns>
        private async Task<ImageProcessingResult> GoruntuIsle(byte[] imageBytes, string prompt)
        {
            try
            {
                var base64Image = Convert.ToBase64String(imageBytes);
                var accessToken = await AccessTokenAl();

                // Gemini için optimize edilmiş prompt
                var optimizedPrompt = PromptOptimizeEt(prompt);

                var apiRequest = new GeminiApiRequest
                {
                    Prompt = optimizedPrompt,
                    ImageBase64 = base64Image,
                    Temperature = _config.Temperature,
                    TopP = _config.TopP,
                    CandidateCount = _config.SampleCount
                };

                var requestJson = ApiIstekPayloadOlustur(apiRequest);
                var content = new StringContent(requestJson, Encoding.UTF8, "application/json");
                var url = ApiEndpointUrlOlustur();

                _httpClient.DefaultRequestHeaders.Authorization = 
                    new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", accessToken);

                var response = await _httpClient.PostAsync(url, content);
                var responseContent = await response.Content.ReadAsStringAsync();

                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogError("Gemini API hatası. Status: {StatusCode}, Response: {Response}, URL: {Url}", 
                        response.StatusCode, responseContent, url);
                    throw new GeminiProServiceException($"Gemini API hatası: {response.StatusCode} - {responseContent}. URL: {url}");
                }

                var apiResponse = ApiYanitIsle(responseContent);

                if (!apiResponse.IsSuccessful)
                {
                    throw new GeminiProServiceException($"API yanıtı işlenemedi: {apiResponse.ErrorMessage}");
                }

                // Gemini model görüntü işleme sonucunu kontrol et
                if (!string.IsNullOrEmpty(apiResponse.ImageData))
                {
                    var resultBytes = Convert.FromBase64String(apiResponse.ImageData);
                    _logger.LogInformation("Gemini görüntü işleme başarılı. Modifiye edilmiş görüntü boyutu: {Size} bytes", resultBytes.Length);
                    return new ImageProcessingResult { ImageBytes = resultBytes, TextResponse = apiResponse.Text, IsSuccessful = true };
                }

                // Eğer koordinat data'sı yoksa, standart text yanıtı almış demektir  
                _logger.LogInformation("Gemini text yanıtı: {Response}", apiResponse.Text);
                
                // Koordinat bilgisi bulunamadı ama başarılı bir yanıt
                return new ImageProcessingResult { ImageBytes = imageBytes, TextResponse = apiResponse.Text, IsSuccessful = true };
            }
            catch (Exception ex) when (!(ex is GeminiProServiceException))
            {
                _logger.LogError(ex, "Görüntü işleme hatası");
                throw new GeminiProServiceException($"Görüntü işleme hatası: {ex.Message}", ex);
            }
        }

        /// <summary>
        /// Prompt'u optimize eder
        /// </summary>
        /// <param name="prompt">Orijinal prompt</param>
        /// <returns>Optimize edilmiş prompt</returns>
        private string PromptOptimizeEt(string prompt)
        {
            return $"Analyze this image for adding {prompt}. Return position coordinates in this format: GLASSES_POSITION:x=[pixel],y=[pixel],width=[pixel],height=[pixel],rotation=[degrees],type=[style]";
        }

        /// <summary>
        /// Gelişmiş prompt optimize eder
        /// </summary>
        /// <param name="prompt">Orijinal prompt</param>
        /// <returns>Gelişmiş optimize edilmiş prompt</returns>
        private string GelismisPromptOptimizeEt(string prompt)
        {
            return $"Analyze face for {prompt} placement. Return: POSITION_DATA:x,y,width,height,angle,style";
        }

        #endregion

        #region Dış Arayüz Metotları

        /// <summary>
        /// Dosya yolu ile görüntü işler
        /// </summary>
        /// <param name="imagePath">Görüntü dosya yolu</param>
        /// <param name="prompt">İşleme promptu</param>
        /// <returns>İşlenmiş görüntü byte array'i</returns>
        public async Task<ImageProcessingResult> EnhanceImageWithPrompt(string imagePath, string prompt)
        {
            _logger.LogInformation("Görüntü işleme başlatılıyor. Dosya: {ImagePath}", imagePath);

            try
            {
                GoruntuDosyasiDogrula(imagePath);
                var imageBytes = await GoruntuDosyasiOku(imagePath);
                var result = await YenidenDenemeMekanizmasiIleGoruntuIsle(imageBytes, prompt);

                _logger.LogInformation("Görüntü işleme başarıyla tamamlandı. Sonuç boyutu: {Size} bytes", result.ImageBytes.Length);
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Görüntü işleme sırasında hata oluştu. Dosya: {ImagePath}", imagePath);
                throw;
            }
        }

        /// <summary>
        /// Stream ile görüntü işler
        /// </summary>
        /// <param name="imageStream">Görüntü stream'i</param>
        /// <param name="prompt">İşleme promptu</param>
        /// <param name="contentType">İçerik tipi</param>
        /// <returns>İşlenmiş görüntü byte array'i</returns>
        public async Task<ImageProcessingResult> EnhanceImageWithPrompt(Stream imageStream, string prompt, string? contentType = null)
        {
            _logger.LogInformation("Stream'den görüntü işleme başlatılıyor. ContentType: {ContentType}", contentType);

            try
            {
                GoruntuStreamDogrula(imageStream, contentType);
                var imageBytes = await GoruntuStreamOku(imageStream);
                var result = await YenidenDenemeMekanizmasiIleGoruntuIsle(imageBytes, prompt);

                _logger.LogInformation("Stream'den görüntü işleme başarıyla tamamlandı. Sonuç boyutu: {Size} bytes", result.ImageBytes.Length);
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Stream'den görüntü işleme sırasında hata oluştu");
                throw;
            }
        }

        /// <summary>
        /// Gelişmiş analiz prompt ile görüntü işler
        /// </summary>
        /// <param name="imageStream">Görüntü stream'i</param>
        /// <param name="prompt">İşleme promptu</param>
        /// <param name="contentType">İçerik tipi</param>
        /// <returns>İşlenmiş görüntü byte array'i</returns>
        public async Task<ImageProcessingResult> EnhanceImageWithAnalysisPrompt(Stream imageStream, string prompt, string? contentType = null)
        {
            _logger.LogInformation("Gemini gelişmiş yaklaşım ile görüntü işleme başlatılıyor");

            try
            {
                GoruntuStreamDogrula(imageStream, contentType);
                var imageBytes = await GoruntuStreamOku(imageStream);

                // Gelişmiş prompt kullan
                var advancedPrompt = GelismisPromptOptimizeEt(prompt);
                var result = await YenidenDenemeMekanizmasiIleGoruntuIsle(imageBytes, advancedPrompt);

                _logger.LogInformation("Gemini gelişmiş görüntü işleme başarıyla tamamlandı. Sonuç boyutu: {Size} bytes", result.ImageBytes.Length);
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Gemini gelişmiş görüntü işleme sırasında hata oluştu");
                throw;
            }
        }

        /// <summary>
        /// Mevcut modelleri getirir
        /// </summary>
        /// <returns>Model listesi</returns>
        public async Task<string[]> GetAvailableModelsAsync()
        {
            await Task.Delay(1); // Async method için
            
            _logger.LogDebug("Mevcut model listesi istendi");
            
            // Image generation destekleyen Gemini modelleri
            return new[] { _config.Model, "gemini-2.5-pro", "gemini-1.5-pro", "gemini-1.5-flash", "gemini-pro-vision" };
        }

        #endregion
    }
}
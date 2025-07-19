using FaceGlassesApi.Models; // Modelleri kullanmak için
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Net.Http;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace FaceGlassesApi.Services
{
    public class GeminiProService
    {
        private readonly GoogleGeminiApiConfiguration _config;
        private readonly ILogger<GeminiProService> _logger;
        private readonly HttpClient _httpClient;

        public GeminiProService(
            IOptions<GoogleGeminiApiConfiguration> config,
            ILogger<GeminiProService> logger,
            HttpClient httpClient)
        {
            _config = config.Value;
            _logger = logger;
            _httpClient = httpClient;

            YapilandirmaDogrula();
            HttpClientAyarla();
        }

        private void YapilandirmaDogrula()
        {
            if (string.IsNullOrEmpty(_config.ApiKey))
            {
                var hata = "API Key yapılandırması gerekli.";
                _logger.LogError(hata);
                throw new GeminiProServiceException(hata);
            }

            if (string.IsNullOrEmpty(_config.ModelName))
            {
                var hata = "ModelName yapılandırması gerekli.";
                _logger.LogError(hata);
                throw new GeminiProServiceException(hata);
            }

            _logger.LogInformation("GeminiProService yapılandırması doğrulandı. ModelName: {ModelName}, BaseUrl: {BaseUrl}",
                _config.ModelName, _config.BaseUrl);
        }

        private void HttpClientAyarla()
        {
            _httpClient.Timeout = TimeSpan.FromMinutes(_config.RequestTimeoutMinutes);
            _httpClient.DefaultRequestHeaders.Add("User-Agent", "FaceGlassesApi/1.0");
            _logger.LogDebug("HTTP client ayarları tamamlandı. Timeout: {Timeout} dakika", _config.RequestTimeoutMinutes);
        }

        /// <summary>
        /// Gemini API için istek payload'ını oluşturur (contents/generation_config yapısı).
        /// Birden fazla görsel girdisini destekler.
        /// </summary>
        private string CreateGeminiPayload(GeminiApiRequest request)
        {
            var parts = new List<object>();

            // Önce metin prompt'u ekle
            parts.Add(new { text = request.Prompt });

            // Ardından tüm görsel girdilerini ekle
            foreach (var imgInput in request.ImageInputs)
            {
                if (!string.IsNullOrEmpty(imgInput.Base64Data))
                {
                    parts.Add(new
                    {
                        inline_data = new
                        {
                            mime_type = imgInput.MimeType,
                            data = imgInput.Base64Data
                        }
                    });
                }
            }

            var requestPayload = new
            {
                contents = new[]
                {
                    new
                    {
                        role = "user", // Kullanıcı rolü
                        parts = parts.ToArray()
                    }
                },
                generation_config = new Dictionary<string, object>
                {
                    { "temperature", request.Temperature },
                    { "top_p", request.TopP },
                    { "candidate_count", request.CandidateCount },
                    // Modelin hem TEXT hem IMAGE beklediğini belirtiyoruz.
                    { "response_modalities", new[] { "TEXT", "IMAGE" } }
                }
            };

            var json = JsonSerializer.Serialize(requestPayload);
            _logger.LogDebug("Gemini API payload oluşturuldu (contents/generation_config). Boyut: {Size} karakter", json.Length);
            return json;
        }

        /// <summary>
        /// Gemini API endpoint URL'ini oluşturur (API anahtarı ile).
        /// </summary>
        private string CreateGeminiEndpointUrl()
        {
            return $"{_config.BaseUrl}/models/{_config.ModelName}:generateContent?key={_config.ApiKey}";
        }

        /// <summary>
        /// Gemini API yanıtını işler.
        /// Hem metin hem de görsel çıktıyı ayrıştırır.
        /// </summary>
        private GeminiApiResponse ProcessGeminiApiResponse(string responseContent)
        {
            // response değişkenini try-catch bloğunun dışında tanımla
            var response = new GeminiApiResponse { IsSuccessful = false }; // <-- BURAYA TAŞINDI!

            try
            {
                // ... (metodun geri kalanı aynı, artık try bloğunda 'response' tekrar tanımlanmayacak) ...

                // Eski hali: var response = new GeminiApiResponse { IsSuccessful = false }; <-- BURAYI SİLİN!

                using var jsonDoc = JsonDocument.Parse(responseContent);
                var root = jsonDoc.RootElement;

                _logger.LogDebug("Processing API response. Root element kind: {Kind}", root.ValueKind);

                if (root.TryGetProperty("candidates", out var candidatesElement) && candidatesElement.ValueKind == JsonValueKind.Array && candidatesElement.GetArrayLength() > 0)
                {
                    var candidate = candidatesElement[0]; // İlk adayı alıyoruz
                    _logger.LogDebug("Found candidates. Candidate 0 kind: {Kind}", candidate.ValueKind);

                    if (candidate.TryGetProperty("content", out var contentElement) && contentElement.ValueKind == JsonValueKind.Object)
                    {
                        _logger.LogDebug("Found content element. Content kind: {Kind}", contentElement.ValueKind);

                        if (contentElement.TryGetProperty("parts", out var partsElement) && partsElement.ValueKind == JsonValueKind.Array && partsElement.GetArrayLength() > 0)
                        {
                            _logger.LogDebug("Found parts array with length: {Length}", partsElement.GetArrayLength());

                            foreach (var partElement in partsElement.EnumerateArray())
                            {
                                _logger.LogDebug("Processing partElement. ValueKind: {Kind}", partElement.ValueKind);

                                if (partElement.TryGetProperty("text", out var textElement) && textElement.ValueKind == JsonValueKind.String)
                                {
                                    response.Text = textElement.GetString() ?? string.Empty;
                                    _logger.LogDebug("API text yanıtı bulundu. Uzunluk: {Length} karakter. Text: {Text}", response.Text.Length, response.Text);
                                }

                                if (partElement.TryGetProperty("inlineData", out var inlineDataElement) && inlineDataElement.ValueKind == JsonValueKind.Object)
                                {
                                    if (inlineDataElement.TryGetProperty("data", out var dataElement) && dataElement.ValueKind == JsonValueKind.String)
                                    {
                                        response.ImageBase64Output = dataElement.GetString();
                                        _logger.LogInformation("API inline_data (görsel) yanıtı başarıyla bulundu. Görsel boyutu: {Length} byte (Base64)", response.ImageBase64Output?.Length ?? 0);
                                    }
                                    else
                                    {
                                        _logger.LogWarning("inline_data bulundu ancak 'data' özelliği yok veya string değil. Data kind: {Kind}", dataElement.ValueKind);
                                    }
                                }
                            }

                            if (!string.IsNullOrEmpty(response.Text) || !string.IsNullOrEmpty(response.ImageBase64Output))
                            {
                                response.IsSuccessful = true;
                                _logger.LogDebug("Response successfully processed with text or image data.");
                            }
                        }
                        else
                        {
                            _logger.LogWarning("Content element found but 'parts' is not an array or is empty. Parts kind: {Kind}, Length: {Length}", partsElement.ValueKind, partsElement.ValueKind == JsonValueKind.Array ? partsElement.GetArrayLength() : 0);
                        }
                    }
                    else
                    {
                        _logger.LogWarning("Candidate 0 found but 'content' element not found or not an object. Content kind: {Kind}", contentElement.ValueKind);
                    }
                }
                else if (root.TryGetProperty("error", out var errorElement) && errorElement.ValueKind == JsonValueKind.Object)
                {
                    response.ErrorMessage = errorElement.TryGetProperty("message", out var msgElement) ? msgElement.GetString() : "Bilinmeyen hata mesajı.";
                    _logger.LogError("API yanıtında hata kodu bulundu: {Message}. Status: {Status}", response.ErrorMessage, errorElement.TryGetProperty("status", out var statusElement) ? statusElement.GetString() : "Bilinmiyor");
                }
                else
                {
                    _logger.LogWarning("API yanıtında 'candidates' dizisi bulunamadı veya boş. Ya da kök eleman beklenmedik bir formatta. Response content: {Content}", responseContent);
                    response.ErrorMessage = "API yanıtı beklenmedik format veya boş.";
                }

                return response;
            }
            catch (Exception ex)
            {
                // response değişkeni artık try bloğunun dışında tanımlandığı için burada erişilebilir.
                _logger.LogError(ex, "API yanıtı işlenirken hata oluştu. Yanıt içeriği: {ResponseContent}", responseContent);
                response.IsSuccessful = false;
                response.ErrorMessage = $"Genel işleme hatası: {ex.Message}";
                return response;
            }
        }

        private async Task<GeminiApiResponse> ExecuteApiCallWithRetry(string requestJson, string url)
        {
            var attempt = 0;
            Exception? lastException = null;

            while (attempt < _config.MaxRetryAttempts)
            {
                try
                {
                    attempt++;
                    _logger.LogDebug("Gemini API çağrısı. Deneme: {Attempt}/{MaxAttempts}, URL: {Url}", attempt, _config.MaxRetryAttempts, url);

                    var content = new StringContent(requestJson, Encoding.UTF8, "application/json");
                    var response = await _httpClient.PostAsync(url, content);
                    var responseContent = await response.Content.ReadAsStringAsync();

                    if (!response.IsSuccessStatusCode)
                    {
                        _logger.LogError("Gemini API hatası. Status: {StatusCode}, Response: {Response}, URL: {Url}",
                            response.StatusCode, responseContent, url);
                        throw new GeminiProServiceException($"Gemini API hatası: {response.StatusCode} - {responseContent}. URL: {url}");
                    }

                    return ProcessGeminiApiResponse(responseContent);
                }
                catch (HttpRequestException ex) when (ex.Message.Contains("timeout") || ex.Message.Contains("unavailable") || (int?)ex.StatusCode >= 400)
                {
                    lastException = ex;
                    _logger.LogWarning(ex, "Gemini API geçici hatası veya Bad Request. Deneme: {Attempt}/{MaxAttempts}. Hata: {Error}",
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

        /// <summary>
        /// Gemini modelini kullanarak bir görüntü üzerinde işlem yapar (analiz, oluşturma veya düzenleme).
        /// Birden fazla girdi görselini destekler (örn: insan görseli + gözlük görseli).
        /// </summary>
        /// <param name="prompt">Görsel işlemi için metin talimatı.</param>
        /// <param name="imageInputs">İşlem yapılacak görsellerin listesi (Base64 ve MIME tipi).</param>
        /// <returns>Gemini'dan gelen yanıtı içeren GeminiApiResponse (ImageBase64Output'ta resim Base64 olabilir).</returns>
        public async Task<GeminiApiResponse> PerformImageOperationWithGeminiKeyAsync(
            string prompt,
            List<ImagePart> imageInputs)
        {
            var apiRequest = new GeminiApiRequest
            {
                Prompt = prompt,
                ImageInputs = imageInputs, // Görsel girdileri listesi
                Temperature = _config.Temperature,
                TopP = _config.TopP,
                CandidateCount = 1
            };

            var requestJson = CreateGeminiPayload(apiRequest);
            var url = CreateGeminiEndpointUrl();

            return await ExecuteApiCallWithRetry(requestJson, url);
        }
    }
}
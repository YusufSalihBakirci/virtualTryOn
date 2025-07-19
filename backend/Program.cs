// Program.cs
using FaceGlassesApi.Models;
using FaceGlassesApi.Services;
// Art�k SixLabors.ImageSharp'a veya ilgili DI ayarlar�na gerek yok.
// using SixLabors.ImageSharp.Web.DependencyInjection;

var builder = WebApplication.CreateBuilder(args);

// Yeni konfig�rasyon s�n�f�n� ekle
builder.Services.Configure<GoogleGeminiApiConfiguration>(builder.Configuration.GetSection("GoogleGeminiApi"));

builder.Services.AddHttpClient();
// GeminiProService'in yeni ba��ml�l�klar�n� kullan
builder.Services.AddScoped<GeminiProService>();


builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();


var app = builder.Build();



app.UseHttpsRedirection();

// Statik dosya sunucusu ayarlar� da art�k gerekli de�il (G�zl�k resimleri i�in)
// app.UseStaticFiles(new StaticFileOptions
// {
//     FileProvider = new PhysicalFileProvider(Path.Combine(builder.Environment.ContentRootPath, "GlassesImages")),
//     RequestPath = "/glasses-images"
// });

app.UseAuthorization();

app.MapControllers();

app.Run();
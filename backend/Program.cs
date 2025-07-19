// Program.cs
using FaceGlassesApi.Models;
using FaceGlassesApi.Services;
// Artýk SixLabors.ImageSharp'a veya ilgili DI ayarlarýna gerek yok.
// using SixLabors.ImageSharp.Web.DependencyInjection;

var builder = WebApplication.CreateBuilder(args);

// Yeni konfigürasyon sýnýfýný ekle
builder.Services.Configure<GoogleGeminiApiConfiguration>(builder.Configuration.GetSection("GoogleGeminiApi"));

builder.Services.AddHttpClient();
// GeminiProService'in yeni baðýmlýlýklarýný kullan
builder.Services.AddScoped<GeminiProService>();


builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();


var app = builder.Build();



app.UseHttpsRedirection();

// Statik dosya sunucusu ayarlarý da artýk gerekli deðil (Gözlük resimleri için)
// app.UseStaticFiles(new StaticFileOptions
// {
//     FileProvider = new PhysicalFileProvider(Path.Combine(builder.Environment.ContentRootPath, "GlassesImages")),
//     RequestPath = "/glasses-images"
// });

app.UseAuthorization();

app.MapControllers();

app.Run();
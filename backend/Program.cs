// Program.cs
using FaceGlassesApi.Models;
using FaceGlassesApi.Services;


var builder = WebApplication.CreateBuilder(args);

// Yeni konfigürasyon sýnýfýný ekle
builder.Services.Configure<GoogleGeminiApiConfiguration>(builder.Configuration.GetSection("GoogleGeminiApi"));

builder.Services.AddHttpClient();

builder.Services.AddScoped<GeminiProService>();


builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();


var app = builder.Build();



app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
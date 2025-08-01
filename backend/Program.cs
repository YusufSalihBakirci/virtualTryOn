// Program.cs
using FaceGlassesApi.Models;
using FaceGlassesApi.Services;


var builder = WebApplication.CreateBuilder(args);

// Yeni konfig�rasyon s�n�f�n� ekle
builder.Services.Configure<GoogleGeminiApiConfiguration>(builder.Configuration.GetSection("GoogleGeminiApi"));

builder.Services.AddHttpClient();

builder.Services.AddScoped<GeminiProService>();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});


builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();


var app = builder.Build();



app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseAuthorization();
app.UseCors();

app.MapControllers();

app.Run();
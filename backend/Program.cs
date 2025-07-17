using FaceGlassesApp.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// GeminiProService configuration'ı ekle
builder.Services.Configure<GeminiProServiceConfiguration>(
    builder.Configuration.GetSection("GeminiProService"));

// Register HttpClient
builder.Services.AddHttpClient<GeminiProService>();

// GeminiProService'i kaydet
builder.Services.AddScoped<GeminiProService>();

var app = builder.Build();

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
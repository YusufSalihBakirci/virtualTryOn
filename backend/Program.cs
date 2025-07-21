// Program.cs
using FaceGlassesApi.Models;
using FaceGlassesApi.Services;
using MongoDB.Driver;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Options;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Configuration sections
builder.Services.Configure<GoogleGeminiApiConfiguration>(builder.Configuration.GetSection("GoogleGeminiApi"));
builder.Services.Configure<MongoDbConfiguration>(builder.Configuration.GetSection("MongoDB"));
builder.Services.Configure<JwtConfiguration>(builder.Configuration.GetSection("Jwt"));

// MongoDB Configuration
builder.Services.AddSingleton<IMongoClient>(serviceProvider =>
{
    var config = builder.Configuration.GetSection("MongoDB").Get<MongoDbConfiguration>();
    return new MongoClient(config!.ConnectionString);
});

builder.Services.AddSingleton<IMongoDatabase>(serviceProvider =>
{
    var client = serviceProvider.GetRequiredService<IMongoClient>();
    var config = builder.Configuration.GetSection("MongoDB").Get<MongoDbConfiguration>();
    return client.GetDatabase(config!.DatabaseName);
});

// JWT Authentication Configuration
var jwtConfig = builder.Configuration.GetSection("Jwt").Get<JwtConfiguration>();
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtConfig!.Issuer,
        ValidAudience = jwtConfig.Audience,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(jwtConfig.SecretKey)),
        ClockSkew = TimeSpan.Zero
    };
});

// CORS Configuration
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localhost:3000") // Vite ve CRA default portları
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// Services
builder.Services.AddHttpClient();
builder.Services.AddScoped<GeminiProService>();
builder.Services.AddScoped<AuthenticationService>();

// Controllers with JSON Configuration
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = null; // PascalCase kullan
        options.JsonSerializerOptions.WriteIndented = true; // Pretty JSON
    });
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// CORS middleware should be before Authentication
app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Veritabanı ve Collection kontrolü
await EnsureDatabaseCollections(app);

app.Run();

static async Task EnsureDatabaseCollections(WebApplication app)
{
    using var scope = app.Services.CreateScope();
    var database = scope.ServiceProvider.GetRequiredService<IMongoDatabase>();
    var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
    var mongoConfig = scope.ServiceProvider.GetRequiredService<IOptions<MongoDbConfiguration>>().Value;
    
    try
    {
        // Mevcut collection'ları listele
        var collections = await database.ListCollectionNamesAsync();
        var collectionList = await collections.ToListAsync();
        
        if (!collectionList.Contains(mongoConfig.UsersCollectionName))
        {
            // Users collection oluştur
            await database.CreateCollectionAsync(mongoConfig.UsersCollectionName);
            logger.LogInformation("'{CollectionName}' collection oluşturuldu", mongoConfig.UsersCollectionName);
            
            // Index oluştur (email için unique index)
            var usersCollection = database.GetCollection<User>(mongoConfig.UsersCollectionName);
            var indexKeys = Builders<User>.IndexKeys.Ascending(x => x.Email);
            var indexOptions = new CreateIndexOptions { Unique = true };
            await usersCollection.Indexes.CreateOneAsync(new CreateIndexModel<User>(indexKeys, indexOptions));
            logger.LogInformation("Email unique index oluşturuldu");
        }
        else
        {
            logger.LogInformation("'{CollectionName}' collection zaten mevcut", mongoConfig.UsersCollectionName);
        }
        
        logger.LogInformation("Veritabanı: {DatabaseName}", database.DatabaseNamespace.DatabaseName);
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "Veritabanı collection kontrolü sırasında hata oluştu");
    }
}
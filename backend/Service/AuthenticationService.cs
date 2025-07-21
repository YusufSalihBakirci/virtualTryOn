using MongoDB.Driver;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using FaceGlassesApi.Models;
using BCrypt.Net;
using Microsoft.Extensions.Options;

namespace FaceGlassesApi.Services
{
    public class AuthenticationService
    {
        private readonly IMongoCollection<User> _usersCollection;
        private readonly JwtConfiguration _jwtConfig;

        public AuthenticationService(
            IMongoDatabase database,
            IOptions<JwtConfiguration> jwtConfig,
            IOptions<MongoDbConfiguration> mongoConfig)
        {
            _usersCollection = database.GetCollection<User>(mongoConfig.Value.UsersCollectionName);
            _jwtConfig = jwtConfig.Value;
        }

        public async Task<LoginResponse> LoginAsync(LoginRequest loginRequest)
        {
            try
            {
                // Kullanıcıyı e-posta ile bul
                var user = await _usersCollection
                    .Find(u => u.Email.ToLower() == loginRequest.Email.ToLower() && u.IsActive)
                    .FirstOrDefaultAsync();

                if (user == null)
                {
                    return new LoginResponse
                    {
                        Success = false,
                        Message = "Geçersiz e-posta veya şifre"
                    };
                }

                // Şifre doğrulama
                if (!BCrypt.Net.BCrypt.Verify(loginRequest.Password, user.Password))
                {
                    return new LoginResponse
                    {
                        Success = false,
                        Message = "Geçersiz e-posta veya şifre"
                    };
                }

                // Son giriş zamanını güncelle
                var update = Builders<User>.Update.Set(u => u.LastLoginAt, DateTime.UtcNow);
                await _usersCollection.UpdateOneAsync(u => u.Id == user.Id, update);

                // JWT token oluştur
                var token = GenerateJwtToken(user);

                return new LoginResponse
                {
                    Success = true,
                    Message = "Giriş başarılı",
                    Token = token,
                    User = new UserDto
                    {
                        Id = user.Id,
                        Email = user.Email,
                        Name = user.Name,
                        Role = user.Role
                    }
                };
            }
            catch (Exception ex)
            {
                return new LoginResponse
                {
                    Success = false,
                    Message = "Giriş sırasında bir hata oluştu"
                };
            }
        }

        private string GenerateJwtToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_jwtConfig.SecretKey);

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Name, user.Name),
                new Claim(ClaimTypes.Role, user.Role),
                new Claim("userId", user.Id)
            };

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddMinutes(_jwtConfig.ExpirationMinutes),
                Issuer = _jwtConfig.Issuer,
                Audience = _jwtConfig.Audience,
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        public async Task<User?> GetUserByIdAsync(string userId)
        {
            return await _usersCollection
                .Find(u => u.Id == userId && u.IsActive)
                .FirstOrDefaultAsync();
        }

        public async Task<bool> CreateUserAsync(User user, string password)
        {
            try
            {
                // E-posta kontrolü
                var existingUser = await _usersCollection
                    .Find(u => u.Email.ToLower() == user.Email.ToLower())
                    .FirstOrDefaultAsync();

                if (existingUser != null)
                {
                    return false; // Kullanıcı zaten mevcut
                }

                // Şifreyi hash'le
                user.Password = BCrypt.Net.BCrypt.HashPassword(password);
                user.CreatedAt = DateTime.UtcNow;

                await _usersCollection.InsertOneAsync(user);
                return true;
            }
            catch
            {
                return false;
            }
        }
    }
} 
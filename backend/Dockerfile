# 1. Aşama: Build
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /app

# Proje dosyasını doğru yolla kopyala
COPY ./FaceGlassesApi.csproj ./
RUN dotnet restore

# Diğer tüm dosyaları kopyala ve publish et
COPY . ./
RUN dotnet publish -c Release -o out

# 2. Aşama: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app
COPY --from=build /app/out ./
EXPOSE 80
ENTRYPOINT ["dotnet", "FaceGlassesApi.dll"]

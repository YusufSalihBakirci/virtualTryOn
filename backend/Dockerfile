FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /app

# Doğru yolu kullanarak .csproj dosyasını kopyala
COPY FaceGlassesApi/FaceGlassesApi.csproj ./FaceGlassesApi/
WORKDIR /app/FaceGlassesApi
RUN dotnet restore

# Geri kalan her şeyi kopyala
COPY . .
RUN dotnet publish -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish ./
EXPOSE 80
ENTRYPOINT ["dotnet", "FaceGlassesApi.dll"]

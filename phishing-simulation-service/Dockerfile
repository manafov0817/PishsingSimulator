FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /app

# Copy csproj files and restore dependencies
COPY src/PishingSimulation.API/*.csproj ./src/PishingSimulation.API/
RUN dotnet restore ./src/PishingSimulation.API/PishingSimulation.API.csproj

# Copy the rest of the code
COPY . .

# Build the application
RUN dotnet publish -c Release -o out src/PishingSimulation.API/PishingSimulation.API.csproj

# Runtime image
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
COPY --from=build /app/out .

# Create directory for wwwroot if it doesn't exist
RUN mkdir -p wwwroot

# Try to copy wwwroot content if it exists
RUN if [ -d "src/PishingSimulation.API/wwwroot" ]; then \
    cp -r src/PishingSimulation.API/wwwroot/* ./wwwroot/ || echo "Failed to copy wwwroot files"; \
  else \
    echo "No wwwroot directory found"; \
  fi

# Make sure files in wwwroot directory are readable
RUN chmod -R 755 ./wwwroot || true

EXPOSE 80

# Configure for HTTP only
ENV ASPNETCORE_URLS=http://+:80
ENV ASPNETCORE_ENVIRONMENT=Production

ENTRYPOINT ["dotnet", "PishingSimulation.API.dll"]

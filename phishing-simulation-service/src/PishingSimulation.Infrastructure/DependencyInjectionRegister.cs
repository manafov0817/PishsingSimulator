using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using PishingSimulation.Core.Common;
using PishingSimulation.Core.Persistence;
using PishingSimulation.Infrastructure.Email;
using PishingSimulation.Infrastructure.Phishing;
using PishingSimulation.Infrastructure.Templates;

namespace PishingSimulation.Infrastructure
{
    public static class DependencyInjectionRegister
    {
        public static IServiceCollection AddInfrasturcutre(this IServiceCollection services,
                                                           IConfiguration configuration)
        {
            services.AddScoped<IEmailService, EmailService>();
            services.AddScoped<IPhishingAttemptService, PhishingAttemptService>();
            services.AddScoped<ITemplateService, TemplateService>();

            services.Configure<MongoDBSettings>(configuration.GetSection("MongoDBSettings"));
            services.Configure<PhishingSettings>(configuration.GetSection("PhishingSettings"));

            // Add health checks
            services.AddHealthChecks()
                    .AddMongoDb(configuration["MongoDBSettings:ConnectionString"] ?? "mongodb://localhost:27017",
                                name: "mongodb",
                                timeout: TimeSpan.FromSeconds(3),
                                tags: ["ready"]);

            return services;
        }
    }
}

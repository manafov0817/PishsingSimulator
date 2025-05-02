namespace PishingSimulation.API
{
    public static class DependencyInjectionRegister
    {
        public static IServiceCollection AddApi(this IServiceCollection services,
                                                            IConfiguration configuration)
        {
            services.AddControllers();
            services.AddEndpointsApiExplorer();
            services.AddSwaggerGen();

            // Add HTTP Client
            services.AddHttpClient();

            // Add CORS
            services.AddCors(options =>
            {
                options.AddDefaultPolicy(policy =>
                {
                    policy.AllowAnyOrigin()
                          .AllowAnyMethod()
                          .AllowAnyHeader();
                });
            });
            return services;
        }
    }
}

using PishingSimulation.API;
using PishingSimulation.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddInfrasturcutre(builder.Configuration)
                .AddApi(builder.Configuration);

var app = builder.Build();
 
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Phishing Simulation API v1");
    c.RoutePrefix = "swagger";
});

var isDocker = Environment.GetEnvironmentVariable("DOTNET_RUNNING_IN_CONTAINER") == "true";
if (!isDocker)
{
    app.UseHttpsRedirection();
}

app.UseStaticFiles();
app.UseCors();
app.UseAuthorization();

app.MapHealthChecks("/health");

app.MapControllers();
 
app.MapGet("/", () => Results.Redirect("/swagger"));

app.Run();

namespace PishingSimulation.API.Services
{
    public class TemplateService
    {
        private readonly IWebHostEnvironment _environment;
        private readonly ILogger<TemplateService> _logger;

        public TemplateService(IWebHostEnvironment environment, ILogger<TemplateService> logger)
        {
            _environment = environment;
            _logger = logger;
        }

        public async Task<string> GetTemplateAsync(string templateName)
        {
            try
            {
                string templatePath = Path.Combine(_environment.ContentRootPath, "Templates", $"{templateName}.html");

                if (!File.Exists(templatePath))
                {
                    _logger.LogWarning($"Template {templateName} not found at path: {templatePath}");
                    return string.Empty;
                }

                string templateContent = await File.ReadAllTextAsync(templatePath);
                return templateContent;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error loading template {templateName}");
                return string.Empty;
            }
        }

        public string ReplaceTemplateVariables(string template, Dictionary<string, string> variables)
        {
            if (string.IsNullOrEmpty(template))
            {
                return template;
            }

            string result = template;

            foreach (var variable in variables)
            {
                result = result.Replace($"{{{{{variable.Key}}}}}", variable.Value);
            }

            return result;
        }
    }
}

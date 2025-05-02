namespace PishingSimulation.Core.Common
{
    public interface ITemplateService
    {
        Task<string> GetTemplateAsync(string templateName);
        string ReplaceTemplateVariables(string template, Dictionary<string, string> variables);
    }
}

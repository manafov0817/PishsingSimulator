namespace PishingSimulation.Core.Common
{
    public interface IEmailService
    {
        Task<string> SendPhishingEmailAsync(string targetEmail, string emailContent, string? emailSubject = null);

        Task SendPhishingEmailAsync(string targetEmail, string emailContent, string? emailSubject, string trackingId);
    }
}

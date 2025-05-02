using Amazon.Runtime.Internal.Transform;
using MailKit.Net.Smtp;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using MimeKit;
using PishingSimulation.Core.Common;
using System.Security.Cryptography;

namespace PishingSimulation.Infrastructure.Email
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<EmailService> _logger;
        private readonly ITemplateService _templateService;
        private readonly PhishingSettings _phishingSettings;

        public EmailService(
            IConfiguration configuration,
            ILogger<EmailService> logger,
            ITemplateService templateService,
            IOptions<PhishingSettings> phishingSettings)
        {
            _configuration = configuration;
            _logger = logger;
            _templateService = templateService;
            _phishingSettings = phishingSettings.Value;
        }

        // Method with email subject support
        public async Task<string> SendPhishingEmailAsync(string targetEmail,
                                                         string emailContent,
                                                         string? emailSubject = null)
        {
            // Generate a unique tracking ID for this attempt
            var trackingId = GenerateTrackingId();

            // Send email with the generated tracking ID
            await SendPhishingEmailAsync(targetEmail, emailContent, emailSubject, trackingId);

            return trackingId;
        }

        // Overload that accepts an existing tracking ID
        public async Task SendPhishingEmailAsync(string targetEmail,
                                                 string emailContent,
                                                 string? emailSubject,
                                                 string trackingId)
        {
            try
            {
                // Create the email message
                var message = new MimeMessage();
                message.From.Add(new MailboxAddress(_configuration["EmailSettings:SenderName"],
                    _configuration["EmailSettings:SenderEmail"]));
                message.To.Add(new MailboxAddress("", targetEmail));

                // Use provided subject or default
                message.Subject = !string.IsNullOrEmpty(emailSubject)
                    ? emailSubject
                    : "Important Security Notification";

                // Create clickable tracking link
                var trackingUrl = $"{_phishingSettings.BaseUrl}/api/integration/track/{trackingId}";
 
                string htmlBody;
                if (emailContent.Contains("{{trackingUrl}}"))
                {
                    htmlBody = emailContent.Replace("{{trackingUrl}}", trackingUrl);
                }
                else
                {
                    // Load the default template and replace variables
                    var template = await _templateService.GetTemplateAsync("PhishingTemplate");
                    var variables = new Dictionary<string, string>
                    {
                        {"emailContent",emailContent },
                        { "trackingUrl", trackingUrl },
                        { "name", targetEmail.Split('@')[0] } // Use part of email as name
                    };

                    htmlBody = _templateService.ReplaceTemplateVariables(template, variables);

                    // If template loading failed, use a simple fallback with the provided content
                    if (string.IsNullOrEmpty(htmlBody))
                    {
                        htmlBody = $"<html><body>{emailContent}<br><a href='{trackingUrl}'>Click here</a></body></html>";
                    }
                }

                // Build the message body
                var bodyBuilder = new BodyBuilder
                {
                    HtmlBody = htmlBody
                };
                message.Body = bodyBuilder.ToMessageBody();

                // Send the email
                using (var client = new SmtpClient())
                {
                    // Connect to SMTP server
                    await client.ConnectAsync(
                        _configuration["EmailSettings:SmtpServer"],
                        int.Parse(_configuration["EmailSettings:SmtpPort"] ?? "2525"),
                        MailKit.Security.SecureSocketOptions.StartTls);

                    // Authenticate if needed
                    if (!string.IsNullOrEmpty(_configuration["EmailSettings:Username"]) &&
                        !string.IsNullOrEmpty(_configuration["EmailSettings:Password"]))
                    {
                        await client.AuthenticateAsync(
                            _configuration["EmailSettings:Username"],
                            _configuration["EmailSettings:Password"]);
                    }

                    // Send the email
                    await client.SendAsync(message);
                    await client.DisconnectAsync(true);
                }

                _logger.LogInformation($"Phishing email sent to {targetEmail} with tracking ID {trackingId}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Failed to send phishing email to {targetEmail}");
                throw;
            }
        }

        private string GenerateTrackingId()
        {
            // Generate a random tracking ID (16 characters)
            var randomBytes = RandomNumberGenerator.GetBytes(8);
            return Convert.ToBase64String(randomBytes).Replace("+", "").Replace("/", "").Replace("=", "");
        }
    }
}

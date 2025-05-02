using Microsoft.AspNetCore.Mvc;
using PishingSimulation.Contracts;
using PishingSimulation.Core.Common;
using PishingSimulation.Core.Persistence;

namespace PishingSimulation.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class IntegrationController : ControllerBase
    {
        private readonly IEmailService _emailService;
        private readonly IPhishingAttemptService _phishingAttemptService;
        private readonly ILogger<IntegrationController> _logger;

        public IntegrationController(IEmailService emailService,
                                     IPhishingAttemptService phishingAttemptService,
                                     ILogger<IntegrationController> logger)
        {
            _emailService = emailService;
            _phishingAttemptService = phishingAttemptService;
            _logger = logger;
        }

        [HttpPost("send")]
        public async Task<IActionResult> SendPhishingEmail([FromBody] PhishingEmailRequest request)
        {
            try
            {
                // Validate request
                if (string.IsNullOrEmpty(request.targetEmail) || string.IsNullOrEmpty(request.emailContent))
                {
                    return BadRequest("Target email and email content are required");
                }

                string trackingId;

                // If trackingId is not provided, generate one
                if (string.IsNullOrEmpty(request.trackingId))
                {
                    // Send the phishing email
                    trackingId = await _emailService.SendPhishingEmailAsync(
                        request.targetEmail,
                        request.emailContent,
                        request.emailSubject);
                }
                else
                {
                    // Use the provided tracking ID and send the email
                    trackingId = request.trackingId;
                    await _emailService.SendPhishingEmailAsync(
                        request.targetEmail,
                        request.emailContent,
                        request.emailSubject,
                        trackingId);
                }

                // Store the phishing attempt in the database
                var phishingAttempt = new PhishingAttemptEntity
                {
                    targetEmail = request.targetEmail,
                    emailSubject = request.emailSubject ?? "Phishing Test",
                    emailContent = request.emailContent,
                    trackingId = trackingId,
                    status = PhishingStatus.Sent,
                    sentAt = DateTime.UtcNow,
                    createdAt = DateTime.UtcNow,
                    updatedAt = DateTime.UtcNow
                };

                await _phishingAttemptService.CreateAsync(phishingAttempt);

                return Ok(new
                {
                    trackingId,
                    message = "Phishing email sent successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending phishing email");
                return StatusCode(500, new
                {
                    message = "Failed to send phishing email",
                    error = ex.Message
                });
            }
        }

        [HttpGet("track/{trackingId}")]
        public async Task<IActionResult> TrackPhishingLink(string trackingId)
        {
            try
            {
                // Find the phishing attempt by tracking ID
                var phishingAttempt = await _phishingAttemptService.GetByTrackingIdAsync(trackingId);

                if (phishingAttempt == null)
                {
                    return NotFound(new
                    {
                        message = $"No phishing attempt found with tracking ID {trackingId}"
                    });
                }

                // Update the status to clicked
                await _phishingAttemptService.UpdateStatusAsync(trackingId, PhishingStatus.Clicked);

                // Try to notify the NestJS server about the click if a callback URL is available
                var callbackUrl = $"{Environment.GetEnvironmentVariable("NESTJS_SERVER_URL") ?? "http://localhost:3000"}/phishing-attempts/track/{trackingId}";

                try
                {
                    using (var httpClient = new HttpClient())
                    {
                        var response = await httpClient.GetAsync(callbackUrl);
                        if (response.IsSuccessStatusCode)
                        {
                            _logger.LogInformation($"Successfully notified NestJS server about click for tracking ID {trackingId}");
                        }
                    }
                }
                catch (Exception ex)
                {
                    // Log but don't fail if callback fails
                    _logger.LogWarning(ex, $"Failed to notify NestJS server about click for tracking ID {trackingId}");
                }

                // Redirect to a safe page or display a message
                return Redirect("/phishing-awareness.html");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error tracking phishing link with ID {trackingId}");
                return StatusCode(500, new
                {
                    message = "An error occurred",
                    error = ex.Message
                });
            }
        }
    }
}

using Microsoft.AspNetCore.Mvc;
using PishingSimulation.Core.Common;
using PishingSimulation.Core.Persistence;

namespace PishingSimulation.API.Controllers
{
    [ApiController]
    [Route("api/integration")]
    public class PhishingController : ControllerBase
    {
        private readonly IPhishingAttemptService _phishingAttemptService;
        private readonly ILogger<PhishingController> _logger;

        public PhishingController(IPhishingAttemptService phishingAttemptService,
                                     ILogger<PhishingController> logger)
        {
            _phishingAttemptService = phishingAttemptService;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> GetPhishingAttempts()
        {
            try
            {
                var attempts = await _phishingAttemptService.GetAllAsync();
                return Ok(attempts);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving phishing attempts");
                return StatusCode(500, new { error = "Failed to retrieve phishing attempts", message = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<PhishingAttemptEntity>> GetPhishingAttempt(string id)
        {
            // First try to get by ID, then try by trackingId if not found
            var phishingAttempt = await _phishingAttemptService.GetByIdAsync(id);

            if (phishingAttempt == null)
            {
                // Fallback to trackingId lookup
                phishingAttempt = await _phishingAttemptService.GetByTrackingIdAsync(id);
            }

            if (phishingAttempt == null)
            {
                return NotFound();
            }

            return phishingAttempt;
        }

        [HttpGet("health")]
        public IActionResult CheckHealth()
        {
            return Ok(new { status = "Healthy", timestamp = DateTime.UtcNow });
        }
    }
}

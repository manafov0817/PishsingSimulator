using PishingSimulation.Core.Persistence;

namespace PishingSimulation.Core.Common
{
    public interface IPhishingAttemptService
    {
        Task<List<PhishingAttemptEntity>> GetAllAsync();

        Task<PhishingAttemptEntity> GetByTrackingIdAsync(string trackingId);
        
        Task<PhishingAttemptEntity> GetByIdAsync(string id);

        Task<PhishingAttemptEntity> CreateAsync(PhishingAttemptEntity phishingAttempt);

        Task UpdateStatusAsync(string trackingId, PhishingStatus status);
    }
}

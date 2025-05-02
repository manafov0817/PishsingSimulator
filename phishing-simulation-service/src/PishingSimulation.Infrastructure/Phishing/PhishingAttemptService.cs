using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using PishingSimulation.Core.Common;
using PishingSimulation.Core.Persistence;

namespace PishingSimulation.Infrastructure.Phishing
{
    public class PhishingAttemptService : IPhishingAttemptService
    {
        private readonly IMongoCollection<PhishingAttemptEntity> _phishingAttempts;
        private readonly ILogger<PhishingAttemptService> _logger;

        public PhishingAttemptService(IOptions<MongoDBSettings> mongoDBSettings,
                                      ILogger<PhishingAttemptService> logger)
        {
            _logger = logger;
            try
            {
                // Create client with explicit settings to avoid GUID representation issues
                var settings = MongoClientSettings.FromConnectionString(mongoDBSettings.Value.ConnectionString);

                // Apply custom serializers through convention instead of static registration
                var mongoClient = new MongoClient(settings);
                var mongoDatabase = mongoClient.GetDatabase(mongoDBSettings.Value.DatabaseName);

                // Configure the collection with specific serializer settings for this collection only
                var collection = mongoDatabase.GetCollection<PhishingAttemptEntity>(
                    mongoDBSettings.Value.PhishingAttemptsCollectionName);

                _phishingAttempts = collection;
                _logger.LogInformation("Connected to MongoDB successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to connect to MongoDB");
                throw;
            }
        }

        public async Task<List<PhishingAttemptEntity>> GetAllAsync()
        {
            try
            {
                return await _phishingAttempts.Find(_ => true).ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all phishing attempts");
                throw;
            }
        }

        public async Task<PhishingAttemptEntity> GetByTrackingIdAsync(string trackingId)
        {
            try
            {
                return await _phishingAttempts.Find(p => p.trackingId == trackingId).FirstOrDefaultAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting phishing attempt with tracking ID: {trackingId}");
                throw;
            }
        }

        public async Task<PhishingAttemptEntity> GetByIdAsync(string id)
        {
            try
            {
                // Check if the id is a valid ObjectId
                if (!MongoDB.Bson.ObjectId.TryParse(id, out var objectId))
                {
                    _logger.LogWarning($"Invalid ObjectId format: {id}");
                    return null;
                }

                return await _phishingAttempts.Find(p => p.id == id).FirstOrDefaultAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting phishing attempt with ID: {id}");
                throw;
            }
        }

        public async Task<PhishingAttemptEntity> CreateAsync(PhishingAttemptEntity phishingAttempt)
        {
            try
            {
                await _phishingAttempts.InsertOneAsync(phishingAttempt);
                return phishingAttempt;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating phishing attempt");
                throw;
            }
        }

        public async Task UpdateStatusAsync(string trackingId, PhishingStatus status)
        {
            try
            {
                var filter = Builders<PhishingAttemptEntity>.Filter.Eq(p => p.trackingId, trackingId);
                var update = Builders<PhishingAttemptEntity>.Update
                    .Set(p => p.status, status);

                if (status == PhishingStatus.Clicked)
                {
                    update = update.Set(p => p.clickedAt, DateTime.UtcNow);
                }

                await _phishingAttempts.UpdateOneAsync(filter, update);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error updating status for phishing attempt with tracking ID: {trackingId}");
                throw;
            }
        }
    }
}

using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace PishingSimulation.Core.Persistence
{
    public class PhishingAttemptEntity
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string id { get; set; } = null!;

        // Changed field names to match NestJS schema
        public string targetEmail { get; set; } = null!;

        public string emailSubject { get; set; } = "Phishing Test";

        public string emailContent { get; set; } = null!;

        public string trackingId { get; set; } = null!;

        public PhishingStatus status { get; set; } = PhishingStatus.Sent;

        public DateTime sentAt { get; set; } = DateTime.UtcNow;

        public DateTime? clickedAt { get; set; }

        // Added for compatibility with NestJS schema
        public DateTime createdAt { get; set; } = DateTime.UtcNow;

        public DateTime updatedAt { get; set; } = DateTime.UtcNow;

        // Added to match NestJS schema - stores the user ID who created the phishing attempt
        [BsonRepresentation(BsonType.ObjectId)]
        public string? createdBy { get; set; }

        // Added to capture any error message during email sending
        public string? errorMessage { get; set; }

        // Mongoose version key
        [BsonElement("__v")]
        public int __v { get; set; }
    }

    public enum PhishingStatus
    { 
        Sent = 1,
        Clicked = 2,
        Failed = 3
    }
}

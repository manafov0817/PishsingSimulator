namespace PishingSimulation.Core.Persistence
{
    public class MongoDBSettings
    {
        public string ConnectionString { get; set; } = null!;
        public string DatabaseName { get; set; } = null!;
        public string PhishingAttemptsCollectionName { get; set; } = null!;
    }
}

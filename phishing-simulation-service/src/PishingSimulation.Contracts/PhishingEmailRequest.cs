namespace PishingSimulation.Contracts
{
    public class PhishingEmailRequest
    {
        public string targetEmail { get; set; }
        public string emailSubject { get; set; }
        public string emailContent { get; set; }
        public string trackingId { get; set; }
        public string callbackUrl { get; set; }
    }
}

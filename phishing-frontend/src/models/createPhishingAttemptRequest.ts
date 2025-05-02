export interface CreatePhishingAttemptRequest {
  targetEmail: string;
  emailSubject: string;
  emailContent: string;
}
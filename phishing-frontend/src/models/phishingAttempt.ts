export interface PhishingAttempt {
  id: string;
  targetEmail: string;
  emailSubject: string;
  emailContent: string;
  status: 'sent' | 'clicked' | 'failed';
  sentAt?: string;
  clickedAt?: string;
  createdBy: string;
  trackingId?: string;
  createdAt: string;
  updatedAt: string;
}
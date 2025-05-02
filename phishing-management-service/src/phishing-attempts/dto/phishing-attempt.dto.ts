import { ApiProperty } from '@nestjs/swagger';
import { PhishingAttemptStatus } from '../schemas/phishing-attempt.schema';

export class PhishingAttemptDto {
  @ApiProperty({ example: '60d21b4667d0d8992e610c85' })
  id: string;

  @ApiProperty({ example: 'target@example.com' })
  targetEmail: string;

  @ApiProperty({ example: 'Urgent: Your account needs verification' })
  emailSubject: string;

  @ApiProperty({ example: 'Please click on the following link to verify your account: {link}' })
  emailContent: string;

  @ApiProperty({ enum: PhishingAttemptStatus, example: PhishingAttemptStatus.SENT })
  status: PhishingAttemptStatus;

  @ApiProperty({ example: '2025-05-01T00:30:00.000Z', required: false })
  sentAt?: Date;

  @ApiProperty({ example: '2025-05-01T00:35:00.000Z', required: false })
  clickedAt?: Date;

  @ApiProperty({ example: '60d21b4667d0d8992e610c85' })
  createdBy: string;

  @ApiProperty({ example: 'abc123', required: false })
  trackingId?: string;

  @ApiProperty({ example: '2025-05-01T00:25:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-05-01T00:25:00.000Z' })
  updatedAt: Date;
}

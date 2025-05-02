import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePhishingAttemptDto {
  @ApiProperty({
    description: 'The email address to send the phishing attempt to',
    example: 'target@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  targetEmail: string;

  @ApiProperty({
    description: 'The subject of the phishing email',
    example: 'Urgent: Your account needs verification',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  emailSubject: string;

  @ApiProperty({
    description: 'The content of the phishing email',
    example: 'Please click on the following link to verify your account: {link}',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  emailContent: string;
}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { PhishingAttemptsService } from './phishing-attempts.service';
import { PhishingAttemptsController } from './phishing-attempts.controller';
import { PhishingAttempt, PhishingAttemptSchema } from './schemas/phishing-attempt.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PhishingAttempt.name, schema: PhishingAttemptSchema },
    ]),
    HttpModule,
  ],
  providers: [PhishingAttemptsService],
  controllers: [PhishingAttemptsController],
  exports: [PhishingAttemptsService],
})
export class PhishingAttemptsModule {}

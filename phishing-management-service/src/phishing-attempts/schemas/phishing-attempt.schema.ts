import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export enum PhishingAttemptStatus { 
  SENT = 'sent',
  CLICKED = 'clicked',
  FAILED = 'failed',
}

// Interface for PhishingAttempt document with timestamps
export interface PhishingAttemptDocument extends Document {
  targetEmail: string;
  emailSubject: string;
  emailContent: string;
  status: PhishingAttemptStatus;
  sentAt?: Date;
  clickedAt?: Date;
  createdBy: MongooseSchema.Types.ObjectId | User;
  trackingId?: string;
  errorMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}

@Schema({ timestamps: true, collection: 'phishingAttempts' })
export class PhishingAttempt {
  @Prop({ required: true })
  targetEmail: string;

  @Prop({ required: true })
  emailSubject: string;

  @Prop({ required: true })
  emailContent: string;

  @Prop({
    type: String,
    enum: PhishingAttemptStatus,
    default: PhishingAttemptStatus.FAILED,
  })
  status: PhishingAttemptStatus;

  @Prop()
  sentAt?: Date;

  @Prop()
  clickedAt?: Date;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  createdBy: MongooseSchema.Types.ObjectId;

  @Prop()
  trackingId?: string;

  @Prop()
  errorMessage?: string;
}

export const PhishingAttemptSchema = SchemaFactory.createForClass(PhishingAttempt);

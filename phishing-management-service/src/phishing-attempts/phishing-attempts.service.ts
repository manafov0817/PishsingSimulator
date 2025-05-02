import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

import { CreatePhishingAttemptDto } from './dto/create-phishing-attempt.dto';
import { PhishingAttemptDto } from './dto/phishing-attempt.dto';
import {
  PhishingAttempt,
  PhishingAttemptDocument,
  PhishingAttemptStatus,
} from './schemas/phishing-attempt.schema';

// Define JwtUser interface since the import is missing
interface JwtUser {
  userId: string;
  email: string;
  username?: string;
  roles?: string[];
  // Add other potential fields based on your actual implementation
}

@Injectable()
export class PhishingAttemptsService {
  constructor(
    @InjectModel(PhishingAttempt.name)
    private phishingAttemptModel: Model<PhishingAttemptDocument>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async findAll(): Promise<PhishingAttemptDto[]> {
    try {
      // Directly query MongoDB instead of going through .NET
      const attempts = await this.phishingAttemptModel.find().exec();
      return attempts.map(attempt => this.mapToDto(attempt));
    } catch (error) {
      throw new BadRequestException(
        `Failed to fetch phishing attempts: ${error.message}`,
      );
    }
  }

  async findByUser(userId: string): Promise<PhishingAttemptDto[]> {
    try {
      // Directly query MongoDB by createdBy field
      const attempts = await this.phishingAttemptModel.find({ 
        createdBy: userId 
      }).exec();
      
      return attempts.map(attempt => this.mapToDto(attempt));
    } catch (error) {
      throw new BadRequestException(
        `Failed to fetch user phishing attempts: ${error.message}`,
      );
    }
  }

  async findById(id: string): Promise<PhishingAttemptDto> {
    try {
      // First try to find directly by ID
      let attempt: PhishingAttemptDocument | null = null;
      
      // Check if id is a valid MongoDB ObjectId
      if (Types.ObjectId.isValid(id)) {
        attempt = await this.phishingAttemptModel.findById(id).exec();
      }
      
      // If not found by ID, try tracking ID
      if (!attempt) {
        attempt = await this.phishingAttemptModel.findOne({ 
          trackingId: id 
        }).exec();
      }
      
      if (!attempt) {
        throw new NotFoundException(`Phishing attempt with ID ${id} not found`);
      }
      
      return this.mapToDto(attempt);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to fetch phishing attempt: ${error.message}`,
      );
    }
  }

  async create(
    createDto: CreatePhishingAttemptDto,
    user: JwtUser,
  ): Promise<PhishingAttemptDto> {
    const trackingId = uuidv4();

    try {
      const dotnetServerUrl = this.configService.get<string>('DOTNET_SERVER_URL');
      if (!dotnetServerUrl) {
        throw new BadRequestException('DOTNET_SERVER_URL is not configured');
      }

      const response = await firstValueFrom(
        this.httpService.post<PhishingAttemptDto>(`${dotnetServerUrl}/integration/send`, {
          targetEmail: createDto.targetEmail,
          emailSubject: createDto.emailSubject,
          emailContent: createDto.emailContent,
          trackingId,
          createdBy: user.userId,
          callbackUrl: `${this.configService.get<string>('NESTJS_SERVER_URL')}/phishing-attempts/track/${trackingId}`,
        }),
      );

      if (response && response.status === 200) {
        return response.data;
      } else {
        throw new BadRequestException('Failed to send phishing email');
      }
    } catch (error) {
      throw new BadRequestException(
        `Failed to send phishing email: ${error.message || 'Connection to phishing server failed'}`,
      );
    }
  }

  async trackClick(trackingId: string): Promise<void> {
    try {
      // Update status in MongoDB directly
      const result = await this.phishingAttemptModel.updateOne(
        { trackingId },
        { 
          $set: { 
            status: PhishingAttemptStatus.CLICKED,
            clickedAt: new Date(),
            updatedAt: new Date()
          } 
        }
      ).exec();
      
      if (result.matchedCount === 0) {
        throw new NotFoundException(`No phishing attempt found with tracking ID ${trackingId}`);
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to track phishing click: ${error.message}`,
      );
    }
  }

  // Helper method to map MongoDB document to DTO
  private mapToDto(document: PhishingAttemptDocument): PhishingAttemptDto {
    return {
      id: document._id ? document._id.toString() : '',
      targetEmail: document.targetEmail,
      emailSubject: document.emailSubject,
      emailContent: document.emailContent,
      status: document.status,
      trackingId: document.trackingId || '',
      createdBy: this.getCreatedByAsString(document.createdBy),
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
      sentAt: document.sentAt,
      clickedAt: document.clickedAt,
    };
  }
  
  // Helper method to handle createdBy field which could be string, ObjectId, or undefined
  private getCreatedByAsString(createdBy: any): string {
    if (!createdBy) {
      return '';
    }
    
    if (typeof createdBy === 'string') {
      return createdBy;
    }
    
    if (createdBy instanceof Types.ObjectId) {
      return createdBy.toString();
    }
    
    if (createdBy._id) {
      return createdBy._id.toString();
    }
    
    if (createdBy.toString && typeof createdBy.toString === 'function') {
      return createdBy.toString();
    }
    
    return '';
  }
}

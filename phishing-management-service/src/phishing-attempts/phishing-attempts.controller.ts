import { Controller, Get, Post, Body, Param, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PhishingAttemptsService } from './phishing-attempts.service';
import { CreatePhishingAttemptDto } from './dto/create-phishing-attempt.dto';
import { PhishingAttemptDto } from './dto/phishing-attempt.dto';

@ApiTags('phishing-attempts')
@Controller('phishing-attempts')
export class PhishingAttemptsController {
  constructor(private readonly phishingAttemptsService: PhishingAttemptsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all phishing attempts' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns all phishing attempts',
    type: [PhishingAttemptDto],
  })
  async findAll(): Promise<PhishingAttemptDto[]> {
    return this.phishingAttemptsService.findAll();
  }



  @Get('my-attempts')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get phishing attempts created by the current user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns phishing attempts created by the current user',
    type: [PhishingAttemptDto],
  })
  async findMyAttempts(@Request() req): Promise<PhishingAttemptDto[]> {
    return this.phishingAttemptsService.findByUser(req.user.userId);
  }



  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a phishing attempt by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns the phishing attempt',
    type: PhishingAttemptDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Phishing attempt not found',
  })
  async findById(@Param('id') id: string): Promise<PhishingAttemptDto> {
    return this.phishingAttemptsService.findById(id);
  }

  

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new phishing attempt' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The phishing attempt has been successfully created',
    type: PhishingAttemptDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input or failed to send phishing email',
  })
  async create(
    @Body() createPhishingAttemptDto: CreatePhishingAttemptDto,
    @Request() req,
  ): Promise<PhishingAttemptDto> {
    return this.phishingAttemptsService.create(createPhishingAttemptDto, req.user);
  }



  @Post('track/:trackingId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Track a phishing attempt click' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The phishing attempt has been successfully tracked',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Phishing attempt not found',
  })
  async trackClick(@Param('trackingId') trackingId: string): Promise<void> {
    await this.phishingAttemptsService.trackClick(trackingId);
  }
}

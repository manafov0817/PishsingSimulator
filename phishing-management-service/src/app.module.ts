import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PhishingAttemptsModule } from './phishing-attempts/phishing-attempts.module';
import { AppController } from './app.controller'; // Add this import
import { AppService } from './app.service'; // Add this import

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
    
    // MongoDB Connection
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
    }),
    
    // HTTP Module for communication with .NET server
    HttpModule,
    
    // Feature modules
    UsersModule,
    AuthModule,
    PhishingAttemptsModule,
  ],
  controllers: [AppController], // Register the controller
  providers: [AppService],     // Register the service
})
export class AppModule {}
# Phishing Simulation and Awareness Platform

A comprehensive security awareness platform designed to help organizations run controlled phishing simulations and educate users about security threats.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
  - [.NET Backend](#net-backend)
  - [NestJS Service](#nestjs-service)
  - [React Frontend](#react-frontend)
  - [Database](#database)
  - [Containerization](#containerization)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Features](#features)
- [API Documentation](#api-documentation)
- [Development](#development)
  - [Clean Architecture](#clean-architecture)
  - [Data Flow](#data-flow)
- [Troubleshooting](#troubleshooting)
  - [Common Issues](#common-issues)
  - [Using Mailtrap for Email Testing](#using-mailtrap-for-email-testing)
- [Contributing](#contributing)
- [License](#license)

## Overview

This Phishing Simulation platform is a microservices-based application that allows security professionals to:

- Create and manage phishing campaigns
- Send simulated phishing emails to target users
- Track user interactions with phishing emails
- Generate reports on user susceptibility to phishing attempts
- Deliver educational content to improve security awareness

The platform follows modern development practices and employs a clean architecture approach to ensure maintainability and scalability.

## Architecture

The application consists of three main components:

1. **React Frontend**: User interface for managing phishing campaigns and viewing results
2. **NestJS Management Service**: Handles phishing campaign management and serves as the API gateway
3. **.NET Backend**: Core email delivery system and phishing tracking mechanism
4. **MongoDB**: Shared database for all services

Communication between services:
- Frontend → NestJS: RESTful API calls using Redux Toolkit Query
- NestJS → MongoDB: Direct database access
- NestJS → .NET: HTTP requests for email sending functionality
- .NET → MongoDB: Direct database access

## Technology Stack

### .NET Backend

- **Framework**: .NET 9.0
- **Architecture**: Clean Architecture pattern
- **Libraries**:
  - ASP.NET Core 9.0
  - MongoDB.Driver (2.23.1)
  - MailKit (for email sending)
  
### NestJS Service

- **Framework**: NestJS
- **Language**: TypeScript
- **Libraries**:
  - Mongoose (MongoDB integration)
  - @nestjs/mongoose (Schema management)
  - @nestjs/axios (HTTP client)
  - Passport & JWT (Authentication)
  - Class-validator & class-transformer (DTO validation)
  
### React Frontend

- **Framework**: React 18
- **Build Tool**: Vite
- **Language**: TypeScript
- **State Management**: Redux Toolkit (RTK)
- **Styling**: Tailwind CSS
- **Libraries**:
  - React Router
  - RTK Query (API integration)
  - React Hook Form (form handling)
  - Chart.js (data visualization)

### Database

- **MongoDB**: Document-based NoSQL database
- **Collections**:
  - phishingAttempts
  - users
  - templates

### Containerization

- **Docker**: Container platform
- **Docker Compose**: Multi-container orchestration
- **Nginx**: Web server for React frontend
- **Images**:
  - Frontend: Node.js (build) + Nginx (serve)
  - NestJS: Node.js
  - .NET: Microsoft .NET SDK and ASP.NET runtime
  - Database: MongoDB official image

## Getting Started

### Prerequisites

- Docker Engine (20.10.x or higher)
- Docker Compose (2.0.x or higher)
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/phishing-simulation-app.git
   cd phishing-simulation-app
   ```

2. Configure environment variables (optional):
   ```bash
   # Create a .env file in the root directory (optional, defaults are provided)
   touch .env
   
   # Add any custom environment variables
   echo "JWT_SECRET=your_custom_secret" >> .env
   echo "MONGODB_URI=mongodb://mongodb:27017/phishingdb" >> .env
   ```

### Running the Application

1. Build and start all services:
   ```bash
   docker-compose up -d
   ```

2. Access the applications:
   - Frontend: http://localhost:5173
   - NestJS API: http://localhost:3000
   - .NET API: http://localhost:5000

3. Stop the application:
   ```bash
   docker-compose down
   ```

4. Stop and remove volumes (for a clean start):
   ```bash
   docker-compose down -v
   ```

## Project Structure

```
phishing-simulation-app/
│
├── phishing-frontend/           # React frontend application
│   ├── public/                  # Static assets
│   ├── src/                     # Source code
│   │   ├── assets/              # Images, fonts, etc.
│   │   ├── components/          # Reusable components
│   │   ├── features/            # Feature-based modules
│   │   ├── services/            # API services
│   │   ├── store/               # Redux store
│   │   ├── App.tsx              # Main application component
│   │   └── main.tsx             # Entry point
│   ├── Dockerfile               # Docker configuration
│   ├── nginx.conf               # Nginx configuration
│   ├── package.json             # Dependencies
│   ├── tsconfig.json            # TypeScript configuration
│   └── vite.config.ts           # Vite configuration
│
├── phishing-management-service/ # NestJS service
│   ├── src/
│   │   ├── auth/                # Authentication module
│   │   ├── phishing-attempts/   # Phishing attempts module
│   │   ├── users/               # Users module
│   │   ├── app.module.ts        # Application module
│   │   └── main.ts              # Entry point
│   ├── Dockerfile               # Docker configuration
│   └── package.json             # Dependencies
│
├── phishing-simulation-service/ # .NET Core service
│   ├── src/
│   │   ├── PishingSimulation.API/          # API layer
│   │   ├── PishingSimulation.Core/         # Core business logic
│   │   ├── PishingSimulation.Infrastructure/# Infrastructure concerns
│   │   └── PishingSimulation.Contracts/    # Shared models
│   ├── Dockerfile               # Docker configuration
│   └── PishingSimulation.sln    # Solution file
│
├── docker-compose.yml           # Docker Compose configuration
└── README.md                    # Project documentation
```

## Features

- **Phishing Campaign Management**
  - Create and manage phishing campaigns
  - Target users individually or in groups
  - Schedule campaigns

- **Email Customization**
  - Customizable email templates
  - Variable substitution for personalization
  - HTML and plain text support
  - Use `sampleForTrackingUrl.html` as a template for creating emails with tracking capabilities

- **Click Tracking**
  - Unique tracking links for each recipient
  - Real-time click tracking
  - Detailed activity logging

- **Reporting**
  - Campaign performance metrics
  - User vulnerability statistics
  - Exportable reports

- **User Management**
  - Role-based access control
  - User groups
  - Activity auditing

## API Documentation

### NestJS API Endpoints

The NestJS Management Service exposes the following API endpoints:

```
/api/auth               # Authentication endpoints
/api/phishing-attempts  # Phishing campaign management
/api/users              # User management
```

### .NET API Endpoints

The .NET Backend Service exposes the following API endpoints:

```
/api/phishing           # Phishing email sending and tracking
/api/integration        # Integration endpoints for NestJS service
```

## Development

### Clean Architecture

The .NET backend follows the Clean Architecture pattern with these layers:

1. **Core Layer**: Domain entities, business rules, interfaces
2. **Infrastructure Layer**: Technical implementations, external services
3. **API Layer**: Controllers, DTOs, middleware

Benefits of this approach:
- Separation of concerns
- Testability
- Flexibility to change external dependencies
- Maintainability

### Data Flow

1. User creates a phishing campaign via the React frontend
2. Request is sent to the NestJS service
3. NestJS service calls the .NET backend to send emails
4. .NET backend sends emails and generates tracking URLs
5. When a user clicks a phishing link, the event is recorded directly in MongoDB
6. Reports are generated from the collected data

## Troubleshooting

### Common Issues

1. **Docker build failures**:
   - Ensure Docker has sufficient resources allocated
   - Check for network connectivity issues
   - Verify that all required ports are available

2. **Email sending issues**:
   - Verify SMTP settings in the .NET service
   - Check email templates format
   - Ensure email providers aren't blocking outbound emails

3. **Database connection issues**:
   - Verify MongoDB is running
   - Check connection strings
   - Ensure network connectivity between services

### Using Mailtrap for Email Testing

This application is configured to use Mailtrap by default for email testing. Mailtrap is a test mail server solution that allows you to test email sending in staging/dev environments without sending real emails to actual users.

#### Setting Up Mailtrap:

1. Create a free account at [Mailtrap](https://mailtrap.io/)
2. Go to your Mailtrap inbox
3. Click the SMTP Settings tab
4. Copy the credentials from the "Integrations" dropdown (select "Nodemailer" or "SMTP")

#### Configuring Your Application:

You can use Mailtrap in two ways:

1. **Update the Docker Compose file**:
   ```yaml
   # In docker-compose.yml, under the dotnet-simulation service
   environment:
     # ... other settings ...
     - EmailSettings__SmtpServer=sandbox.smtp.mailtrap.io
     - EmailSettings__SmtpPort=2525
     - EmailSettings__Username=YOUR_MAILTRAP_USERNAME_HERE
     - EmailSettings__Password=YOUR_MAILTRAP_PASSWORD_HERE
   ```

2. **Create a local .env file**:
   ```
   # Create a .env file in the project root
   EMAIL_SMTP_SERVER=sandbox.smtp.mailtrap.io
   EMAIL_SMTP_PORT=2525
   EMAIL_USERNAME=YOUR_MAILTRAP_USERNAME_HERE
   EMAIL_PASSWORD=YOUR_MAILTRAP_PASSWORD_HERE
   ```

When using Mailtrap, all emails sent by the application will be captured in your Mailtrap inbox instead of being delivered to real recipients, making it safe for testing.
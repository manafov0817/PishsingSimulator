# ---- Base Node ----
FROM node:18-alpine AS base
WORKDIR /app
# Copy package files for dependency installation
COPY package*.json ./

# ---- Dependencies ----
FROM base AS dependencies
# Install all dependencies with legacy-peer-deps flag
RUN npm install --legacy-peer-deps

# ---- Build ----
FROM dependencies AS build
# Copy the rest of the application code
COPY . .
# Build the application
RUN npm run build

# ---- Production ----
FROM node:18-alpine AS production
# Set NODE_ENV
ENV NODE_ENV=production
WORKDIR /app

# Copy package files
COPY package*.json ./
# Install only production dependencies with legacy-peer-deps flag
RUN npm install --omit=dev --legacy-peer-deps

# Copy built application from build stage
COPY --from=build /app/dist ./dist
# Copy environment variables
COPY .env.* ./

# Create a non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001 -G nodejs

# Change ownership
RUN chown -R nestjs:nodejs /app

# Switch to non-root user
USER nestjs

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["node", "dist/main"]
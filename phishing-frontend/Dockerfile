FROM node:20-alpine as build

WORKDIR /app

# Copy package files first (better caching)
COPY package.json package-lock.json* ./

# Clean install dependencies exactly as in package-lock.json
RUN npm ci

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Production stage using Nginx
FROM nginx:stable-alpine

# Copy the built app to nginx html directory
COPY --from=build /app/dist /usr/share/nginx/html

# Add custom nginx config to handle SPA routing
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/

# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]

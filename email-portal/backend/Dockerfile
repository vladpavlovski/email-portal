# Backend Dockerfile
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy app source
COPY . .

# Create a non-root user to run the app
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001
USER nodejs

# Expose port
EXPOSE 5000

# Start the application
CMD ["node", "src/server.js"]
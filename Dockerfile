FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Set environment variables
ENV NODE_ENV=development

# Expose ports
EXPOSE 3009 5000 5001

# Default command
CMD ["sh", "-c", "npm run server & PORT=3009 npm run start"] 
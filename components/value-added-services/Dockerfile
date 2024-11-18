FROM node:18-alpine AS build

# Set working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install production dependencies only
RUN npm install --only=production --legacy-peer-deps --ignore-scripts

# Install @nestjs/cli globally for the build stage
RUN npm install @nestjs/cli

# Copy the entire application source code to /app
COPY . .

# Build the app for production
RUN npm run build

# Use a smaller image for production (distroless or alpine)
FROM node:18-alpine

# Set working directory to /app
WORKDIR /app

# Copy only the built application from the build stage
COPY --from=build /app/dist ./dist

# Copy only the required production dependencies from the build stage
COPY --from=build /app/node_modules ./node_modules

# Copy necessary package.json for referencing dependencies (optional)
COPY package*.json ./

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["node", "dist/src/main.js"]
# Base image stage
FROM node:20-alpine AS base

# Upgrade existing packages, install necessary dependencies, and install additional build tools
RUN apk --no-cache -U upgrade \
    && apk add --no-cache \
    curl \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ttf-freefont \
    dumb-init \
    g++ \
    make \
    py3-pip \
    libc6-compat

# Expose port 3000
EXPOSE 3000

# Builder stage
FROM base AS builder

# Define build argument for allowed origin
ARG ALLOWED_ORIGIN

# Set environment variable for allowed origin
ENV ALLOWED_ORIGIN=${ALLOWED_ORIGIN}
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./
# Copy public files
COPY public ./public

# Install dependencies and Puppeteer (needed for generating PDFs)
RUN npm ci && npx puppeteer browsers install chrome

# Copy all application files
COPY . .

# Disable Next.js telemetry
ENV NEXT_TELEMETRY_DISABLED=1

# Build the Next.js app
RUN npm run build

# Runner stage
FROM base AS runner

WORKDIR /app

# Disable Next.js telemetry
ENV NEXT_TELEMETRY_DISABLED=1

RUN \ 
    # Create system group and user for running the app
    addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs && \
    # Create .next directory, and set ownership
    mkdir .next && \
    chown nextjs:nodejs .next

# Copy built application files from builder stage
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/.next/prerender-manifest.js ./

# Copy public files
COPY --from=builder --chown=nextjs:nodejs /app/public ./standalone/public
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Copy ejs template files for generating consumer pre-filled contract PDFs
COPY --from=builder --chown=nextjs:nodejs /app/src/app/templates ./.next/server/app/templates

# Set ownership for public directory
RUN chown -R nextjs:nodejs ./standalone/public

# Switch to non-root user
USER nextjs

# Expose application port
EXPOSE 3000

# Start the application
CMD node server.js

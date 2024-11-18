# Build stage
FROM node:20-alpine AS build
WORKDIR /app
RUN apk --no-cache -U upgrade \
    && apk add --no-cache \
    curl \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ttf-freefont \
    dumb-init
COPY package*.json ./
RUN npm install
# Install chromium for puppeteer. Needed for printing PDFs.
RUN npx puppeteer browsers install chrome

COPY . .
sadasdsd
EXPOSE 3000
CMD ["npm", "run", "dev"]



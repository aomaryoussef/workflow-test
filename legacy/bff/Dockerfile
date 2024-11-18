FROM node:20-alpine AS node

# Builder stage
FROM node AS builder

# Use /app as the CWD
WORKDIR /app            

# Copy package.json and package-lock.json to /app
COPY package*.json ./   

# Install all dependencies
RUN npm i               

# Copy the rest of the code
COPY . .                

# Invoke the build script to transpile ts code to js
RUN npm run build
RUN npm run copy_assets

# Open desired port
EXPOSE ${PORT}

# Run development server
ENTRYPOINT [ "npm", "run", "dev" ]

# Final stage

FROM node AS final

# Set node environment to production
ENV NODE_ENV production

RUN apk --no-cache -U upgrade \
    && apk add --no-cache \
    curl \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ttf-freefont \
    dumb-init


# Prepare destination directory and ensure user node owns it
RUN mkdir -p /home/node/app/build && chown -R node:node /home/node/app

# Set CWD
WORKDIR /home/node/app

# Install PM2
RUN npm i -g pm2

# Copy package.json, package-lock.json and process.yml
COPY package*.json pm2-process.yml ./

# Install libraries as user node
RUN npm i --omit=dev

# Switch to user node
USER node

# Copy js files and change ownership to user node
COPY --chown=node:node --from=builder /app/build ./build

# Open desired port
EXPOSE 3000

# Use PM2 to run the application as stated in config file
ENTRYPOINT ["pm2-runtime", "./pm2-process.yml"]
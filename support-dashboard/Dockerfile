# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory
WORKDIR /usr/src/app


# Install Docker client CLI and Git
RUN apk add --no-cache docker-cli git

# Copy package.json and package-lock.json (if available)
# Copy these first to leverage Docker cache for dependencies
COPY package*.json ./

# Install app dependencies
RUN npm install --omit=dev --no-audit --no-fund

# Copy ONLY the minimal server script
COPY server.js .
# We are not copying 'public' for this diagnostic step

# Make port 9999 available
# Copy static assets
COPY public ./public

EXPOSE 9999

# Run the minimal server.js
CMD [ "node", "server.js" ]
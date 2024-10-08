# Use the official Ubuntu image from Docker Hub as
# a base image
FROM node:22-slim

ENV TZ="America/Los_Angeles"

RUN apt update -y
RUN apt install poppler-utils grep findutils git-all tree -y

# Execute next commands in the directory /workspace
WORKDIR /workspace

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure both package.json AND package-lock.json are copied.
# Copying this separately prevents re-running npm install on every code change.
COPY package*.json ./

# Install dependencies.
RUN npm ci --only=production

# Copy local code to the container image.
COPY . .

# Run the web service on container startup.
ENTRYPOINT [ "./run.sh" ]
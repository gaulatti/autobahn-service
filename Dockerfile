# Use the full Node 21 Debian-based image
FROM public.ecr.aws/docker/library/node:21

WORKDIR /app

# Install MySQL client for mysqldump
RUN apt-get update && apt-get install -y default-mysql-client && rm -rf /var/lib/apt/lists/*

# Copy only package files initially to leverage Docker cache for dependencies
COPY package*.json ./
RUN npm install

# Copy the entire application after installing dependencies
COPY . .

# Build the application
RUN npm run build

# Expose the application port
EXPOSE 3001

# Start the server as the default command
CMD ["node", "dist/main"]

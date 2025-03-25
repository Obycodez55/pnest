# Parent Image
FROM node:22-alpine

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the source code
COPY . .

# Build the backend
RUN npm run build

# Expose the port
EXPOSE 3000

# Start the backend
CMD ["npm", "start"]
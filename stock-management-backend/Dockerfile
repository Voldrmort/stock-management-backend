# Use a Node.js image to run the backend
FROM node:16

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json for dependency installation
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the backend's port (e.g., 5000)
EXPOSE 5000

# Start the backend server
CMD ["npm", "start"]

# Use the official Node.js 16 image as the base
FROM node:16

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json for installing dependencies
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the rest of the application files into the container
COPY . .

# Expose the application on port 3000
EXPOSE 3000

# Command to start the application
CMD ["node", "app.js"]
# Use an argument to set the Node.js version
ARG NODE_VERSION=14

# Use the official Node.js image with the specified version
FROM node:${NODE_VERSION}

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

# Expose the port your app will run on
EXPOSE 8050

# Set environment variables (if needed)
# ENV NODE_ENV=production

# Command to run your application
CMD ["npm", "start"]



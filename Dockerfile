# Use the official Node.js 20 image as a base
FROM node:20-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and yarn files to the working directory
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn/ ./.yarn

# Install dependencies using Yarn
RUN yarn install --immutable

# Copy the rest of the application code
COPY . ./

# Expose the port the app runs on
EXPOSE 8080

# Command to run the application
CMD ["yarn", "start"]
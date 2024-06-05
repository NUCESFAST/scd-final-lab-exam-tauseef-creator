# Use an official runtime as a parent image
FROM node:20.13.1-alpine3.19
# Set the working directory in the container
WORKDIR /21I-1236_backend_Auth
# Copy the current directory contents into the container at /usr/src/app
COPY package*.json ./
# Install any needed packages specified in package.json
RUN npm install
# Copy the rest of the application code
COPY . .
# Make port 8000 available to the world outside this container
EXPOSE 3236
# Define environment variable, the port and MONGO_DB_SECRET
ENV PORT=3236
ENV MONGO_URL=mongodb://mongodb:27017/auth

# Run app.py when the container launches
CMD ["node", ".index.js"]

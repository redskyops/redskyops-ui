# Build using this version of node, which is an LTS release
FROM node:10.14

# Define the working directory
WORKDIR /usr/app

# Put all files in the current directory into the workdir of the image
COPY . .

# Install node dependencies
RUN npm install

# The command the container will run
CMD npm run start

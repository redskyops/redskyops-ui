FROM node:12.13
WORKDIR /usr/app
COPY package.json .
RUN npm install
COPY src/proxy.js .
CMD node proxy.js

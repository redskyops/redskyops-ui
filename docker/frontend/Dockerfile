FROM node:12.13 as builder
WORKDIR /usr/app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build

FROM nginx
COPY --from=builder /usr/app/build /usr/share/nginx/html/ui
COPY ./docker/frontend/default.conf /etc/nginx/conf.d/default.conf

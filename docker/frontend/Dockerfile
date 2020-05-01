FROM node:12.13 as builder
WORKDIR /usr/app
COPY package.json .
RUN npm install
COPY . .
ARG REACT_APP_BASE_FOLDER
ARG REACT_APP_BACKEND_URL
RUN npm run build

FROM nginx
ARG REDSKY_UI_SUBFOLDER
RUN echo "frontend will be accessed in '$REDSKY_UI_SUBFOLDER' subfolder"
COPY --from=builder /usr/app/build /usr/share/nginx/html$REDSKY_UI_SUBFOLDER
COPY ./docker/frontend/default.conf /etc/nginx/conf.d/default.conf

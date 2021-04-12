FROM node:lts-alpine as build-stage
WORKDIR /app
COPY . .

# production stage
FROM nginx:stable-alpine as production-stage
COPY nginx/nginx_docker.conf /etc/nginx/conf.d/default.conf
COPY . /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
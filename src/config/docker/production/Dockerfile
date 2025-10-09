FROM docker.mservice.io/public/node:20.16.0-alpine AS builder
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn
COPY . .
RUN yarn build-production

FROM docker.mservice.io/public/nginx:1.26.3-alpine-slim
COPY --from=builder /app/src/config/nginx/production /etc/nginx/conf.d
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 8080
ENTRYPOINT ["nginx", "-g", "daemon off;"] 


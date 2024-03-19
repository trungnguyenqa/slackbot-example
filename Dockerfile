FROM --platform=linux/amd64 node:16
WORKDIR /app
COPY . .
RUN yarn install
# Install stage
FROM node:18.14-alpine AS builder

WORKDIR /srv

COPY . .
# COPY package.json yarn.lock ./
RUN apk update && \
  apk add git

RUN yarn
RUN yarn build

COPY . .

# Run stage
FROM nginx:1.23.3-alpine

WORKDIR /usr/share/nginx/html

COPY --from=builder /srv/build /usr/share/nginx/html
# syntax=docker/dockerfile:1

FROM node:21-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "start"]


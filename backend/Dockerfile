FROM node:16-alpine AS builder
WORKDIR /app
ENV NODE_ENV=development

RUN apk add --no-cache python3 make g++

# 1) кэш зависимостей
COPY package*.json ./
RUN npm ci

COPY tsconfig*.json ./
COPY nest-cli.json ./
COPY src ./src

RUN npm run build

FROM node:16-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

RUN npm i -g pm2

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist
COPY ecosystem.config.js ./ecosystem.config.js

EXPOSE 3001

CMD ["pm2-runtime", "ecosystem.config.js"]

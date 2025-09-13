FROM node:16-alpine AS builder
WORKDIR /app
ENV NODE_ENV=development

RUN apk add --no-cache python3 make g++

COPY package*.json ./
RUN npm ci

COPY tsconfig*.json ./
COPY nest-cli.json ./
COPY src ./src

RUN npm run build

FROM node:16-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production \
    NPM_CONFIG_AUDIT=false \
    NPM_CONFIG_FUND=false

RUN npm i -g pm2

COPY package*.json ./
RUN npm ci --omit=dev --omit=optional \
 && npm prune --omit=dev --omit=optional \
 && rm -rf node_modules/typescript

COPY --from=builder /app/dist ./dist
COPY ecosystem.config.js ./ecosystem.config.js

EXPOSE 3001
CMD ["pm2-runtime", "ecosystem.config.js"]


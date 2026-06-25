# Development Stage
FROM node:20-alpine AS development

WORKDIR /app

RUN apk add --no-cache python3 make g++ postgresql-client

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm && pnpm install --frozen-lockfile

COPY tsconfig.json ./
COPY prisma ./prisma
RUN npx prisma generate

EXPOSE 4000

CMD ["pnpm", "dev"]


# Builder Stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile --prod

COPY tsconfig.json ./
COPY src ./src
COPY prisma ./prisma

RUN npx prisma generate
RUN pnpm build


# Production Stage
FROM node:20-alpine AS production

WORKDIR /app

RUN apk add --no-cache postgresql-client curl

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/prisma ./prisma

RUN npx prisma generate

USER nodejs

EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:4000/health || exit 1

CMD ["node", "dist/server.js"]
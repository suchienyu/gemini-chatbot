# syntax=docker.io/docker/dockerfile:1

FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Install necessary build tools and Python
RUN apk add --no-cache libc6-compat python3 make g++ gcc python3-dev \
    && ln -sf python3 /usr/bin/python
WORKDIR /app

# Enable pnpm
RUN corepack enable pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
RUN corepack enable pnpm

ARG PORT
ARG DB_USER
ARG DB_HOST
ARG DB_DATABASE
ARG DB_PASSWORD
ARG DB_PORT
ARG POSTGRES_URL
ARG NEXTAUTH_SECRET
ARG NEXT_URL
ARG NEXTAUTH_URL_INTERNAL
ARG NEXT_PUBLIC_API_URL
ARG OPENAI_API_KEY
ARG NEXT_PUBLIC_API_DOMAIN

ENV PORT=${PORT:-3000}
ENV DB_USER=${DB_USER}
ENV DB_HOST=${DB_HOST}
ENV DB_DATABASE=${DB_DATABASE}
ENV DB_PASSWORD=${DB_PASSWORD}
ENV DB_PORT=${DB_PORT}
ENV POSTGRES_URL=${POSTGRES_URL}
ENV NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
ENV NEXT_URL=${NEXT_URL}
ENV NEXTAUTH_URL_INTERNAL=${NEXTAUTH_URL_INTERNAL}
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV OPENAI_API_KEY=${OPENAI_API_KEY}
ENV NEXT_PUBLIC_API_DOMAIN=${NEXT_PUBLIC_API_DOMAIN}

RUN echo "Debug environment variables:"
RUN echo "NEXTAUTH_URL: $NEXTAUTH_URL"
RUN echo "VERCEL_URL: $VERCEL_URL"
RUN echo "NODE_ENV: $NODE_ENV"
RUN echo "NEXT_PUBLIC_APP_URL: $NEXT_PUBLIC_APP_URL"

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN echo "NEXTAUTH_URL: $NEXTAUTH_URL"
RUN echo "NODE_ENV: $NODE_ENV"
# Build the project
RUN pnpm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ARG NEXTAUTH_URL
ARG NEXTAUTH_SECRET
ARG BLOB_READ_WRITE_TOKEN
# ARG NEXT_PUBLIC_API_DOMAIN

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV NEXTAUTH_URL=${NEXTAUTH_URL:-"http://localhost:3000"}
ENV NEXTAUTH_SECRET=${NEXTAUTH_SECRET:-"temporary-secret-value"}
ENV BLOB_READ_WRITE_TOKEN=${BLOB_READ_WRITE_TOKEN}
# ENV NEXT_PUBLIC_API_DOMAIN=${NEXT_PUBLIC_API_DOMAIN}

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]

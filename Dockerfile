# ============================================
# Base
# ============================================
FROM node:22-alpine AS base
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

# ============================================
# Dependencies (full - for build)
# ============================================
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# ============================================
# Dependencies (prod only)
# ============================================
FROM base AS deps-prod
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile

# ============================================
# Build
# ============================================
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm run build

# ============================================
# Production
# ============================================
FROM node:22-alpine AS production
WORKDIR /app

ENV NODE_ENV=production

COPY --from=deps-prod /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/drizzle ./drizzle
COPY drizzle.config.ts ./
COPY package.json ./

COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["node", "dist/main.js"]
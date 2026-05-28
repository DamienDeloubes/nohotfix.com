# --- Builder stage ---
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

# Copy workspace manifests
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml turbo.json ./
COPY apps/api/package.json ./apps/api/
COPY packages/shared/package.json ./packages/shared/
COPY packages/db/package.json ./packages/db/
COPY packages/email/package.json ./packages/email/
COPY tooling/typescript/package.json ./tooling/typescript/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source files
COPY apps/api ./apps/api
COPY packages/shared ./packages/shared
COPY packages/db ./packages/db
COPY packages/email ./packages/email
COPY tooling/typescript ./tooling/typescript

# Build
RUN pnpm --filter @nohotfix/shared build
RUN pnpm --filter @nohotfix/db build
RUN pnpm --filter @nohotfix/email build
RUN pnpm --filter api build

# --- Runner stage ---
FROM node:20-alpine AS runner

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

COPY --from=builder /app/package.json /app/pnpm-workspace.yaml /app/pnpm-lock.yaml ./
COPY --from=builder /app/apps/api/package.json ./apps/api/
COPY --from=builder /app/packages/shared/package.json ./packages/shared/
COPY --from=builder /app/packages/db/package.json ./packages/db/
COPY --from=builder /app/packages/email/package.json ./packages/email/
COPY --from=builder /app/tooling/typescript/package.json ./tooling/typescript/

RUN pnpm install --frozen-lockfile --prod

COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/packages/shared/dist ./packages/shared/dist
COPY --from=builder /app/packages/db/dist ./packages/db/dist
COPY --from=builder /app/packages/email/dist ./packages/email/dist

ENV NODE_ENV=production
EXPOSE 3001

CMD ["node", "apps/api/dist/server.js"]

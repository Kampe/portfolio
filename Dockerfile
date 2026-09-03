# syntax=docker/dockerfile:1.7
ARG BUILD_DATE=unknown
FROM oven/bun:1.4.0-alpine@sha256:07235578f79ef8c6f97d94aee7938e76f5cdba5f21ae5dbfdd3d3d38058437eb AS builder

ARG BUILD_DATE
WORKDIR /app

COPY package.json bun.lock ./
COPY frontend/package.json ./frontend/package.json
COPY backend/package.json ./backend/package.json
COPY e2e/package.json ./e2e/package.json
RUN --mount=type=cache,target=/root/.bun/install/cache \
  bun install --frozen-lockfile --filter portfolio-frontend --filter portfolio-backend

COPY frontend ./frontend
COPY backend ./backend
RUN bun run build

FROM oven/bun:1.4.0-alpine@sha256:07235578f79ef8c6f97d94aee7938e76f5cdba5f21ae5dbfdd3d3d38058437eb AS runtime

ARG BUILD_DATE
RUN apk upgrade --no-cache
LABEL org.opencontainers.image.title="Nick Kampe portfolio" \
      org.opencontainers.image.description="Static portfolio and contact API" \
      org.opencontainers.image.source="https://github.com/Kampe/portfolio" \
      org.opencontainers.image.created="${BUILD_DATE}"

ENV NODE_ENV=production \
    PORT=3001 \
    PUBLIC_DIR=/app/backend/public

WORKDIR /app
COPY --from=builder --chown=bun:bun /app/backend/src ./backend/src
COPY --from=builder --chown=bun:bun /app/backend/public ./backend/public

USER bun
EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD ["bun", "-e", "const r=await fetch('http://127.0.0.1:3001/health');process.exit(r.ok?0:1)"]

CMD ["bun", "backend/src/index.ts"]

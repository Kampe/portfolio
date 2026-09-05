# syntax=docker/dockerfile:1.7
ARG BUILD_DATE=unknown
FROM oven/bun:1.3.13-alpine@sha256:4de475389889577f346c636f956b42a5c31501b654664e9ae5726f94d7bb5349 AS builder

ARG BUILD_DATE
WORKDIR /app

COPY package.json bun.lock ./
COPY frontend/package.json ./frontend/package.json
COPY backend/package.json ./backend/package.json
COPY e2e/package.json ./e2e/package.json
RUN --mount=type=cache,id=s/bc1183c0-ec01-4918-8390-f4ce5c14cfce-/root/.bun/install/cache,target=/root/.bun/install/cache \
  bun install --frozen-lockfile --filter portfolio-frontend --filter portfolio-backend

COPY frontend ./frontend
COPY backend ./backend
RUN bun run build

FROM oven/bun:1.3.13-alpine@sha256:4de475389889577f346c636f956b42a5c31501b654664e9ae5726f94d7bb5349 AS runtime

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
COPY --from=builder --chown=bun:bun /app/package.json /app/bun.lock ./
COPY --from=builder --chown=bun:bun /app/backend/package.json ./backend/package.json
COPY --from=builder --chown=bun:bun /app/backend/src ./backend/src
COPY --from=builder --chown=bun:bun /app/backend/public ./backend/public

USER bun
EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD ["bun", "-e", "const p=process.env.PORT||'3001';const r=await fetch('http://127.0.0.1:'+p+'/health');process.exit(r.ok?0:1)"]

CMD ["bun", "backend/src/index.ts"]

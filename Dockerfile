# Multi-stage build for portfolio app
# Stage 1: Build frontend
FROM oven/bun:latest AS frontend-builder

WORKDIR /app

# Copy monorepo metadata files for workspace resolution
COPY package.json bun.lock ./

# Copy workspace package.json files first (minimal files for caching)
COPY frontend/package.json ./frontend/package.json
COPY backend/package.json ./backend/package.json
COPY e2e/package.json ./e2e/package.json

# Install dependencies (cached if lock files unchanged)
RUN bun install

# Copy full source code
COPY frontend ./frontend
COPY backend ./backend
COPY e2e ./e2e

# Clean stale build artifacts
RUN rm -rf frontend/dist backend/public

# Build frontend
RUN bun run build:frontend

# Stage 2: Runtime
FROM oven/bun:latest

WORKDIR /app

# Copy backend source and built frontend
COPY --from=frontend-builder /app/backend ./backend
COPY --from=frontend-builder /app/package.json ./
COPY --from=frontend-builder /app/bun.lock ./

WORKDIR /app/backend

# Install only backend dependencies
RUN bun install --only=production

EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD bun run -e "const res = await fetch('http://localhost:3001/health'); process.exit(res.ok ? 0 : 1)"

# Start the server
CMD ["bun", "src/index.ts"]

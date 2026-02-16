# Multi-stage build for portfolio app
# Stage 1: Build frontend
FROM oven/bun:latest AS frontend-builder

WORKDIR /app

# Copy root and workspace files
COPY package.json bun.lock ./
COPY frontend ./frontend
COPY backend ./backend
COPY e2e ./e2e

# Clean any stale build artifacts before building (ensures fresh builds)
RUN rm -rf frontend/dist backend/public node_modules

# Install dependencies and build frontend
RUN bun install
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

# Multi-stage build for portfolio app
# Stage 1: Build frontend
FROM oven/bun:latest AS frontend-builder

# Build timestamp to invalidate cache
ARG BUILD_DATE

WORKDIR /app

# Copy monorepo metadata files for workspace resolution
COPY package.json bun.lock ./

# Copy configuration files
COPY .formspree.json ./

# Copy workspace package.json files first (minimal files for caching)
COPY frontend/package.json ./frontend/package.json
COPY backend/package.json ./backend/package.json
COPY e2e/package.json ./e2e/package.json

# Install dependencies (cached if lock files unchanged)
RUN bun install

# Copy full source code (.dockerignore prevents build artifacts from being copied)
COPY frontend ./frontend
COPY backend ./backend
COPY e2e ./e2e

# Build frontend - outputs to backend/public/
RUN echo "Building frontend at ${BUILD_DATE}" && bun run build:frontend

# Copy SEO files into backend/public after build
RUN mkdir -p backend/public/.well-known
COPY backend/public/robots.txt ./backend/public/
COPY backend/public/sitemap.xml ./backend/public/
COPY backend/public/manifest.json ./backend/public/
COPY backend/public/.well-known/security.txt ./backend/public/.well-known/

# Stage 2: Runtime
FROM oven/bun:latest

WORKDIR /app

# Copy backend source and built frontend (includes public files with SEO metadata)
COPY --from=frontend-builder /app/backend ./backend
COPY --from=frontend-builder /app/package.json ./
COPY --from=frontend-builder /app/bun.lock ./
COPY --from=frontend-builder /app/.formspree.json ./

WORKDIR /app/backend

# Install only backend dependencies
RUN bun install --only=production

EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD bun run -e "const res = await fetch('http://localhost:3001/health'); process.exit(res.ok ? 0 : 1)"

# Start the server with production environment
ENV NODE_ENV=production
CMD ["bun", "src/index.ts"]

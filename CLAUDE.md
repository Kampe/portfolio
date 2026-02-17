# Portfolio Project Configuration

## Claude Code Settings

### Allowed Commands (no prompts)

These commands may be executed without user approval:

- `bun run build:frontend` - Build frontend with Vite
- `bun run build` - Build frontend
- `bun install` - Install dependencies
- `docker build` - Build Docker images
- `docker-compose` - Docker Compose operations
- `docker push` - Push images to registry

### Notes

- Docker builds are always cached when dependencies haven't changed
- Frontend builds complete in ~6-15 seconds
- Use `--build-arg BUILD_DATE` to invalidate Docker cache when needed

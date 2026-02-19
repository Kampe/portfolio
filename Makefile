.PHONY: help dev build up down logs clean install lint test

# Variables
PROJECT_ROOT := $(shell pwd)
FRONTEND_LOG := /tmp/frontend.log
BACKEND_LOG := /tmp/backend.log

# Default target
.DEFAULT_GOAL := help

help: ## Show this help message
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'

# Development targets
dev: install ## Start frontend and backend dev servers with Bun
	@echo "🚀 Starting portfolio development servers..."
	@echo ""
	@echo "Frontend: http://localhost:5173 (with hot reload)"
	@echo "Backend:  http://localhost:3001"
	@echo ""
	@echo "Press Ctrl+C to stop all servers"
	@echo ""
	@cd frontend && bun run dev > $(FRONTEND_LOG) 2>&1 &
	@echo "✓ Frontend started"
	@sleep 2
	@cd backend && bun run start > $(BACKEND_LOG) 2>&1 &
	@echo "✓ Backend started"
	@echo ""
	@echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
	@echo "✨ Development environment ready!"
	@echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
	@echo ""
	@echo "Edit files in frontend/src/ and save to see changes instantly"
	@echo "Edit files in backend/src/ and the backend will auto-reload"
	@echo ""
	@echo "Logs:"
	@echo "  Frontend: tail -f $(FRONTEND_LOG)"
	@echo "  Backend:  tail -f $(BACKEND_LOG)"
	@echo ""

# Docker targets
up: ## Start development environment with Docker Compose
	docker compose up --build

down: ## Stop Docker Compose services
	docker compose down

rebuild: ## Rebuild Docker containers without cache
	docker compose down
	docker compose up --build

# Installation targets
install: ## Install dependencies for frontend and backend
	@echo "Installing frontend dependencies..."
	@cd frontend && bun install
	@echo "Installing backend dependencies..."
	@cd backend && bun install
	@echo "✓ All dependencies installed"

# Build targets
build-frontend: ## Build frontend for production
	@cd frontend && npm run build

build-backend: ## Backend is built at runtime by Bun
	@echo "Backend uses Bun runtime - no build step needed"

build: build-frontend ## Build production artifacts

# Code quality targets
lint: ## Run linters on frontend code
	@cd frontend && npm run lint

test-frontend: ## Run frontend tests
	@cd frontend && npm run test

test-backend: ## Run backend tests
	@cd backend && npm run test

test: test-frontend test-backend ## Run all tests

# Logging targets
logs: ## Tail both frontend and backend logs
	@echo "Tailing frontend and backend logs (Ctrl+C to stop)"
	@tail -f $(FRONTEND_LOG) $(BACKEND_LOG) 2>/dev/null || echo "No logs yet. Start dev servers first with: make dev"

logs-frontend: ## Tail frontend logs
	@tail -f $(FRONTEND_LOG)

logs-backend: ## Tail backend logs
	@tail -f $(BACKEND_LOG)

# Cleanup targets
clean: ## Remove build artifacts and logs
	@echo "Cleaning build artifacts..."
	@rm -rf frontend/dist
	@rm -rf frontend/.turbo
	@rm -rf backend/.turbo
	@rm -f $(FRONTEND_LOG) $(BACKEND_LOG)
	@echo "✓ Cleaned"

clean-deps: ## Remove all dependencies (requires reinstall)
	@echo "Removing dependencies..."
	@rm -rf frontend/node_modules
	@rm -rf backend/node_modules
	@rm -f frontend/bun.lockb backend/bun.lockb
	@echo "✓ Dependencies removed. Run 'make install' to reinstall"

distclean: clean clean-deps ## Deep clean (removes everything except source)
	@echo "✓ Deep clean complete"

# Git targets
status: ## Show git status
	git status

commit: ## Create a new commit (usage: make commit MSG="message")
	git add .
	git commit -m "$(MSG)" || echo "No changes to commit"

push: ## Push commits to remote
	git push

# Docker log targets
docker-logs: ## View Docker Compose logs
	docker compose logs -f

docker-logs-app: ## View only app container logs
	docker compose logs -f app

# Health check
health: ## Check if services are responding
	@echo "Checking API health..."
	@curl -s http://localhost:3001/health | jq . || echo "Backend not running"
	@echo "Checking frontend..."
	@curl -s http://localhost:5173 | head -20 || echo "Frontend not running"

# Info targets
info: ## Show project information
	@echo "📦 Portfolio Project"
	@echo ""
	@echo "📍 Location: $(PROJECT_ROOT)"
	@echo ""
	@echo "🔧 Tools:"
	@echo "   Frontend: Vue 3, Vite, TypeScript, Three.js"
	@echo "   Backend: Elysia, Bun, TypeScript"
	@echo "   Container: Docker"
	@echo ""
	@echo "📚 Directories:"
	@echo "   Frontend: ./frontend"
	@echo "   Backend:  ./backend"
	@echo ""
	@echo "Run 'make help' for all available commands"

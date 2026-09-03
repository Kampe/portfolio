.PHONY: help install dev build check lint typecheck test test-e2e up down logs health clean

.DEFAULT_GOAL := help

help: ## Show available commands
	@awk 'BEGIN {FS = ":.*## "; printf "Portfolio commands:\n"} /^[a-zA-Z_-]+:.*## / {printf "  %-14s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

install: ## Install the locked workspace dependencies
	bun install --frozen-lockfile

dev: ## Run the Vite and Bun development servers
	bun run dev

build: ## Generate static pages and bundle the Bun server
	bun run build

check: ## Run lint, types, unit tests, and the production build
	bun run check

lint: ## Run repository lint checks
	bun run lint

typecheck: ## Type-check frontend and backend packages
	bun run typecheck

test: ## Run frontend and backend unit tests
	bun run test

test-e2e: ## Run desktop and mobile browser tests against the production server
	bun run test:e2e

up: ## Build and run the hardened container locally
	BUILD_DATE=$$(date -u +%Y-%m-%dT%H:%M:%SZ) docker compose up --build

down: ## Stop the local container
	docker compose down

logs: ## Follow container logs
	docker compose logs -f app

health: ## Query the local health endpoint
	curl --fail --silent http://127.0.0.1:3001/health | jq .

clean: ## Remove generated application artifacts
	rm -rf backend/public backend/dist frontend/.vite-ssg-temp e2e/playwright-report e2e/test-results

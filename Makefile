# Accessibility Platform - DevOps Commands

.PHONY: help dev-up dev-down prod-up prod-down logs health-check metrics test build

# Default target
help:
	@echo "🚀 Accessibility Platform DevOps Commands"
	@echo ""
	@echo "Development:"
	@echo "  dev-up      Start development environment"
	@echo "  dev-down    Stop development environment"
	@echo "  dev-logs    View development logs"
	@echo ""
	@echo "Production:"
	@echo "  prod-up     Start production environment"
	@echo "  prod-down   Stop production environment"
	@echo "  prod-logs   View production logs"
	@echo ""
	@echo "Monitoring:"
	@echo "  health      Check system health"
	@echo "  metrics     View Prometheus metrics"
	@echo "  monitor     Open monitoring dashboard"
	@echo ""
	@echo "Testing:"
	@echo "  test        Run all tests"
	@echo "  test-backend Run backend tests"
	@echo "  test-frontend Run frontend tests"
	@echo ""
	@echo "Build:"
	@echo "  build       Build all containers"
	@echo "  push        Push to registry"

# Development commands
dev-up:
	@echo "🚀 Starting development environment..."
	docker-compose -f deployment/docker-compose.dev.yml up -d
	@echo "✅ Development environment started!"
	@echo "Frontend: http://localhost:3000"
	@echo "Backend: http://localhost:8000"
	@echo "Database Admin: http://localhost:8080"

dev-down:
	@echo "🛑 Stopping development environment..."
	docker-compose -f deployment/docker-compose.dev.yml down
	@echo "✅ Development environment stopped!"

dev-logs:
	docker-compose -f deployment/docker-compose.dev.yml logs -f

# Production commands
prod-up:
	@echo "🚀 Starting production environment..."
	docker-compose -f deployment/docker-compose.yml up -d
	@echo "✅ Production environment started!"
	@echo "Application: http://localhost"
	@echo "Monitoring: http://localhost:9090"
	@echo "Dashboard: http://localhost:3001"

prod-down:
	@echo "🛑 Stopping production environment..."
	docker-compose -f deployment/docker-compose.yml down
	@echo "✅ Production environment stopped!"

prod-logs:
	docker-compose -f deployment/docker-compose.yml logs -f

# Monitoring commands
health:
	@echo "🏥 Checking system health..."
	@curl -s http://localhost:8000/health | python -m json.tool || echo "❌ Health check failed"

metrics:
	@echo "📊 Fetching Prometheus metrics..."
	@curl -s http://localhost:8000/metrics | head -20

monitor:
	@echo "📈 Opening monitoring dashboard..."
	@echo "Prometheus: http://localhost:9090"
	@echo "Grafana: http://localhost:3001 (admin/admin)"

# Testing commands
test: test-backend test-frontend

test-backend:
	@echo "🧪 Running backend tests..."
	cd backend && python -m pytest tests/ -v

test-frontend:
	@echo "🧪 Running frontend tests..."
	cd frontend && npm test

# Build commands
build:
	@echo "🔨 Building all containers..."
	docker-compose -f deployment/docker-compose.yml build

push:
	@echo "📤 Pushing to registry..."
	docker-compose -f deployment/docker-compose.yml push

# Utility commands
clean:
	@echo "🧹 Cleaning up..."
	docker system prune -f
	docker volume prune -f

scale:
	@echo "📈 Scaling services..."
	docker-compose -f deployment/docker-compose.yml up -d --scale backend=3 --scale frontend=2

backup:
	@echo "💾 Creating backup..."
	docker exec postgres pg_dump -U postgres accessibility_db > backup_$(shell date +%Y%m%d_%H%M%S).sql

restore:
	@echo "🔄 Restoring from backup..."
	@read -p "Enter backup file: " backup; docker exec -i postgres psql -U postgres accessibility_db < $$backup
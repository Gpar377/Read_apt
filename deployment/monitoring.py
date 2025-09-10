"""
Health checks and monitoring for Accessibility Platform
"""

import asyncio
import logging
import time
from typing import Dict, Any
from fastapi import FastAPI, HTTPException
from prometheus_client import Counter, Histogram, Gauge, generate_latest
import psutil
import redis
from sqlalchemy import text
from app.database.database import SessionLocal

# Metrics
REQUEST_COUNT = Counter('http_requests_total', 'Total HTTP requests', ['method', 'endpoint', 'status'])
REQUEST_DURATION = Histogram('http_request_duration_seconds', 'HTTP request duration')
ACTIVE_USERS = Gauge('active_users_total', 'Number of active users')
ASSESSMENT_COUNT = Counter('assessments_completed_total', 'Total assessments completed', ['type'])
ML_PREDICTION_TIME = Histogram('ml_prediction_duration_seconds', 'ML model prediction time', ['model'])

# System metrics
CPU_USAGE = Gauge('system_cpu_usage_percent', 'System CPU usage')
MEMORY_USAGE = Gauge('system_memory_usage_percent', 'System memory usage')
DISK_USAGE = Gauge('system_disk_usage_percent', 'System disk usage')

logger = logging.getLogger(__name__)

class HealthChecker:
    def __init__(self):
        self.redis_client = None
        self.db_session = None
        
    async def check_database(self) -> Dict[str, Any]:
        """Check database connectivity and performance"""
        try:
            db = SessionLocal()
            start_time = time.time()
            
            # Simple query to test connection
            result = db.execute(text("SELECT 1"))
            result.fetchone()
            
            response_time = time.time() - start_time
            db.close()
            
            return {
                "status": "healthy",
                "response_time": response_time,
                "message": "Database connection successful"
            }
        except Exception as e:
            logger.error(f"Database health check failed: {e}")
            return {
                "status": "unhealthy",
                "error": str(e),
                "message": "Database connection failed"
            }
    
    async def check_redis(self) -> Dict[str, Any]:
        """Check Redis connectivity"""
        try:
            if not self.redis_client:
                self.redis_client = redis.Redis(host='redis', port=6379, decode_responses=True)
            
            start_time = time.time()
            self.redis_client.ping()
            response_time = time.time() - start_time
            
            return {
                "status": "healthy",
                "response_time": response_time,
                "message": "Redis connection successful"
            }
        except Exception as e:
            logger.error(f"Redis health check failed: {e}")
            return {
                "status": "unhealthy",
                "error": str(e),
                "message": "Redis connection failed"
            }
    
    async def check_ml_models(self) -> Dict[str, Any]:
        """Check ML model availability"""
        try:
            from app.services.ml_service import ml_service
            
            # Test dyslexia model
            start_time = time.time()
            ml_service.predict_dyslexia(0.5, 0.7)
            dyslexia_time = time.time() - start_time
            
            # Test ADHD model  
            start_time = time.time()
            ml_service.predict_adhd([1] * 18)
            adhd_time = time.time() - start_time
            
            return {
                "status": "healthy",
                "models": {
                    "dyslexia": {"response_time": dyslexia_time, "status": "loaded"},
                    "adhd": {"response_time": adhd_time, "status": "loaded"}
                },
                "message": "All ML models loaded successfully"
            }
        except Exception as e:
            logger.error(f"ML models health check failed: {e}")
            return {
                "status": "unhealthy",
                "error": str(e),
                "message": "ML models not available"
            }
    
    async def check_ai_agents(self) -> Dict[str, Any]:
        """Check AI agents availability"""
        try:
            from app.agents.agent_orchestrator import agent_orchestrator
            
            start_time = time.time()
            # Simple test query
            result = await agent_orchestrator.process_query("test health check")
            response_time = time.time() - start_time
            
            return {
                "status": "healthy",
                "response_time": response_time,
                "agents_count": 4,
                "message": "AI agents responding"
            }
        except Exception as e:
            logger.error(f"AI agents health check failed: {e}")
            return {
                "status": "unhealthy",
                "error": str(e),
                "message": "AI agents not responding"
            }
    
    def get_system_metrics(self) -> Dict[str, Any]:
        """Get system resource metrics"""
        try:
            cpu_percent = psutil.cpu_percent(interval=1)
            memory = psutil.virtual_memory()
            disk = psutil.disk_usage('/')
            
            # Update Prometheus metrics
            CPU_USAGE.set(cpu_percent)
            MEMORY_USAGE.set(memory.percent)
            DISK_USAGE.set(disk.percent)
            
            return {
                "cpu_usage": cpu_percent,
                "memory_usage": memory.percent,
                "disk_usage": disk.percent,
                "memory_total": memory.total,
                "memory_available": memory.available,
                "disk_total": disk.total,
                "disk_free": disk.free
            }
        except Exception as e:
            logger.error(f"System metrics collection failed: {e}")
            return {"error": str(e)}

health_checker = HealthChecker()

async def comprehensive_health_check() -> Dict[str, Any]:
    """Run all health checks"""
    start_time = time.time()
    
    # Run all checks concurrently
    db_check, redis_check, ml_check, ai_check = await asyncio.gather(
        health_checker.check_database(),
        health_checker.check_redis(),
        health_checker.check_ml_models(),
        health_checker.check_ai_agents(),
        return_exceptions=True
    )
    
    system_metrics = health_checker.get_system_metrics()
    
    total_time = time.time() - start_time
    
    # Determine overall health
    all_healthy = all([
        db_check.get("status") == "healthy",
        redis_check.get("status") == "healthy", 
        ml_check.get("status") == "healthy",
        ai_check.get("status") == "healthy"
    ])
    
    return {
        "status": "healthy" if all_healthy else "degraded",
        "timestamp": time.time(),
        "total_check_time": total_time,
        "services": {
            "database": db_check,
            "redis": redis_check,
            "ml_models": ml_check,
            "ai_agents": ai_check
        },
        "system": system_metrics,
        "version": "2.0.0"
    }

# Middleware for metrics collection
async def metrics_middleware(request, call_next):
    """Collect request metrics"""
    start_time = time.time()
    
    response = await call_next(request)
    
    # Record metrics
    REQUEST_COUNT.labels(
        method=request.method,
        endpoint=request.url.path,
        status=response.status_code
    ).inc()
    
    REQUEST_DURATION.observe(time.time() - start_time)
    
    return response

def get_metrics():
    """Get Prometheus metrics"""
    return generate_latest()
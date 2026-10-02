"""Chic Genie API Routers Package."""

from app.api.health import router as health_router
from app.api.recommendations import router as recommendations_router

__all__ = ["health_router", "recommendations_router"]

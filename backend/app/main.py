"""Chic Genie FastAPI Backend Application Entry Point."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.health import router as health_router
from app.api.recommendations import router as recommendations_router
from app.api.rag import router as rag_router
from app.core.config import settings

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Personal Fashion Intelligence & Recommendation Engine Backend for Chic Genie",
    version="1.0.0",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs",
    redoc_url=f"{settings.API_V1_STR}/redoc",
)

# CORS Middleware Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(health_router, prefix=settings.API_V1_STR)
app.include_router(recommendations_router, prefix=settings.API_V1_STR)
app.include_router(rag_router, prefix=settings.API_V1_STR)


@app.get("/")
async def root():
    """Root metadata endpoint."""
    return {
        "message": f"Welcome to {settings.PROJECT_NAME} API",
        "docs": f"{settings.API_V1_STR}/docs",
        "health": f"{settings.API_V1_STR}/health",
        "recommendations": f"{settings.API_V1_STR}/recommendations"
    }

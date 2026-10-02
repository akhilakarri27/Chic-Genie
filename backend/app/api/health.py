"""Health check endpoint for Chic Genie Backend."""

from fastapi import APIRouter
from pydantic import BaseModel, Field

router = APIRouter()


class HealthResponse(BaseModel):
    """Health check response format."""
    status: str = Field(default="online", description="Service operating status")
    service: str = Field(default="Chic Genie Backend", description="Service title")


@router.get("/health", response_model=HealthResponse, tags=["Health"])
async def health_check() -> HealthResponse:
    """
    Health check endpoint to verify backend service connectivity.
    
    Returns:
        HealthResponse containing 'status: online' and 'service: Chic Genie Backend'.
    """
    return HealthResponse(
        status="online",
        service="Chic Genie Backend"
    )

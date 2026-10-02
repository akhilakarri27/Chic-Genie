"""Recommendations API endpoint."""

from fastapi import APIRouter, HTTPException
from app.models.preferences import RecommendationRequest, RecommendationResponse
from app.services.recommendation_engine import RecommendationEngine

router = APIRouter()
engine = RecommendationEngine()


@router.post("/recommendations", response_model=RecommendationResponse)
async def generate_recommendations(request: RecommendationRequest) -> RecommendationResponse:
    """
    Generates intelligent fashion recommendations based on user style coordinates.
    
    - Evaluates body shape silhouette harmony
    - Multi-factor scoring across occasion, aesthetic vibe, outfit type, and palette
    - Enforces non-repetition and outfit novelty
    - Returns complete styled ensembles (Garments + Footwear + Jewellery + Bag + Accessories)
    """
    try:
        recommendations = engine.get_recommendations(
            prefs=request.preferences,
            count=request.count,
            seed_offset=request.seedOffset,
            recently_shown=request.recentlyShown
        )
        return RecommendationResponse(
            status="success",
            count=len(recommendations),
            recommendations=recommendations
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail="Failed to generate recommendations"
        )

"""Recommendations API endpoint for Chic Genie."""

from fastapi import APIRouter, HTTPException, status
from app.models.preferences import RecommendationRequest
from app.models.outfit import RecommendationResponse
from app.services.recommendation_engine import RecommendationEngine

router = APIRouter()
engine = RecommendationEngine()


@router.post(
    "/recommendations",
    response_model=RecommendationResponse,
    status_code=status.HTTP_200_OK,
    tags=["Recommendations"],
    summary="Generate personalized complete look recommendations"
)
async def generate_recommendations(request: RecommendationRequest) -> RecommendationResponse:
    """
    Generates intelligent fashion recommendations based on user style coordinates.
    
    - Evaluates body shape silhouette harmony
    - Multi-factor scoring across occasion, aesthetic vibe, outfit type, and palette
    - Enforces novelty and non-repetition using `recentlyShown`
    - Returns complete styled ensembles (Garments + Footwear + Jewellery + Bag + Accessories)
    """
    try:
        recommendations = await engine.get_recommendations_async(
            prefs=request.preferences,
            recently_shown=request.recentlyShown,
            count=request.count,
            seed_offset=request.seedOffset
        )
        return RecommendationResponse(
            status="success",
            count=len(recommendations),
            recommendations=recommendations
        )
    except Exception as e:
        print(f"Recommendation generation error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate fashion recommendations. Please try again."
        )

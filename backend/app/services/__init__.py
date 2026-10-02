"""Chic Genie Services Package."""

from app.services.recommendation_engine import RecommendationEngine
from app.services.compatibility import calculate_body_shape_compatibility
from app.services.novelty import calculate_novelty_score, select_diverse_recommendations

__all__ = [
    "RecommendationEngine",
    "calculate_body_shape_compatibility",
    "calculate_novelty_score",
    "select_diverse_recommendations",
]

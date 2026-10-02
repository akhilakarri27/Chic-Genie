"""Chic Genie Models Package."""

from app.models.preferences import PreferencesInput, RecommendationRequest
from app.models.outfit import Outfit, RecommendationResponse

__all__ = [
    "PreferencesInput",
    "RecommendationRequest",
    "Outfit",
    "RecommendationResponse",
]

"""Data models package."""
from app.models.preferences import (
    PreferencesInput,
    RecommendationRequest,
    OutfitItem,
    RecommendationResponse,
)

# Alias for backwards compatibility
UserPreferences = PreferencesInput

__all__ = [
    "PreferencesInput",
    "RecommendationRequest",
    "OutfitItem",
    "RecommendationResponse",
    "UserPreferences",
]

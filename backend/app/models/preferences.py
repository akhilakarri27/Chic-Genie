"""Flexible User Preference Models for Chic Genie."""

from typing import List, Optional, Union, Dict, Any
from pydantic import BaseModel, Field


class PreferencesInput(BaseModel):
    """
    Flexible user styling preferences received from frontend or chat interface.
    Supports partial and flexible inputs (strings or lists of strings).
    """
    bodyShape: Optional[str] = Field(default="", description="Body shape / silhouette (hourglass, pear, rectangle, inverted triangle, round)")
    styles: Optional[Union[List[str], str]] = Field(default_factory=list, description="Preferred style aesthetics (e.g. minimal chic, romantic, streetwear)")
    occasions: Optional[Union[List[str], str]] = Field(default_factory=list, description="List of target occasions")
    occasion: Optional[str] = Field(default=None, description="Primary occasion (e.g. casual, college, work, party, wedding)")
    colors: Optional[Union[List[str], str]] = Field(default_factory=list, description="Preferred colors (e.g. burgundy, sage, navy, ivory)")
    colorMoods: Optional[Union[List[str], str]] = Field(default_factory=list, description="Color mood palettes (e.g. soft pastel, rich jewel, monochrome)")
    palette: Optional[str] = Field(default=None, description="Primary palette mood")
    outfitTypes: Optional[Union[List[str], str]] = Field(default_factory=list, description="Preferred outfit types (e.g. wrap dress, saree, co-ord)")
    outfitType: Optional[str] = Field(default=None, description="Primary outfit type")
    footwear: Optional[Union[List[str], str]] = Field(default=None, description="Footwear preferences (e.g. block heels, sneakers, loafers)")
    jewellery: Optional[Union[List[str], str]] = Field(default=None, description="Jewellery preferences (e.g. minimal gold, pearls, statement silver)")
    accessories: Optional[Union[List[str], str]] = Field(default_factory=list, description="Accessories (e.g. handbag, sunglasses, silk scarf)")
    comfort: Optional[Union[List[str], str]] = Field(default=None, description="Comfort preference (comfort_first, style_first, balanced)")
    season: Optional[Union[List[str], str]] = Field(default=None, description="Target season (summer, monsoon, autumn, winter, all_season)")
    weather: Optional[Union[List[str], str]] = Field(default=None, description="Weather condition (warm, humid, breezy, cold)")
    preferredFit: Optional[Union[List[str], str]] = Field(default=None, description="Fit preference (relaxed, fitted, oversized, tailored)")
    fit: Optional[str] = Field(default=None, description="Primary fit preference")
    avoidedStyles: Optional[List[str]] = Field(default_factory=list, description="Styles or aesthetics to avoid")
    avoidedColors: Optional[List[str]] = Field(default_factory=list, description="Colors to avoid")
    avoid: Optional[List[str]] = Field(default_factory=list, description="General exclusion flags")


class RecommendationRequest(BaseModel):
    """Request payload for POST /api/recommendations."""
    preferences: PreferencesInput = Field(default_factory=PreferencesInput, description="User style preferences")
    recentlyShown: List[str] = Field(default_factory=list, description="List of previously recommended outfit IDs to prevent repetition")
    count: int = Field(default=3, ge=1, le=10, description="Number of complete looks to recommend")
    seedOffset: int = Field(default=0, ge=0, description="Offset for pagination / regeneration")

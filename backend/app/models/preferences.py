from typing import List, Optional, Union, Dict, Any
from pydantic import BaseModel, Field


class PreferencesInput(BaseModel):
    """Normalized user styling preferences received from frontend."""
    bodyShape: Optional[str] = Field(default="", description="Body shape / silhouette identifier")
    styles: List[str] = Field(default_factory=list, description="List of preferred style archetypes")
    occasions: List[str] = Field(default_factory=list, description="Occasions list")
    occasion: Optional[str] = Field(default=None, description="Primary occasion")
    colors: List[str] = Field(default_factory=list, description="Preferred colors or color palettes")
    colorMoods: List[str] = Field(default_factory=list, description="Color mood palettes")
    palette: Optional[str] = Field(default=None, description="Primary palette preference")
    outfitTypes: List[str] = Field(default_factory=list, description="Outfit types list")
    outfitType: Optional[str] = Field(default=None, description="Primary outfit type")
    footwear: Union[List[str], Optional[str]] = Field(default=None, description="Preferred footwear")
    accessories: List[str] = Field(default_factory=list, description="Finishing accessories")
    jewellery: Union[List[str], Optional[str]] = Field(default=None, description="Jewellery preferences")
    comfort: Union[List[str], Optional[str]] = Field(default=None, description="Comfort vs style priority")
    season: Union[List[str], Optional[str]] = Field(default=None, description="Target season")
    weather: Union[List[str], Optional[str]] = Field(default=None, description="Current weather context")
    preferredFit: Union[List[str], Optional[str]] = Field(default=None, description="Preferred fit")
    fit: Optional[str] = Field(default=None, description="Primary fit preference")
    avoidedStyles: List[str] = Field(default_factory=list, description="Styles to avoid")
    avoidedColors: List[str] = Field(default_factory=list, description="Colors to avoid")
    avoid: List[str] = Field(default_factory=list, description="Exclusion flags")


class RecommendationRequest(BaseModel):
    """Request payload for POST /api/recommendations."""
    preferences: PreferencesInput = Field(default_factory=PreferencesInput)
    count: int = Field(default=3, ge=1, le=10, description="Number of complete looks to recommend")
    seedOffset: int = Field(default=0, ge=0, description="Offset for non-repetition regeneration")
    recentlyShown: List[str] = Field(default_factory=list, description="IDs of outfits recently viewed to prevent repetition")


class QuickTransformOption(BaseModel):
    """Quick transform options for dynamic customization."""
    top: Optional[str] = None
    bottom: Optional[str] = None
    dress: Optional[str] = None
    footwear: Optional[str] = None
    bag: Optional[str] = None
    jewellery: Optional[str] = None
    accessories: Optional[str] = None


class OutfitItem(BaseModel):
    """Complete styled look recommendation item."""
    id: str
    name: str
    category: str
    subCategory: Optional[str] = None
    style: str
    styles: List[str] = Field(default_factory=list)
    occasion: str
    occasions: List[str] = Field(default_factory=list)
    weather: Union[List[str], str] = Field(default_factory=list)
    season: str = "All Season"
    outfitType: str
    top: Optional[str] = None
    bottom: Optional[str] = None
    dress: Optional[str] = None
    layer: Optional[str] = None
    color: str
    colorFamily: str = "neutral"
    colors: List[str] = Field(default_factory=list)
    paletteMood: str = "balanced"
    palette: str = "balanced"
    fit: str = "regular"
    silhouette: str = "tailored"
    neckline: Optional[str] = None
    waistDefinition: Optional[str] = None
    bodyShapeCompatibility: List[str] = Field(default_factory=list)
    comfort: str = "balanced"
    formality: str = "Casual"
    footwear: Optional[str] = None
    accessories: Optional[str] = None
    bag: Optional[str] = None
    jewellery: Optional[str] = None
    description: str
    avatarUrl: str
    tags: List[str] = Field(default_factory=list)
    preferenceMatch: int = 95
    explanation: str
    quickTransforms: Optional[Dict[str, Dict[str, str]]] = None


class RecommendationResponse(BaseModel):
    """Response payload for POST /api/recommendations."""
    status: str = "success"
    count: int
    recommendations: List[OutfitItem]

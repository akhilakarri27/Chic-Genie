"""Complete Look Outfit Models for Chic Genie."""

from typing import List, Optional, Union, Dict, Any
from pydantic import BaseModel, Field


class Outfit(BaseModel):
    """
    Represents a COMPLETE STYLED ENSEMBLE.
    Contains full garments, footwear, jewellery, bag, accessories, and styling metadata.
    """
    id: str = Field(..., description="Unique outfit identifier (e.g. look_001)")
    name: str = Field(..., description="Editorial look title")
    category: str = Field(..., description="High-level category (Western, Ethnic, Professional, Streetwear, Boho, Preppy, Activewear)")
    subCategory: Optional[str] = Field(default=None, description="Granular subcategory")
    outfitType: str = Field(..., description="Outfit format (e.g. wrap midi dress, cotton saree, blazer + trousers)")
    silhouette: str = Field(default="tailored", description="Silhouette structure (defined waist, A-line, relaxed drape, column, structured)")
    
    # Separates / Garments
    top: Optional[str] = Field(default=None, description="Top garment")
    bottom: Optional[str] = Field(default=None, description="Bottom garment")
    dress: Optional[str] = Field(default=None, description="Dress garment")
    saree: Optional[str] = Field(default=None, description="Saree garment")
    blouse: Optional[str] = Field(default=None, description="Blouse style")
    layer: Optional[str] = Field(default=None, description="Outerwear layer (blazer, cardigan, jacket)")
    
    # Color & Aesthetics
    color: str = Field(..., description="Primary color (e.g. burgundy, sage, ivory, navy)")
    secondaryColor: Optional[str] = Field(default=None, description="Secondary or accent color")
    colorFamily: Optional[str] = Field(default="neutral", description="Color family (neutrals, dark, bold, pastels, earth, jewel, metallics)")
    colorDepth: Optional[str] = Field(default="medium", description="Color depth (light, medium, deep, dark)")
    colorMood: Optional[str] = Field(default="balanced", description="Color mood (minimal, vibrant, romantic, earthy, moody)")
    colors: List[str] = Field(default_factory=list, description="All palette color tags")
    palette: Optional[str] = Field(default="balanced", description="Palette classification")
    
    # Construction & Fit
    pattern: Optional[str] = Field(default="solid", description="Fabric pattern (solid, floral, striped, textured, printed)")
    fabric: Optional[str] = Field(default="cotton", description="Primary fabric material (crepe, organza, silk, linen, denim, knit)")
    fit: str = Field(default="relaxed", description="Drape and fit (relaxed, fitted, oversized, tailored)")
    neckline: Optional[str] = Field(default=None, description="Neckline format (V-neck, boat neck, collar, square neck)")
    waistDefinition: Optional[str] = Field(default=None, description="Waist detailing (belted, wrap, high-rise, empire, straight)")
    
    # Compatibility & Styling coordinates
    style: str = Field(..., description="Primary aesthetic style (e.g. romantic, minimal chic, casual chic, street)")
    styles: List[str] = Field(default_factory=list, description="Compatible styles list")
    occasions: List[str] = Field(default_factory=list, description="Suitable occasions")
    occasion: Optional[str] = Field(default=None, description="Primary occasion tag")
    bodyShapes: List[str] = Field(default_factory=list, description="Compatible body shapes (hourglass, pear, rectangle, inverted_triangle, round)")
    bodyShapeCompatibility: Optional[List[str]] = Field(default_factory=list, description="Body shape compatibility alias")
    
    # Completing items
    footwear: Optional[str] = Field(default=None, description="Recommended footwear")
    jewellery: Optional[str] = Field(default=None, description="Curated jewellery")
    bag: Optional[str] = Field(default=None, description="Curated bag / clutch")
    accessories: Optional[str] = Field(default=None, description="Finishing accessories (sunglasses, belt, scarf, watch)")
    
    # Context
    season: str = Field(default="All Season", description="Season compatibility")
    weather: Union[List[str], str] = Field(default_factory=lambda: ["warm", "breezy"], description="Weather compatibility")
    comfort: Optional[str] = Field(default="balanced", description="Comfort priority balance")
    formality: Optional[str] = Field(default="Casual", description="Formality level")
    
    # Presentation & AI/ML Scores
    description: Optional[str] = Field(default=None, description="Editorial description of the ensemble")
    avatarUrl: Optional[str] = Field(default="/avatars/casual_chic.jpg", description="Avatar illustration asset URL")
    tags: List[str] = Field(default_factory=list, description="Curated tags")
    preferenceMatch: Optional[int] = Field(default=95, description="Match percentage score")
    explanation: Optional[str] = Field(default=None, description="Personalized styling explanation")
    quickTransforms: Optional[Dict[str, Dict[str, str]]] = Field(default=None, description="Dynamic variation transforms")
    
    # Internal AI/ML Diagnostics & Generation
    ragScore: Optional[float] = Field(default=None, description="RAG semantic cosine similarity score")
    mlCompatibilityScore: Optional[float] = Field(default=None, description="RandomForest ML compatibility prediction")
    hybridScore: Optional[float] = Field(default=None, description="Final combined multi-factor score")
    stylingTip: Optional[str] = Field(default=None, description="Actionable styling tip for footwear, jewellery, or drape")
    aiGenerated: Optional[bool] = Field(default=False, description="Whether explanation was generated by LLM")


class RecommendationResponse(BaseModel):
    """Response payload for POST /api/recommendations."""
    status: str = Field(default="success", description="Status code string")
    count: int = Field(..., description="Number of outfits returned")
    recommendations: List[Outfit] = Field(default_factory=list, description="Curated complete styled looks")

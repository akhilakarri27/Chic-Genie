"""Body Shape Styling Compatibility Engine for Chic Genie.

Evaluates silhouette harmony, proportioning, and drape balance across body shape archetypes.
Note: Body shape is treated strictly as an empowering styling and proportion coordinate.
Never makes value or attractiveness judgments; assigns non-restrictive compatibility scores.
"""

from typing import List, Dict, Any, Optional

# Supported canonical body shape identifiers
BODY_SHAPE_ALIASES: Dict[str, str] = {
    "hourglass": "hourglass",
    "hour_glass": "hourglass",
    "pear": "pear",
    "triangle": "pear",
    "pear_triangle": "pear",
    "rectangle": "rectangle",
    "athletic": "rectangle",
    "straight": "rectangle",
    "inverted_triangle": "inverted_triangle",
    "inverted triangle": "inverted_triangle",
    "apple": "round",
    "oval": "round",
    "round": "round",
    "round_oval": "round"
}

# Silhouette attributes favored for balanced proportioning
SILHOUETTE_AFFINITIES: Dict[str, Dict[str, List[str]]] = {
    "hourglass": {
        "favored_silhouettes": ["defined waist", "wrap", "fitted", "tailored", "bodycon", "fit and flare", "mermaid"],
        "favored_waists": ["defined", "belted", "wrap", "high-rise", "cinched"],
        "favored_necklines": ["V-neck", "sweetheart", "scoop", "wrap", "square neck", "off-shoulder"],
    },
    "pear": {
        "favored_silhouettes": ["A-line", "fit and flare", "structured shoulder", "relaxed top with flared bottom", "empire"],
        "favored_waists": ["high-rise", "defined", "empire", "belted"],
        "favored_necklines": ["boat neck", "off-shoulder", "square neck", "cowl", "statement collar"],
    },
    "rectangle": {
        "favored_silhouettes": ["belted", "peplum", "wrap", "pleated", "layered", "relaxed tailored", "A-line", "column"],
        "favored_waists": ["belted", "wrap", "high-rise", "gathered"],
        "favored_necklines": ["sweetheart", "V-neck", "round neck", "halter", "cowl"],
    },
    "inverted_triangle": {
        "favored_silhouettes": ["wide-leg", "A-line skirt", "flared", "palazzo", "peplum hem", "relaxed drape", "drop waist"],
        "favored_waists": ["natural waist", "drop waist", "low to mid rise", "straight"],
        "favored_necklines": ["V-neck", "deep scoop", "halter", "asymmetrical", "drape"],
    },
    "round": {
        "favored_silhouettes": ["empire", "vertical drape", "column", "flowy maxi", "open layer", "relaxed straight", "A-line"],
        "favored_waists": ["empire", "relaxed", "straight", "soft drape"],
        "favored_necklines": ["V-neck", "deep scoop", "notched collar", "mandarin", "open collar"],
    }
}


def normalize_body_shape(raw_shape: Optional[str]) -> Optional[str]:
    """Normalizes raw body shape string to canonical identifier."""
    if not raw_shape:
        return None
    cleaned = raw_shape.strip().lower().replace("-", "_").replace(" ", "_")
    return BODY_SHAPE_ALIASES.get(cleaned, cleaned)


def calculate_body_shape_compatibility(outfit: Dict[str, Any], user_body_shape: Optional[str]) -> float:
    """
    Calculates styling compatibility score between an outfit and the user's selected body shape.
    
    Returns a float between 0.5 (universal/baseline compatibility) and 1.0 (ideal silhouette harmony).
    Ensures that every outfit remains accessible and styled, while boosting looks with tailored harmony.
    """
    canonical_shape = normalize_body_shape(user_body_shape)
    if not canonical_shape:
        # Default baseline compatibility when no shape is selected
        return 0.85

    # Check explicit catalog compatibility tags
    outfit_shapes = [normalize_body_shape(s) for s in outfit.get("bodyShapes", []) if s]
    compat_list = [normalize_body_shape(s) for s in outfit.get("bodyShapeCompatibility", []) if s]
    all_compat_shapes = set(outfit_shapes + compat_list)

    if canonical_shape in all_compat_shapes or "all" in all_compat_shapes or "all_shapes" in all_compat_shapes:
        explicit_score = 1.0
    else:
        explicit_score = 0.70

    # Secondary evaluation based on silhouette, waist, and neckline harmony
    affinities = SILHOUETTE_AFFINITIES.get(canonical_shape, {})
    silhouette = outfit.get("silhouette", "").lower()
    waist = outfit.get("waistDefinition", "").lower()
    neckline = outfit.get("neckline", "").lower()

    feature_bonus = 0.0
    if any(fav.lower() in silhouette for fav in affinities.get("favored_silhouettes", [])):
        feature_bonus += 0.10
    if any(fav.lower() in waist for fav in affinities.get("favored_waists", [])):
        feature_bonus += 0.05
    if any(fav.lower() in neckline for fav in affinities.get("favored_necklines", [])):
        feature_bonus += 0.05

    final_score = min(1.0, explicit_score + feature_bonus)
    return round(final_score, 3)

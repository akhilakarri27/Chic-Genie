"""Feature Engineering Pipeline for Chic Genie ML Compatibility Scoring.

Transforms user preference inputs, catalog outfit metadata, and dense RAG similarity
into fixed-length normalized numerical feature vectors for ML model training and inference.
"""

from typing import List, Dict, Any, Union, Optional
import numpy as np

from app.models.preferences import PreferencesInput
from app.services.compatibility import calculate_body_shape_compatibility
from app.services.novelty import calculate_novelty_score

FEATURE_NAMES: List[str] = [
    "rag_similarity",            # Dense semantic cosine similarity from RAG [0, 1]
    "style_match",               # Style aesthetic overlap [0, 1]
    "occasion_match",            # Occasion suitability [0, 1]
    "color_match",               # Color family and hue match [0, 1]
    "body_shape_compatibility",  # Silhouette and proportion harmony [0, 1]
    "outfit_type_match",         # Garment type format match [0, 1]
    "footwear_match",            # Footwear coordination [0, 1]
    "accessory_match",           # Jewellery and accessories match [0, 1]
    "weather_season_match",      # Weather & season suitability [0, 1]
    "fit_comfort_match",         # Drape fit and comfort alignment [0, 1]
    "novelty_score",             # Non-repetition recency score [0, 1]
    "palette_match",             # Color mood & palette classification match [0, 1]
    "formality_match",           # Formality level alignment [0, 1]
    "avoid_penalty_flag"         # Binary flag if outfit contains avoided aesthetics {0.0, 1.0}
]


def _normalize_list(value: Union[List[str], str, None]) -> List[str]:
    """Helper to convert strings/lists to clean lowercase string lists."""
    if not value:
        return []
    if isinstance(value, str):
        return [v.strip().lower() for v in value.split(",") if v.strip()]
    if isinstance(value, list):
        res = []
        for item in value:
            if isinstance(item, str):
                res.extend([v.strip().lower() for v in item.split(",") if v.strip()])
            elif item is not None:
                res.append(str(item).strip().lower())
        return res
    return [str(value).strip().lower()]


def _to_single_string(val: Any) -> str:
    """Helper to extract a clean lowercase single string."""
    if not val:
        return ""
    if isinstance(val, list):
        return str(val[0]).strip().lower() if len(val) > 0 else ""
    return str(val).strip().lower()


def extract_features_dict(
    prefs: Union[PreferencesInput, Dict[str, Any]],
    outfit: Dict[str, Any],
    rag_similarity: float = 0.5,
    novelty_score: float = 1.0
) -> Dict[str, float]:
    """
    Extracts a dictionary of all named numerical features for an (outfit, preferences) pair.
    """
    if isinstance(prefs, PreferencesInput):
        pref_dict = prefs.model_dump()
    elif isinstance(prefs, dict):
        pref_dict = prefs
    else:
        pref_dict = {}

    user_styles = set(_normalize_list(pref_dict.get("styles")))
    user_occasions = set(_normalize_list(pref_dict.get("occasions")))
    if pref_dict.get("occasion"):
        user_occasions.update(_normalize_list(pref_dict.get("occasion")))

    user_colors = set(_normalize_list(pref_dict.get("colors")))
    user_color_moods = set(_normalize_list(pref_dict.get("colorMoods")))
    if pref_dict.get("palette"):
        user_color_moods.update(_normalize_list(pref_dict.get("palette")))

    user_outfit_types = set(_normalize_list(pref_dict.get("outfitTypes")))
    if pref_dict.get("outfitType"):
        user_outfit_types.update(_normalize_list(pref_dict.get("outfitType")))

    user_body_shape = _to_single_string(pref_dict.get("bodyShape"))
    user_footwear = set(_normalize_list(pref_dict.get("footwear")))
    user_accessories = set(_normalize_list(pref_dict.get("accessories")))
    user_weather = set(_normalize_list(pref_dict.get("weather")))
    user_season = _to_single_string(pref_dict.get("season"))
    user_fit = _to_single_string(pref_dict.get("preferredFit") or pref_dict.get("fit"))
    user_comfort = _to_single_string(pref_dict.get("comfort"))

    avoid_styles = set(_normalize_list(pref_dict.get("avoidedStyles")))
    avoid_colors = set(_normalize_list(pref_dict.get("avoidedColors")))

    # Outfit fields
    outfit_style = outfit.get("style", "").lower()
    outfit_styles = set(_normalize_list(outfit.get("styles", []))) | {outfit_style}
    outfit_color = outfit.get("color", "").lower()
    outfit_colors = set(_normalize_list(outfit.get("colors", []))) | {outfit_color}
    outfit_occasions = set(_normalize_list(outfit.get("occasions", [])))
    if outfit.get("occasion"):
        outfit_occasions.add(outfit.get("occasion", "").lower())
    outfit_type = outfit.get("outfitType", "").lower()
    outfit_category = outfit.get("category", "").lower()
    outfit_weather = set(_normalize_list(outfit.get("weather", [])))
    outfit_fit = outfit.get("fit", "").lower()
    outfit_comfort = outfit.get("comfort", "").lower()
    outfit_palette = outfit.get("palette", "").lower()
    outfit_color_mood = outfit.get("colorMood", "").lower()
    outfit_color_family = outfit.get("colorFamily", "").lower()
    outfit_footwear = outfit.get("footwear", "").lower()
    outfit_acc = (outfit.get("accessories", "") + " " + outfit.get("bag", "") + " " + outfit.get("jewellery", "")).lower()
    outfit_formality = outfit.get("formality", "").lower()

    # 1. RAG Semantic Similarity
    f_rag = float(np.clip(rag_similarity, 0.0, 1.0))

    # 2. Avoid Penalty Flag
    has_avoid = bool(avoid_styles.intersection(outfit_styles) or avoid_colors.intersection(outfit_colors))
    f_avoid = 1.0 if has_avoid else 0.0

    # 3. Style Match
    if user_styles:
        if user_styles.intersection(outfit_styles) or any(us in outfit_style for us in user_styles):
            f_style = 1.0
        elif "any" in user_styles or "all" in user_styles:
            f_style = 0.85
        else:
            f_style = 0.35
    else:
        f_style = 0.70

    # 4. Occasion Match
    if user_occasions:
        if user_occasions.intersection(outfit_occasions) or any(uo in outfit.get("occasion", "").lower() for uo in user_occasions):
            f_occasion = 1.0
        else:
            f_occasion = 0.30
    else:
        f_occasion = 0.70

    # 5. Color Match
    if user_colors and "any" not in user_colors:
        if user_colors.intersection(outfit_colors) or any(uc in outfit_color for uc in user_colors):
            f_color = 1.0
        elif user_colors.intersection({outfit_color_family, outfit_color_mood}):
            f_color = 0.85
        else:
            f_color = 0.35
    else:
        f_color = 0.85

    # 6. Body Shape Silhouette Harmony
    f_body = float(calculate_body_shape_compatibility(outfit, user_body_shape))

    # 7. Outfit Type Match
    if user_outfit_types:
        if user_outfit_types.intersection({outfit_type}) or any(ut in outfit_type for ut in user_outfit_types):
            f_type = 1.0
        elif outfit_category in user_outfit_types:
            f_type = 0.80
        else:
            f_type = 0.40
    else:
        f_type = 0.70

    # 8. Footwear Match
    if user_footwear:
        f_footwear = 1.0 if any(uf in outfit_footwear for uf in user_footwear) else 0.40
    else:
        f_footwear = 0.70

    # 9. Accessory Match
    if user_accessories:
        f_accessory = 1.0 if any(ua in outfit_acc for ua in user_accessories) else 0.40
    else:
        f_accessory = 0.70

    # 10. Weather & Season Match
    weather_score = 0.7
    if user_weather:
        weather_score = 1.0 if user_weather.intersection(outfit_weather) else 0.45
    if user_season and user_season.lower() in outfit.get("season", "").lower():
        weather_score = min(1.0, weather_score + 0.15)
    f_weather_season = float(weather_score)

    # 11. Fit & Comfort Match
    fit_score = 0.60
    if user_fit and (user_fit in outfit_fit or outfit_fit in user_fit):
        fit_score += 0.25
    if user_comfort and user_comfort == outfit_comfort:
        fit_score += 0.15
    f_fit_comfort = float(min(1.0, fit_score))

    # 12. Novelty Score
    f_novelty = float(np.clip(novelty_score, 0.05, 1.0))

    # 13. Palette Match
    if user_color_moods:
        if outfit_palette in user_color_moods or outfit_color_mood in user_color_moods:
            f_palette = 1.0
        else:
            f_palette = 0.40
    else:
        f_palette = 0.75

    # 14. Formality Match
    occasion_formality_map = {
        "wedding": "festive",
        "festive": "festive",
        "work": "formal",
        "office": "smart casual",
        "dinner": "smart casual",
        "date": "smart casual",
        "party": "party",
        "casual": "casual",
        "college": "casual",
        "hangout": "casual"
    }
    user_formalities = {occasion_formality_map.get(occ, "casual") for occ in user_occasions}
    if user_formalities:
        f_formality = 1.0 if any(uf in outfit_formality for uf in user_formalities) else 0.50
    else:
        f_formality = 0.75

    return {
        "rag_similarity": round(f_rag, 4),
        "style_match": round(f_style, 4),
        "occasion_match": round(f_occasion, 4),
        "color_match": round(f_color, 4),
        "body_shape_compatibility": round(f_body, 4),
        "outfit_type_match": round(f_type, 4),
        "footwear_match": round(f_footwear, 4),
        "accessory_match": round(f_accessory, 4),
        "weather_season_match": round(f_weather_season, 4),
        "fit_comfort_match": round(f_fit_comfort, 4),
        "novelty_score": round(f_novelty, 4),
        "palette_match": round(f_palette, 4),
        "formality_match": round(f_formality, 4),
        "avoid_penalty_flag": round(f_avoid, 4)
    }


def extract_features(
    prefs: Union[PreferencesInput, Dict[str, Any]],
    outfit: Dict[str, Any],
    rag_similarity: float = 0.5,
    novelty_score: float = 1.0
) -> List[float]:
    """
    Extracts an ordered numerical feature vector matching FEATURE_NAMES.
    """
    f_dict = extract_features_dict(prefs, outfit, rag_similarity, novelty_score)
    return [f_dict[name] for name in FEATURE_NAMES]

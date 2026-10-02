"""Recommendation Engine for Chic Genie.

Handles:
- Body shape silhouette compatibility scoring
- Occasion, style, outfit type, and color harmonization
- Weather, fit, and comfort priority alignment
- Novelty calculation & non-repetition rotation
- Categorical and silhouette diversity selection
"""

from typing import List, Dict, Any, Set
from app.data.fashion_catalog import FASHION_CATALOG
from app.models.preferences import PreferencesInput, OutfitItem


class RecommendationEngine:
    """Core recommendation scoring and diversity engine."""

    def __init__(self, catalog: List[Dict[str, Any]] = None):
        self.catalog = catalog or FASHION_CATALOG

    def _normalize_str_list(self, val: Any) -> List[str]:
        if not val:
            return []
        if isinstance(val, list):
            return [str(item).lower().strip() for item in val if item]
        if isinstance(val, str):
            return [val.lower().strip()]
        return []

    def score_look(
        self,
        look: Dict[str, Any],
        prefs: PreferencesInput,
        recently_shown_set: Set[str]
    ) -> float:
        """Calculates multi-dimensional compatibility score for a styled look."""
        score = 50.0  # Base score

        # 1. BODY SHAPE COMPATIBILITY (Styling Compatibility Preference)
        body_shape = (prefs.bodyShape or "").lower().strip()
        if body_shape:
            # Map aliases
            if body_shape == "triangle":
                body_shape = "pear"
            elif body_shape == "round":
                body_shape = "oval"

            compat = [s.lower() for s in look.get("bodyShapeCompatibility", [])]
            if body_shape in compat:
                score += 24.0
            else:
                score -= 6.0  # Mild deprioritization, never absolute exclusion

            # Tailored silhouette bonuses
            silhouette = look.get("silhouette", "").lower()
            waist = look.get("waistDefinition", "").lower()
            outfit_type = look.get("outfitType", "").lower()

            if body_shape == "hourglass" and (waist == "cinched" or silhouette in ["wrap", "slip", "draped"]):
                score += 8.0
            elif body_shape == "pear" and (silhouette in ["a-line", "wide-leg", "fit-and-flare"] or "wide_leg" in outfit_type or "palazzo" in outfit_type):
                score += 8.0
            elif body_shape == "rectangle" and (waist in ["belted", "cinched"] or silhouette in ["tailored", "a-line"]):
                score += 8.0
            elif body_shape == "inverted_triangle" and (silhouette in ["wide-leg", "a-line", "fit-and-flare"] or "wide_leg" in outfit_type):
                score += 8.0
            elif body_shape == "oval" and (silhouette in ["flowy", "column", "a-line"] or waist in ["empire", "relaxed"]):
                score += 8.0

        # 2. OCCASIONS MATCH
        user_occasions = self._normalize_str_list(prefs.occasions)
        if prefs.occasion:
            user_occasions.append(prefs.occasion.lower().strip())
        
        look_occasions = [o.lower() for o in look.get("occasions", [])]
        if look.get("occasion"):
            look_occasions.append(look.get("occasion", "").lower())

        if user_occasions:
            matched_occasions = any(occ in look_occasions for occ in user_occasions)
            if matched_occasions:
                score += 20.0

        # 3. STYLES MATCH
        user_styles = self._normalize_str_list(prefs.styles)
        look_styles = [s.lower() for s in look.get("styles", [])]
        if look.get("style"):
            look_styles.append(look.get("style", "").lower())

        if user_styles:
            style_matches = sum(1 for s in user_styles if any(s in ls or ls in s for ls in look_styles))
            score += min(18.0, style_matches * 6.0)

        # 4. OUTFIT TYPE MATCH
        user_outfit_types = self._normalize_str_list(prefs.outfitTypes)
        if prefs.outfitType and prefs.outfitType != "surprise_me":
            user_outfit_types.append(prefs.outfitType.lower().strip())

        look_outfit_type = look.get("outfitType", "").lower()
        look_subcategory = (look.get("subCategory") or "").lower()

        if user_outfit_types:
            if any(t in look_outfit_type or look_outfit_type in t or t in look_subcategory for t in user_outfit_types):
                score += 18.0
            elif any("dress" in t for t in user_outfit_types) and "dress" in look_outfit_type:
                score += 12.0
            elif any("saree" in t for t in user_outfit_types) and "saree" in look_outfit_type:
                score += 12.0

        # 5. COLOR & COLOR MOOD MATCH
        user_colors = self._normalize_str_list(prefs.colors)
        if user_colors:
            if "any" in user_colors:
                score += 4.0
            else:
                look_colors = [c.lower() for c in look.get("colors", [])]
                look_color = look.get("color", "").lower()
                look_color_family = look.get("colorFamily", "").lower()
                
                color_overlap = sum(
                    1 for uc in user_colors
                    if uc in look_colors or uc == look_color or uc == look_color_family
                )
                score += min(14.0, color_overlap * 5.0)

        # Palette / Mood match
        palette_preference = (prefs.palette or "").lower().strip()
        user_moods = self._normalize_str_list(prefs.colorMoods)
        if palette_preference and palette_preference != "no_preference":
            user_moods.append(palette_preference)

        look_palette = look.get("paletteMood", "").lower()
        if user_moods and any(m in look_palette or look_palette in m for m in user_moods):
            score += 8.0

        # 6. WEATHER MATCH
        user_weather = self._normalize_str_list(prefs.weather)
        look_weather = [w.lower() for w in look.get("weather", [])] if isinstance(look.get("weather"), list) else [str(look.get("weather", "")).lower()]
        if user_weather and any(w in look_weather for w in user_weather):
            score += 6.0

        # 7. FIT & COMFORT MATCH
        fit_pref = (prefs.fit or "").lower().strip()
        if not fit_pref and prefs.preferredFit:
            fit_pref = str(prefs.preferredFit).lower().strip()
        if fit_pref and fit_pref in look.get("fit", "").lower():
            score += 5.0

        comfort_pref = (prefs.comfort or "").lower().strip()
        if comfort_pref and comfort_pref in look.get("comfort", "").lower():
            score += 5.0

        # 8. FOOTWEAR MATCH
        user_footwear = self._normalize_str_list(prefs.footwear)
        look_footwear = (look.get("footwear") or "").lower()
        if user_footwear and "any" not in user_footwear:
            if any(fw in look_footwear for fw in user_footwear):
                score += 6.0

        # 9. EXCLUSIONS / AVOID PENALTIES
        avoid_flags = self._normalize_str_list(prefs.avoid) + self._normalize_str_list(prefs.avoidedStyles)
        if avoid_flags:
            if "no_heels" in avoid_flags and ("heel" in look_footwear or "stiletto" in look_footwear or "pumps" in look_footwear):
                score -= 35.0
            if "no_jeans" in avoid_flags and ("jeans" in look_outfit_type or "denim" in (look.get("bottom") or "").lower()):
                score -= 35.0
            if "no_traditional" in avoid_flags and (look.get("category") == "Ethnic" or "saree" in look_outfit_type or "kurti" in look_outfit_type):
                score -= 40.0
            if "no_oversized" in avoid_flags and look.get("fit") == "oversized":
                score -= 25.0

        # 10. NOVELTY / RECENTLY SHOWN PENALTY
        if look["id"] in recently_shown_set:
            score -= 45.0  # Strongly penalize recently viewed items for high novelty

        return score

    def get_recommendations(
        self,
        prefs: PreferencesInput,
        count: int = 3,
        seed_offset: int = 0,
        recently_shown: List[str] = None
    ) -> List[OutfitItem]:
        """Generates curated, non-repetitive, diverse recommendations."""
        recently_shown_set = set(recently_shown or [])

        # Score every outfit in catalog
        scored_items = []
        for look in self.catalog:
            score = self.score_look(look, prefs, recently_shown_set)
            
            # Formulate luxury styled match score (88% - 99%)
            pseudo_random = (len(look["name"]) * 7 + seed_offset * 3) % 4
            normalized_pct = int(min(99, max(88, round(score * 0.94) + pseudo_random)))

            scored_look = dict(look)
            scored_look["preferenceMatch"] = normalized_pct
            
            # Dynamic styled explanation
            body_text = f" tailored for {prefs.bodyShape.capitalize()} silhouette" if prefs.bodyShape else ""
            occasion_text = f" for {prefs.occasion or 'your occasion'}" if prefs.occasion else ""
            scored_look["explanation"] = f"Curated by Chic Genie{body_text}{occasion_text} with balanced aesthetic harmony."

            scored_items.append((score, scored_look))

        # Sort descending by calculated score
        scored_items.sort(key=lambda x: x[0], reverse=True)

        # Apply seed_offset rotation among top candidates for "Give Me Another Look"
        unseen_items = [item[1] for item in scored_items if item[1]["id"] not in recently_shown_set]
        pool = unseen_items if len(unseen_items) >= count else [item[1] for item in scored_items]

        # Apply offset rotation if requested
        if seed_offset > 0 and len(pool) > count:
            offset_idx = (seed_offset * count) % len(pool)
            rotated_pool = pool[offset_idx:] + pool[:offset_idx]
        else:
            rotated_pool = pool

        # DIVERSITY SELECTION: Ensure selected looks vary in category / outfit type / silhouette
        selected: List[Dict[str, Any]] = []
        chosen_types: Set[str] = set()
        chosen_categories: Set[str] = set()

        for candidate in rotated_pool:
            if len(selected) >= count:
                break
            
            outfit_type = candidate.get("outfitType", "")
            category = candidate.get("category", "")

            # Prioritize distinct outfit types and categories
            if len(selected) == 0 or (outfit_type not in chosen_types) or (len(rotated_pool) < count * 2):
                selected.append(candidate)
                chosen_types.add(outfit_type)
                chosen_categories.add(category)

        # Fill any remaining slots if diversity filter was restrictive
        if len(selected) < count:
            for candidate in rotated_pool:
                if len(selected) >= count:
                    break
                if not any(s["id"] == candidate["id"] for s in selected):
                    selected.append(candidate)

        # Convert dictionaries to Pydantic OutfitItem models
        return [OutfitItem(**item) for item in selected]

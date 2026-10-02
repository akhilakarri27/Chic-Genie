"""Recommendation Engine Service for Chic Genie."""

from typing import List, Dict, Any, Optional, Union
from app.core.config import settings
from app.data import load_fashion_catalog
from app.models.preferences import PreferencesInput
from app.models.outfit import Outfit
from app.services.compatibility import calculate_body_shape_compatibility
from app.services.novelty import calculate_novelty_score, select_diverse_recommendations


class RecommendationEngine:
    """
    Intelligent fashion recommendation engine.
    Applies multi-factor weighted scoring, silhouette compatibility,
    palette harmony, and non-repetition diversity curation.
    """

    def __init__(self):
        self.catalog = load_fashion_catalog()

    def _normalize_list(self, value: Union[List[str], str, None]) -> List[str]:
        """Normalizes string or list into a clean lowercase string list."""
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

    def _to_single_string(self, val: Any) -> str:
        """Safely extracts a single string from a string, list, or None."""
        if not val:
            return ""
        if isinstance(val, list):
            return str(val[0]).strip().lower() if len(val) > 0 else ""
        return str(val).strip().lower()

    def _score_outfit(
        self,
        outfit: Dict[str, Any],
        prefs: PreferencesInput,
        recently_shown: List[str]
    ) -> float:
        """
        Calculates composite weighted match score for an outfit against user preferences.
        """
        weights = settings.SCORING_WEIGHTS
        total_score = 0.0

        # Normalization
        user_styles = set(self._normalize_list(prefs.styles))
        user_occasions = set(self._normalize_list(prefs.occasions))
        if prefs.occasion:
            user_occasions.update(self._normalize_list(prefs.occasion))
        
        user_colors = set(self._normalize_list(prefs.colors))
        user_color_moods = set(self._normalize_list(prefs.colorMoods))
        if prefs.palette:
            user_color_moods.update(self._normalize_list(prefs.palette))

        user_outfit_types = set(self._normalize_list(prefs.outfitTypes))
        if prefs.outfitType:
            user_outfit_types.update(self._normalize_list(prefs.outfitType))

        user_footwear = set(self._normalize_list(prefs.footwear))
        user_accessories = set(self._normalize_list(prefs.accessories))
        user_weather = set(self._normalize_list(prefs.weather))
        user_fit = self._to_single_string(prefs.preferredFit or prefs.fit)
        user_comfort = self._to_single_string(prefs.comfort)


        # Avoid / Exclusion check
        avoid_styles = set(self._normalize_list(prefs.avoidedStyles))
        avoid_colors = set(self._normalize_list(prefs.avoidedColors))
        avoid_flags = set(self._normalize_list(prefs.avoid))

        outfit_style = outfit.get("style", "").lower()
        outfit_styles = set(self._normalize_list(outfit.get("styles", []))) | {outfit_style}
        outfit_color = outfit.get("color", "").lower()
        outfit_colors = set(self._normalize_list(outfit.get("colors", []))) | {outfit_color}

        if avoid_styles.intersection(outfit_styles) or avoid_colors.intersection(outfit_colors):
            return -50.0  # Heavy penalty for explicitly avoided aesthetics

        # 1. Style Match Score
        style_score = 0.5
        if user_styles:
            if user_styles.intersection(outfit_styles) or any(us in outfit_style for us in user_styles):
                style_score = 1.0
            elif "any" in user_styles or "all" in user_styles:
                style_score = 0.8
            else:
                style_score = 0.3
        total_score += style_score * weights.get("style_match", 25.0)

        # 2. Body Shape Compatibility
        shape_compat = calculate_body_shape_compatibility(outfit, prefs.bodyShape)
        total_score += shape_compat * weights.get("body_shape_compatibility", 20.0)

        # 3. Occasion Match Score
        occasion_score = 0.5
        outfit_occasions = set(self._normalize_list(outfit.get("occasions", [])))
        if outfit.get("occasion"):
            outfit_occasions.add(outfit.get("occasion", "").lower())
        if user_occasions:
            if user_occasions.intersection(outfit_occasions) or any(uo in outfit.get("occasion", "").lower() for uo in user_occasions):
                occasion_score = 1.0
            else:
                occasion_score = 0.25
        total_score += occasion_score * weights.get("occasion_match", 20.0)

        # 4. Color & Palette Match Score
        color_score = 0.5
        if user_colors and "any" not in user_colors:
            color_family = outfit.get("colorFamily", "").lower()
            color_mood = outfit.get("colorMood", "").lower()
            if user_colors.intersection(outfit_colors) or any(uc in outfit_color for uc in user_colors):
                color_score = 1.0
            elif user_colors.intersection({color_family, color_mood}):
                color_score = 0.85
            elif user_color_moods and (color_mood in user_color_moods or outfit.get("palette", "").lower() in user_color_moods):
                color_score = 0.75
            else:
                color_score = 0.35
        elif "any" in user_colors or not user_colors:
            color_score = 0.9
        total_score += color_score * weights.get("color_match", 15.0)

        # 5. Outfit Type Match Score
        type_score = 0.5
        outfit_type = outfit.get("outfitType", "").lower()
        if user_outfit_types:
            if user_outfit_types.intersection({outfit_type}) or any(ut in outfit_type for ut in user_outfit_types):
                type_score = 1.0
            elif outfit.get("category", "").lower() in user_outfit_types:
                type_score = 0.8
            else:
                type_score = 0.35
        total_score += type_score * weights.get("outfit_type_match", 15.0)

        # 6. Footwear & Accessories Match
        footwear_score = 0.6
        outfit_footwear = outfit.get("footwear", "").lower()
        if user_footwear:
            if any(uf in outfit_footwear for uf in user_footwear):
                footwear_score = 1.0
            else:
                footwear_score = 0.4
        total_score += footwear_score * weights.get("footwear_match", 10.0)

        accessory_score = 0.7
        outfit_accessories = (outfit.get("accessories", "") + " " + outfit.get("bag", "") + " " + outfit.get("jewellery", "")).lower()
        if user_accessories:
            if any(ua in outfit_accessories for ua in user_accessories):
                accessory_score = 1.0
        total_score += accessory_score * weights.get("accessory_match", 5.0)

        # 7. Season & Weather Match
        weather_score = 0.7
        outfit_weather = set(self._normalize_list(outfit.get("weather", [])))
        if user_weather:
            if user_weather.intersection(outfit_weather):
                weather_score = 1.0
            else:
                weather_score = 0.5
        total_score += weather_score * weights.get("season_weather_match", 10.0)

        # 8. Fit & Comfort Match
        fit_score = 0.7
        outfit_fit = outfit.get("fit", "").lower()
        if user_fit:
            if user_fit in outfit_fit or outfit_fit in user_fit:
                fit_score = 1.0
        if user_comfort:
            if user_comfort == outfit.get("comfort", "").lower():
                fit_score = min(1.0, fit_score + 0.15)
        total_score += fit_score * weights.get("fit_comfort_match", 10.0)

        # 9. Novelty Bonus / Penalty
        outfit_id = outfit.get("id", "")
        novelty_mult = calculate_novelty_score(outfit_id, recently_shown)
        total_score *= novelty_mult

        return round(total_score, 2)

    def _generate_explanation(self, outfit: Dict[str, Any], prefs: PreferencesInput) -> str:
        """Generates dynamic styling rationale for the curated look."""
        shape_text = f"harmonizing with your {prefs.bodyShape.capitalize()} silhouette" if prefs.bodyShape else "curating balanced proportion"
        style_val = prefs.styles[0] if isinstance(prefs.styles, list) and prefs.styles else (prefs.styles if isinstance(prefs.styles, str) else "your personal style")
        occasion_val = prefs.occasion or (prefs.occasions[0] if isinstance(prefs.occasions, list) and prefs.occasions else "your selected occasion")
        color_val = outfit.get("color", "").replace("_", " ").title()

        return f"Chic Genie curated this {color_val} look for {occasion_val}, {shape_text} and channeling {style_val} aesthetic with coordinated finishing accents."

    def get_recommendations(
        self,
        prefs: PreferencesInput,
        recently_shown: List[str] = None,
        count: int = 3,
        seed_offset: int = 0
    ) -> List[Outfit]:
        """
        Curates top diverse recommendations matching user styling preferences.
        """
        recently_shown = recently_shown or []
        # Reload catalog to ensure latest data
        catalog = self.catalog or load_fashion_catalog()
        if not catalog:
            return []

        # Calculate scores for all catalog outfits
        scored_candidates = []
        for outfit in catalog:
            score = self._score_outfit(outfit, prefs, recently_shown)
            scored_candidates.append({
                **outfit,
                "_score": score
            })

        # Sort descending by score
        scored_candidates.sort(key=lambda x: x["_score"], reverse=True)

        # Apply seed_offset for non-repetition / regeneration if requested
        if seed_offset > 0 and len(scored_candidates) > count:
            offset = (seed_offset * count) % len(scored_candidates)
            scored_candidates = scored_candidates[offset:] + scored_candidates[:offset]

        # Select diverse top candidates
        selected_raw = select_diverse_recommendations(
            ranked_candidates=scored_candidates,
            count=count,
            recently_shown=recently_shown
        )

        # Convert to Pydantic Outfit models with refined match percentages
        results: List[Outfit] = []
        for idx, item in enumerate(selected_raw):
            raw_score = item.get("_score", 100.0)
            # Normalize display match percentage between 92% and 99%
            match_pct = min(99, max(90, int(88 + (raw_score / 150.0) * 11))) - (idx * 2)

            explanation = self._generate_explanation(item, prefs)

            outfit_data = {
                **item,
                "preferenceMatch": match_pct,
                "explanation": explanation
            }
            # Clean internal scoring field
            outfit_data.pop("_score", None)

            try:
                results.append(Outfit(**outfit_data))
            except Exception as e:
                print(f"Error parsing outfit {item.get('id')}: {e}")

        return results

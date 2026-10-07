"""Recommendation Engine Service for Chic Genie.

Integrates RAG Semantic Search, RandomForest Machine Learning Compatibility Prediction,
and Multi-Factor Hybrid Reranking with graceful fallback to heuristic scoring.
"""

import logging
from typing import List, Dict, Any, Optional, Union
from app.core.config import settings
from app.data import load_fashion_catalog
from app.models.preferences import PreferencesInput
from app.models.outfit import Outfit
from app.services.compatibility import calculate_body_shape_compatibility
from app.services.novelty import calculate_novelty_score, select_diverse_recommendations

logger = logging.getLogger("chic_genie.recommendation_engine")
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")


class RecommendationEngine:
    """
    Intelligent fashion recommendation engine for Chic Genie.
    Orchestrates:
    1. Dense semantic RAG vector retrieval from ChromaDB.
    2. Scikit-learn RandomForest ML compatibility scoring.
    3. Multi-factor hybrid ranking (RAG: 0.35, ML: 0.35, Pref: 0.15, Body: 0.10, Novelty: 0.05).
    4. Diversity curation and graceful heuristic fallback.
    """

    def __init__(self):
        self.catalog = load_fashion_catalog()
        self._catalog_map = {str(item.get("id")): item for item in self.catalog if item.get("id")}

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

    def _score_outfit_heuristic(
        self,
        outfit: Dict[str, Any],
        prefs: PreferencesInput,
        recently_shown: List[str]
    ) -> float:
        """
        Calculates composite heuristic match score for fallback mode.
        """
        weights = settings.SCORING_WEIGHTS
        total_score = 0.0

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

        avoid_styles = set(self._normalize_list(prefs.avoidedStyles))
        avoid_colors = set(self._normalize_list(prefs.avoidedColors))

        outfit_style = outfit.get("style", "").lower()
        outfit_styles = set(self._normalize_list(outfit.get("styles", []))) | {outfit_style}
        outfit_color = outfit.get("color", "").lower()
        outfit_colors = set(self._normalize_list(outfit.get("colors", []))) | {outfit_color}

        if avoid_styles.intersection(outfit_styles) or avoid_colors.intersection(outfit_colors):
            return -50.0

        # Style Match
        style_score = 0.5
        if user_styles:
            if user_styles.intersection(outfit_styles) or any(us in outfit_style for us in user_styles):
                style_score = 1.0
            elif "any" in user_styles or "all" in user_styles:
                style_score = 0.85
            else:
                style_score = 0.35
        total_score += style_score * weights.get("style_match", 25.0)

        # Body Shape Compatibility
        shape_compat = calculate_body_shape_compatibility(outfit, prefs.bodyShape)
        total_score += shape_compat * weights.get("body_shape_compatibility", 20.0)

        # Occasion Match
        occasion_score = 0.5
        outfit_occasions = set(self._normalize_list(outfit.get("occasions", [])))
        if outfit.get("occasion"):
            outfit_occasions.add(outfit.get("occasion", "").lower())
        if user_occasions:
            if user_occasions.intersection(outfit_occasions) or any(uo in outfit.get("occasion", "").lower() for uo in user_occasions):
                occasion_score = 1.0
            else:
                occasion_score = 0.30
        total_score += occasion_score * weights.get("occasion_match", 20.0)

        # Color & Palette Match
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

        # Outfit Type Match
        type_score = 0.5
        outfit_type = outfit.get("outfitType", "").lower()
        if user_outfit_types:
            if user_outfit_types.intersection({outfit_type}) or any(ut in outfit_type for ut in user_outfit_types):
                type_score = 1.0
            elif outfit.get("category", "").lower() in user_outfit_types:
                type_score = 0.80
            else:
                type_score = 0.35
        total_score += type_score * weights.get("outfit_type_match", 15.0)

        # Footwear & Accessories Match
        footwear_score = 0.6
        outfit_footwear = outfit.get("footwear", "").lower()
        if user_footwear:
            footwear_score = 1.0 if any(uf in outfit_footwear for uf in user_footwear) else 0.4
        total_score += footwear_score * weights.get("footwear_match", 10.0)

        accessory_score = 0.7
        outfit_accessories = (outfit.get("accessories", "") + " " + outfit.get("bag", "") + " " + outfit.get("jewellery", "")).lower()
        if user_accessories and any(ua in outfit_accessories for ua in user_accessories):
            accessory_score = 1.0
        total_score += accessory_score * weights.get("accessory_match", 5.0)

        # Season & Weather Match
        weather_score = 0.7
        outfit_weather = set(self._normalize_list(outfit.get("weather", [])))
        if user_weather:
            weather_score = 1.0 if user_weather.intersection(outfit_weather) else 0.5
        total_score += weather_score * weights.get("season_weather_match", 10.0)

        # Fit & Comfort Match
        fit_score = 0.7
        outfit_fit = outfit.get("fit", "").lower()
        if user_fit and (user_fit in outfit_fit or outfit_fit in user_fit):
            fit_score = 1.0
        if user_comfort and user_comfort == outfit.get("comfort", "").lower():
            fit_score = min(1.0, fit_score + 0.15)
        total_score += fit_score * weights.get("fit_comfort_match", 10.0)

        # Novelty Penalty
        novelty_mult = calculate_novelty_score(outfit.get("id", ""), recently_shown)
        total_score *= novelty_mult

        return round(total_score, 2)

    def _generate_explanation(self, outfit: Dict[str, Any], prefs: PreferencesInput) -> str:
        """Generates styling rationale for the curated look."""
        shape_text = f"harmonizing with your {prefs.bodyShape.capitalize()} silhouette" if prefs.bodyShape else "curating balanced proportion"
        style_val = prefs.styles[0] if isinstance(prefs.styles, list) and prefs.styles else (prefs.styles if isinstance(prefs.styles, str) else "your personal style")
        occasion_val = prefs.occasion or (prefs.occasions[0] if isinstance(prefs.occasions, list) and prefs.occasions else "your selected occasion")
        color_val = outfit.get("color", "").replace("_", " ").title()

        return f"Chic Genie curated this {color_val} look for {occasion_val}, {shape_text} and channeling {style_val} aesthetic with coordinated finishing accents."

    def _recommend_ai_pipeline(
        self,
        prefs: PreferencesInput,
        recently_shown: List[str],
        count: int,
        seed_offset: int
    ) -> List[Outfit]:
        """
        Executes production AI recommendation pipeline:
        RAG candidate retrieval -> Feature engineering -> ML prediction -> Final hybrid fusion.
        """
        from app.services.rag_service import rag_service
        from app.services.hybrid_reranker import hybrid_reranker
        from app.ml.predictor import predictor

        weights = settings.FINAL_PIPELINE_WEIGHTS
        w_rag = weights.get("rag_similarity", 0.35)
        w_ml = weights.get("ml_compatibility", 0.35)
        w_pref = weights.get("preference_match", 0.15)
        w_body = weights.get("body_shape_compatibility", 0.10)
        w_nov = weights.get("novelty", 0.05)

        # 1. Retrieve candidates using RAG semantic search
        fetch_candidate_count = max(12, count * 3)
        rag_candidates = rag_service.retrieve_candidates(
            prefs=prefs,
            top_k=fetch_candidate_count,
            recently_shown=recently_shown
        )

        if not rag_candidates:
            raise ValueError("RAG service returned empty candidates pool.")

        # 2. Score candidates with multi-factor fusion
        scored_candidates: List[Dict[str, Any]] = []

        for cand in rag_candidates:
            outfit_id = str(cand.get("id"))
            catalog_item = self._catalog_map.get(outfit_id) or cand.get("raw_catalog_item", {})

            # Sub-scores
            s_rag = float(cand.get("similarity_score", 0.60))
            s_pref = float(hybrid_reranker.calculate_preference_match_score(catalog_item, prefs))
            s_body = float(calculate_body_shape_compatibility(catalog_item, prefs.bodyShape))
            s_nov = float(calculate_novelty_score(outfit_id, recently_shown))
            s_ml = float(predictor.predict_score(prefs, catalog_item, rag_similarity=s_rag, novelty_score=s_nov))

            # Final composite score
            final_score = (
                (w_rag * s_rag) +
                (w_ml * s_ml) +
                (w_pref * s_pref) +
                (w_body * s_body) +
                (w_nov * s_nov)
            )

            scored_candidates.append({
                **catalog_item,
                "id": outfit_id,
                "ragScore": round(s_rag, 4),
                "mlCompatibilityScore": round(s_ml, 4),
                "hybridScore": round(final_score, 4),
                "_score": final_score * 100.0,
                "_final_score": final_score
            })

        # 3. Sort descending by final composite score
        scored_candidates.sort(key=lambda x: x["_final_score"], reverse=True)

        # 4. Apply seed_offset if requested for regeneration
        if seed_offset > 0 and len(scored_candidates) > count:
            offset = (seed_offset * count) % len(scored_candidates)
            scored_candidates = scored_candidates[offset:] + scored_candidates[:offset]

        # 5. Apply diversity curation to select top distinct ensembles
        selected_raw = select_diverse_recommendations(
            ranked_candidates=scored_candidates,
            count=count,
            recently_shown=recently_shown
        )

        # 6. Build Outfit Pydantic models
        from app.services.llm_service import llm_service
        results: List[Outfit] = []
        for idx, item in enumerate(selected_raw):
            final_val = item.get("_final_score", 0.85)
            # Map into display percentage between 91% and 99%
            match_pct = min(99, max(88, int(84 + (final_val * 15)))) - (idx * 2)

            explanation, styling_tip = llm_service.generate_deterministic_explanation(item, prefs)

            outfit_data = {
                **item,
                "preferenceMatch": match_pct,
                "explanation": explanation,
                "stylingTip": styling_tip,
                "aiGenerated": False
            }
            outfit_data.pop("_score", None)
            outfit_data.pop("_final_score", None)

            try:
                results.append(Outfit(**outfit_data))
            except Exception as e:
                logger.error("Error formatting Outfit model for %s: %s", item.get("id"), e)

        return results

    def _recommend_heuristic_fallback(
        self,
        prefs: PreferencesInput,
        recently_shown: List[str],
        count: int,
        seed_offset: int
    ) -> List[Outfit]:
        """
        Fallback heuristic rule-based recommender.
        """
        from app.services.llm_service import llm_service
        catalog = self.catalog or load_fashion_catalog()
        if not catalog:
            return []

        scored_candidates = []
        for outfit in catalog:
            score = self._score_outfit_heuristic(outfit, prefs, recently_shown)
            scored_candidates.append({
                **outfit,
                "_score": score
            })

        scored_candidates.sort(key=lambda x: x["_score"], reverse=True)

        if seed_offset > 0 and len(scored_candidates) > count:
            offset = (seed_offset * count) % len(scored_candidates)
            scored_candidates = scored_candidates[offset:] + scored_candidates[:offset]

        selected_raw = select_diverse_recommendations(
            ranked_candidates=scored_candidates,
            count=count,
            recently_shown=recently_shown
        )

        results: List[Outfit] = []
        for idx, item in enumerate(selected_raw):
            raw_score = item.get("_score", 100.0)
            match_pct = min(99, max(90, int(88 + (raw_score / 150.0) * 11))) - (idx * 2)
            explanation, styling_tip = llm_service.generate_deterministic_explanation(item, prefs)

            outfit_data = {
                **item,
                "preferenceMatch": match_pct,
                "explanation": explanation,
                "stylingTip": styling_tip,
                "aiGenerated": False
            }
            outfit_data.pop("_score", None)

            try:
                results.append(Outfit(**outfit_data))
            except Exception as e:
                logger.error("Error formatting fallback Outfit for %s: %s", item.get("id"), e)

        return results

    def get_recommendations(
        self,
        prefs: PreferencesInput,
        recently_shown: List[str] = None,
        count: int = 3,
        seed_offset: int = 0
    ) -> List[Outfit]:
        """
        Primary entry point for recommendation generation.
        Attempts AI Pipeline (RAG + RandomForest ML + Hybrid) with automatic fallback on failure.
        """
        recently_shown = recently_shown or []

        if settings.AI_RECOMMENDATIONS_ENABLED:
            try:
                logger.info("Executing AI Recommendation Pipeline (RAG + RandomForest ML + Hybrid Reranker)...")
                recommendations = self._recommend_ai_pipeline(
                    prefs=prefs,
                    recently_shown=recently_shown,
                    count=count,
                    seed_offset=seed_offset
                )
                if recommendations:
                    logger.info("AI Recommendation Pipeline returned %d looks successfully.", len(recommendations))
                    return recommendations
            except Exception as e:
                logger.warning(
                    "AI Recommendation Pipeline encountered an error (%s). Falling back gracefully to Heuristic Engine.",
                    e
                )

        logger.info("Executing Heuristic Rule-Based Recommendation Engine...")
        return self._recommend_heuristic_fallback(
            prefs=prefs,
            recently_shown=recently_shown,
            count=count,
            seed_offset=seed_offset
        )

    async def get_recommendations_async(
        self,
        prefs: PreferencesInput,
        recently_shown: List[str] = None,
        count: int = 3,
        seed_offset: int = 0
    ) -> List[Outfit]:
        """
        Asynchronous recommendation generation with LLM explanation synthesis.
        """
        from app.services.llm_service import llm_service

        outfits = self.get_recommendations(
            prefs=prefs,
            recently_shown=recently_shown,
            count=count,
            seed_offset=seed_offset
        )

        # Enrich final top outfits using LLM service
        try:
            enriched_outfits = await llm_service.enrich_outfits_with_explanations(outfits, prefs)
            return enriched_outfits
        except Exception as e:
            logger.warning("Async LLM enrichment error (%s). Returning baseline explanations.", e)
            return outfits

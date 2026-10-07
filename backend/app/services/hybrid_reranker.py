"""Hybrid Reranking Service for Chic Genie.

Blends dense semantic vector retrieval (RAG) with domain-specific rules:
1. RAG Semantic Similarity: 0.50
2. User Preference / Rule Match: 0.25
3. Body Shape Silhouette Harmony: 0.15
4. Session Novelty & Recency Decay: 0.10

All component scores are normalized to [0, 1].
Enforces multi-factor diversity filtering on final ranked candidates.
"""

import logging
from typing import List, Dict, Any, Optional, Union

from app.core.config import settings
from app.models.preferences import PreferencesInput
from app.services.compatibility import calculate_body_shape_compatibility
from app.services.novelty import calculate_novelty_score, select_diverse_recommendations
from app.services.rag_service import rag_service, FashionRAGService
from app.data import load_fashion_catalog

logger = logging.getLogger("chic_genie.hybrid_reranker")
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")


class HybridRerankerService:
    """
    Combines dense neural semantic embeddings with domain-informed heuristics
    to deliver personalized, high-precision fashion look rankings.
    """

    def __init__(self, rag: Optional[FashionRAGService] = None):
        self.rag = rag or rag_service
        self.weights = settings.HYBRID_WEIGHTS
        self._catalog_cache: Dict[str, Dict[str, Any]] = {}
        self._refresh_catalog()

    def _refresh_catalog(self):
        """Builds in-memory ID-to-outfit dictionary."""
        catalog = load_fashion_catalog()
        self._catalog_cache = {str(item.get("id")): item for item in catalog if item.get("id")}

    def _normalize_list(self, value: Union[List[str], str, None]) -> List[str]:
        """Converts strings/lists to clean lowercase string lists."""
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
        """Extracts clean lowercase single string."""
        if not val:
            return ""
        if isinstance(val, list):
            return str(val[0]).strip().lower() if len(val) > 0 else ""
        return str(val).strip().lower()

    def calculate_preference_match_score(self, outfit: Dict[str, Any], prefs: PreferencesInput) -> float:
        """
        Calculates normalized rule-based preference match score S_pref in [0.0, 1.0].
        Evaluates style, occasion, color/palette, outfit type, footwear, accessories, weather, and fit.
        """
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

        # Avoidance penalty
        avoid_styles = set(self._normalize_list(prefs.avoidedStyles))
        avoid_colors = set(self._normalize_list(prefs.avoidedColors))

        outfit_style = outfit.get("style", "").lower()
        outfit_styles = set(self._normalize_list(outfit.get("styles", []))) | {outfit_style}
        outfit_color = outfit.get("color", "").lower()
        outfit_colors = set(self._normalize_list(outfit.get("colors", []))) | {outfit_color}

        if avoid_styles.intersection(outfit_styles) or avoid_colors.intersection(outfit_colors):
            return 0.0  # Heavily penalized

        score_points = 0.0
        max_points = 0.0

        # 1. Style Match (Weight: 25)
        w_style = 25.0
        max_points += w_style
        if user_styles:
            if user_styles.intersection(outfit_styles) or any(us in outfit_style for us in user_styles):
                score_points += 1.0 * w_style
            elif "any" in user_styles or "all" in user_styles:
                score_points += 0.85 * w_style
            else:
                score_points += 0.35 * w_style
        else:
            score_points += 0.70 * w_style

        # 2. Occasion Match (Weight: 20)
        w_occ = 20.0
        max_points += w_occ
        outfit_occasions = set(self._normalize_list(outfit.get("occasions", [])))
        if outfit.get("occasion"):
            outfit_occasions.add(outfit.get("occasion", "").lower())
        if user_occasions:
            if user_occasions.intersection(outfit_occasions) or any(uo in outfit.get("occasion", "").lower() for uo in user_occasions):
                score_points += 1.0 * w_occ
            else:
                score_points += 0.30 * w_occ
        else:
            score_points += 0.70 * w_occ

        # 3. Color & Palette Match (Weight: 15)
        w_color = 15.0
        max_points += w_color
        if user_colors and "any" not in user_colors:
            color_family = outfit.get("colorFamily", "").lower()
            color_mood = outfit.get("colorMood", "").lower()
            palette = outfit.get("palette", "").lower()
            if user_colors.intersection(outfit_colors) or any(uc in outfit_color for uc in user_colors):
                score_points += 1.0 * w_color
            elif user_colors.intersection({color_family, color_mood}):
                score_points += 0.85 * w_color
            elif user_color_moods and (color_mood in user_color_moods or palette in user_color_moods):
                score_points += 0.75 * w_color
            else:
                score_points += 0.40 * w_color
        else:
            score_points += 0.85 * w_color

        # 4. Outfit Type Match (Weight: 15)
        w_type = 15.0
        max_points += w_type
        outfit_type = outfit.get("outfitType", "").lower()
        if user_outfit_types:
            if user_outfit_types.intersection({outfit_type}) or any(ut in outfit_type for ut in user_outfit_types):
                score_points += 1.0 * w_type
            elif outfit.get("category", "").lower() in user_outfit_types:
                score_points += 0.80 * w_type
            else:
                score_points += 0.40 * w_type
        else:
            score_points += 0.70 * w_type

        # 5. Footwear & Accessory Match (Weight: 15 = 10 footwear + 5 accessory)
        w_acc = 15.0
        max_points += w_acc
        footwear_val = outfit.get("footwear", "").lower()
        acc_val = (outfit.get("accessories", "") + " " + outfit.get("bag", "") + " " + outfit.get("jewellery", "")).lower()
        
        acc_subscore = 0.5
        if user_footwear and any(uf in footwear_val for uf in user_footwear):
            acc_subscore += 0.3
        if user_accessories and any(ua in acc_val for ua in user_accessories):
            acc_subscore += 0.2
        score_points += min(1.0, acc_subscore) * w_acc

        # 6. Season & Weather Match (Weight: 10)
        w_weather = 10.0
        max_points += w_weather
        outfit_weather = set(self._normalize_list(outfit.get("weather", [])))
        if user_weather:
            if user_weather.intersection(outfit_weather):
                score_points += 1.0 * w_weather
            else:
                score_points += 0.50 * w_weather
        else:
            score_points += 0.75 * w_weather

        # 7. Fit & Comfort Match (Weight: 10)
        w_fit = 10.0
        max_points += w_fit
        outfit_fit = outfit.get("fit", "").lower()
        fit_sub = 0.6
        if user_fit and (user_fit in outfit_fit or outfit_fit in user_fit):
            fit_sub += 0.25
        if user_comfort and user_comfort == outfit.get("comfort", "").lower():
            fit_sub += 0.15
        score_points += min(1.0, fit_sub) * w_fit

        normalized_score = score_points / max_points if max_points > 0 else 0.5
        return max(0.0, min(1.0, round(normalized_score, 4)))

    def calculate_hybrid_score(
        self,
        rag_score: float,
        pref_score: float,
        body_score: float,
        novelty_score: float
    ) -> float:
        """
        Calculates the transparent weighted hybrid composite score:
        Final = (0.50 * RAG) + (0.25 * Preference) + (0.15 * BodyShape) + (0.10 * Novelty)
        """
        w_rag = self.weights.get("rag_semantic_similarity", 0.50)
        w_pref = self.weights.get("preference_match", 0.25)
        w_body = self.weights.get("body_shape_compatibility", 0.15)
        w_nov = self.weights.get("novelty", 0.10)

        hybrid = (
            (w_rag * rag_score) +
            (w_pref * pref_score) +
            (w_body * body_score) +
            (w_nov * novelty_score)
        )
        return round(hybrid, 4)

    def rerank(
        self,
        prefs: PreferencesInput,
        candidate_pool: Optional[List[Dict[str, Any]]] = None,
        top_k: int = 3,
        recently_shown: Optional[List[str]] = None,
        rag_candidate_count: int = 12
    ) -> List[Dict[str, Any]]:
        """
        Executes complete hybrid reranking workflow:
        1. Retrieves broad candidate pool from RAG semantic search.
        2. Computes normalized sub-scores for each candidate.
        3. Computes final hybrid score.
        4. Ranks candidates descending by hybrid score.
        5. Applies diversity filtering to return top_k distinct ensembles.
        """
        recently_shown = recently_shown or []
        self._refresh_catalog()

        # Step 1: Retrieve RAG candidates if not passed explicitly
        if candidate_pool is None:
            raw_rag_candidates = self.rag.retrieve_candidates(
                prefs=prefs,
                top_k=rag_candidate_count,
                recently_shown=recently_shown
            )
        else:
            raw_rag_candidates = candidate_pool

        if not raw_rag_candidates:
            logger.warning("No candidates available for hybrid reranking.")
            return []

        # Step 2: Calculate all component scores
        scored_candidates: List[Dict[str, Any]] = []

        for candidate in raw_rag_candidates:
            outfit_id = str(candidate.get("id"))
            catalog_item = self._catalog_cache.get(outfit_id) or candidate.get("raw_catalog_item", {})

            # 1. RAG Similarity (Normalized [0, 1])
            rag_sim = float(candidate.get("similarity_score", 0.70))

            # 2. Preference / Rule Score (Normalized [0, 1])
            pref_score = self.calculate_preference_match_score(catalog_item, prefs)

            # 3. Body Shape Compatibility (Normalized [0, 1])
            body_score = calculate_body_shape_compatibility(catalog_item, prefs.bodyShape)

            # 4. Novelty Score (Normalized [0, 1])
            novelty_score = calculate_novelty_score(outfit_id, recently_shown)

            # 5. Composite Hybrid Score
            hybrid_score = self.calculate_hybrid_score(
                rag_score=rag_sim,
                pref_score=pref_score,
                body_score=body_score,
                novelty_score=novelty_score
            )

            scored_candidates.append({
                **catalog_item,
                "id": outfit_id,
                "name": catalog_item.get("name") or candidate.get("name", "Fashion Look"),
                "category": catalog_item.get("category") or candidate.get("category", ""),
                "outfitType": catalog_item.get("outfitType") or candidate.get("outfitType", ""),
                "style": catalog_item.get("style") or candidate.get("style", ""),
                "color": catalog_item.get("color") or candidate.get("color", ""),
                "rag_similarity": round(rag_sim, 4),
                "preference_score": round(pref_score, 4),
                "body_compatibility": round(body_score, 4),
                "novelty_score": round(novelty_score, 4),
                "hybrid_score": round(hybrid_score, 4),
                "_score": hybrid_score * 100.0  # Compatible with novelty selector
            })

        # Step 3: Sort descending by hybrid score
        scored_candidates.sort(key=lambda x: x["hybrid_score"], reverse=True)

        # Step 4: Apply diversity curation to avoid repetitive silhouettes
        diverse_top_picks = select_diverse_recommendations(
            ranked_candidates=scored_candidates,
            count=top_k,
            recently_shown=recently_shown
        )

        logger.info("=" * 60)
        logger.info("Chic Genie Hybrid Reranking Summary (Top %d Diverse Picks):", len(diverse_top_picks))
        for rank, item in enumerate(diverse_top_picks, start=1):
            logger.info(
                "  [%d] ID: %s | Hybrid: %.4f (RAG: %.2f, Pref: %.2f, Body: %.2f, Nov: %.2f) | %s",
                rank,
                item["id"],
                item["hybrid_score"],
                item["rag_similarity"],
                item["preference_score"],
                item["body_compatibility"],
                item["novelty_score"],
                item["name"]
            )
        logger.info("=" * 60)

        return diverse_top_picks


# Global singleton instance
hybrid_reranker = HybridRerankerService()

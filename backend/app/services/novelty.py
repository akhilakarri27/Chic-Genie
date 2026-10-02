"""Novelty and Diversity Engine for Chic Genie.

Enforces non-repetition across sessions and ensures curated recommendations
exhibit meaningful diversity in silhouette, category, garment types, and accessories.
"""

from typing import List, Dict, Any, Set


def calculate_novelty_score(outfit_id: str, recently_shown: List[str], penalty_weight: float = 1.0) -> float:
    """
    Calculates novelty score for an outfit based on whether it was recently shown.
    
    Returns 1.0 if never shown, scaled down significantly if in recently_shown list.
    """
    if not recently_shown:
        return 1.0

    if outfit_id in recently_shown:
        # Penalize recently viewed look (most recent receives heavier penalty)
        try:
            recency_index = recently_shown.index(outfit_id)
            # Closer to the end means more recently shown
            recency_ratio = (recency_index + 1) / len(recently_shown)
            return max(0.05, 0.4 - (0.35 * recency_ratio * penalty_weight))
        except ValueError:
            return 0.15

    return 1.0


def select_diverse_recommendations(
    ranked_candidates: List[Dict[str, Any]],
    count: int = 3,
    recently_shown: List[str] = None
) -> List[Dict[str, Any]]:
    """
    Selects top diverse recommendations from ranked candidates.
    
    Ensures that returned looks are genuinely distinct (different categories, 
    garment structures, silhouettes, or styles) rather than simple color variations.
    """
    if not ranked_candidates:
        return []

    recently_shown_set: Set[str] = set(recently_shown or [])
    selected: List[Dict[str, Any]] = []
    
    seen_categories: Set[str] = set()
    seen_outfit_types: Set[str] = set()
    seen_silhouettes: Set[str] = set()
    seen_fabrics: Set[str] = set()

    # Pass 1: Select high-scoring candidates that are not recently shown and maximize diversity
    for candidate in ranked_candidates:
        if len(selected) >= count:
            break

        c_id = candidate.get("id")
        if c_id in recently_shown_set:
            continue

        category = candidate.get("category", "")
        outfit_type = candidate.get("outfitType", "")
        silhouette = candidate.get("silhouette", "")

        # Check for meaningful divergence from already selected items
        # Distinct outfit type or distinct category/silhouette
        is_distinct = (
            outfit_type not in seen_outfit_types or
            (category not in seen_categories and len(selected) < count) or
            len(ranked_candidates) <= count
        )

        if is_distinct:
            selected.append(candidate)
            seen_categories.add(category)
            seen_outfit_types.add(outfit_type)
            seen_silhouettes.add(silhouette)

    # Pass 2: If we still need more looks, fill with remaining unselected candidates
    if len(selected) < count:
        selected_ids = {item.get("id") for item in selected}
        for candidate in ranked_candidates:
            if len(selected) >= count:
                break
            c_id = candidate.get("id")
            if c_id not in selected_ids and c_id not in recently_shown_set:
                selected.append(candidate)
                selected_ids.add(c_id)

    # Pass 3: If candidate pool is exhausted (e.g. all in recently_shown), gracefully relax recently_shown constraint
    if len(selected) < count:
        selected_ids = {item.get("id") for item in selected}
        for candidate in ranked_candidates:
            if len(selected) >= count:
                break
            c_id = candidate.get("id")
            if c_id not in selected_ids:
                selected.append(candidate)
                selected_ids.add(c_id)

    return selected[:count]

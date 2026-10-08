"""Taxonomy and Hard Constraint Filtering Service for Chic Genie.

Enforces strict category and outfit-type filtering prior to RAG retrieval, ML scoring,
and hybrid ranking, ensuring recommendations strictly adhere to explicit user intent.
"""

import logging
from typing import List, Dict, Any, Optional, Set, Union
from app.models.preferences import PreferencesInput

logger = logging.getLogger("chic_genie.taxonomy")

CATEGORY_TRADITIONAL = "Traditional"
CATEGORY_WESTERN = "Western"
CATEGORY_STREETWEAR = "Streetwear"
CATEGORY_PROFESSIONAL = "Professional"
CATEGORY_BOHO = "Boho"
CATEGORY_PREPPY = "Preppy"
CATEGORY_ACTIVEWEAR = "Activewear"

# 11 Definitive Outfit Taxonomy Types grouped by Category
TAXONOMY_MAP: Dict[str, List[str]] = {
    CATEGORY_TRADITIONAL: [
        "lehenga choli",
        "sharara",
        "long dress",
        "silk saree",
        "organza saree",
        "anarkali",
        "kurti + palazzo",
        "saree"
    ],
    CATEGORY_WESTERN: [
        "jumpsuit",
        "co-ords",
        "co-ord set",
        "wrap dress",
        "slip dress",
        "bodycon dress",
        "shirt dress",
        "top + wide-leg jeans",
        "t-shirt + jeans",
        "cocktail dress",
        "top + trousers"
    ],
    CATEGORY_STREETWEAR: [
        "oversized hoodie + pants",
        "graphic layered",
        "cargo + sweatshirt",
        "hoodie + cargo pants",
        "graphic tee + baggy jeans",
        "bomber + parachute pants"
    ],
    CATEGORY_PROFESSIONAL: [
        "blazer outfit",
        "blouse + pencil-cut pant",
        "blazer + wide-leg trousers",
        "blazer + structured trousers",
        "blazer + pencil skirt",
        "blouse + pencil skirt",
        "waistcoat + trousers",
        "three-piece suit",
        "sheath dress"
    ]
}

# Mapping from any keyword, preference ID, or aesthetic term to canonical category
KEYWORD_TO_CATEGORY: Dict[str, str] = {
    # Traditional keywords
    "traditional": CATEGORY_TRADITIONAL,
    "ethnic": CATEGORY_TRADITIONAL,
    "lehenga": CATEGORY_TRADITIONAL,
    "lehenga_choli": CATEGORY_TRADITIONAL,
    "lehenga choli": CATEGORY_TRADITIONAL,
    "sharara": CATEGORY_TRADITIONAL,
    "sharara_set": CATEGORY_TRADITIONAL,
    "sharara set": CATEGORY_TRADITIONAL,
    "long_dress": CATEGORY_TRADITIONAL,
    "long dress": CATEGORY_TRADITIONAL,
    "saree": CATEGORY_TRADITIONAL,
    "silk_saree": CATEGORY_TRADITIONAL,
    "silk saree": CATEGORY_TRADITIONAL,
    "organza_saree": CATEGORY_TRADITIONAL,
    "organza saree": CATEGORY_TRADITIONAL,
    "contemporary_saree": CATEGORY_TRADITIONAL,
    "anarkali": CATEGORY_TRADITIONAL,
    "anarkali_suit": CATEGORY_TRADITIONAL,
    "anarkali suit": CATEGORY_TRADITIONAL,
    "kurti_palazzo": CATEGORY_TRADITIONAL,
    "kurti + palazzo": CATEGORY_TRADITIONAL,
    "kurti_bottom": CATEGORY_TRADITIONAL,
    "festive": CATEGORY_TRADITIONAL,
    "royal": CATEGORY_TRADITIONAL,
    "modern_ethnic": CATEGORY_TRADITIONAL,
    "indo_western": CATEGORY_TRADITIONAL,
    "wedding": CATEGORY_TRADITIONAL,
    "festival": CATEGORY_TRADITIONAL,

    # Western keywords
    "western": CATEGORY_WESTERN,
    "jumpsuit": CATEGORY_WESTERN,
    "co_ords": CATEGORY_WESTERN,
    "co-ords": CATEGORY_WESTERN,
    "coords": CATEGORY_WESTERN,
    "coord_set": CATEGORY_WESTERN,
    "co-ord set": CATEGORY_WESTERN,
    "coord set": CATEGORY_WESTERN,
    "wrap_dress": CATEGORY_WESTERN,
    "wrap dress": CATEGORY_WESTERN,
    "slip_dress": CATEGORY_WESTERN,
    "slip dress": CATEGORY_WESTERN,
    "bodycon_dress": CATEGORY_WESTERN,
    "bodycon dress": CATEGORY_WESTERN,
    "shirt_dress": CATEGORY_WESTERN,
    "shirt dress": CATEGORY_WESTERN,
    "a_line_dress": CATEGORY_WESTERN,
    "fit_and_flare_dress": CATEGORY_WESTERN,
    "pleated_dress": CATEGORY_WESTERN,
    "mini_dress": CATEGORY_WESTERN,
    "midi_dress": CATEGORY_WESTERN,
    "maxi_dress": CATEGORY_WESTERN,
    "sundress": CATEGORY_WESTERN,
    "dress": CATEGORY_WESTERN,
    "dresses": CATEGORY_WESTERN,
    "cocktail": CATEGORY_WESTERN,
    "cocktail dress": CATEGORY_WESTERN,
    "top_wide_leg": CATEGORY_WESTERN,
    "top + wide-leg jeans": CATEGORY_WESTERN,
    "top + wide-leg pants": CATEGORY_WESTERN,
    "top + trousers": CATEGORY_WESTERN,
    "jeans_top": CATEGORY_WESTERN,
    "t-shirt + jeans": CATEGORY_WESTERN,
    "casual_vibe": CATEGORY_WESTERN,
    "cute": CATEGORY_WESTERN,
    "casual": CATEGORY_WESTERN,

    # Streetwear keywords
    "streetwear": CATEGORY_STREETWEAR,
    "oversized_hoodie_pants": CATEGORY_STREETWEAR,
    "oversized hoodie + pants": CATEGORY_STREETWEAR,
    "hoodie_pants": CATEGORY_STREETWEAR,
    "hoodie_cargo_pants": CATEGORY_STREETWEAR,
    "oversized hoodie + cargo pants": CATEGORY_STREETWEAR,
    "graphic_layered": CATEGORY_STREETWEAR,
    "graphic layered": CATEGORY_STREETWEAR,
    "cargo_sweatshirt": CATEGORY_STREETWEAR,
    "cargo + sweatshirt": CATEGORY_STREETWEAR,
    "graphic_tee_baggy_jeans": CATEGORY_STREETWEAR,
    "graphic tee + baggy jeans": CATEGORY_STREETWEAR,
    "bomber_parachute_pants": CATEGORY_STREETWEAR,
    "bomber jacket + parachute pants": CATEGORY_STREETWEAR,
    "grunge": CATEGORY_STREETWEAR,
    "skater": CATEGORY_STREETWEAR,
    "urban": CATEGORY_STREETWEAR,
    "street": CATEGORY_STREETWEAR,
    "alternative": CATEGORY_STREETWEAR,

    # Professional keywords
    "professional": CATEGORY_PROFESSIONAL,
    "blazer_outfit": CATEGORY_PROFESSIONAL,
    "blazer outfit": CATEGORY_PROFESSIONAL,
    "blouse_pencil_pant": CATEGORY_PROFESSIONAL,
    "blouse + pencil-cut pant": CATEGORY_PROFESSIONAL,
    "blouse_pencil_cut_pant": CATEGORY_PROFESSIONAL,
    "blouse + pencil pant": CATEGORY_PROFESSIONAL,
    "blazer_trousers": CATEGORY_PROFESSIONAL,
    "blazer + structured trousers": CATEGORY_PROFESSIONAL,
    "blazer + wide-leg trousers": CATEGORY_PROFESSIONAL,
    "blazer_pencil_skirt": CATEGORY_PROFESSIONAL,
    "blazer + pencil skirt": CATEGORY_PROFESSIONAL,
    "blouse_pencil_skirt": CATEGORY_PROFESSIONAL,
    "blouse + pencil skirt": CATEGORY_PROFESSIONAL,
    "shirt_trousers": CATEGORY_PROFESSIONAL,
    "shirt + trousers": CATEGORY_PROFESSIONAL,
    "waistcoat_trousers": CATEGORY_PROFESSIONAL,
    "three_piece_suit": CATEGORY_PROFESSIONAL,
    "sheath_dress": CATEGORY_PROFESSIONAL,
    "business_formal": CATEGORY_PROFESSIONAL,
    "business_casual": CATEGORY_PROFESSIONAL,
    "office": CATEGORY_PROFESSIONAL,
    "interview": CATEGORY_PROFESSIONAL,
    "presentation": CATEGORY_PROFESSIONAL,
    "work": CATEGORY_PROFESSIONAL,

    # Boho
    "boho": CATEGORY_BOHO,
    "boho_maxi_dress": CATEGORY_BOHO,
    "flowy maxi": CATEGORY_BOHO,
    "vacation": CATEGORY_BOHO,

    # Preppy
    "preppy": CATEGORY_PREPPY,
    "preppy_cardigan_skirt": CATEGORY_PREPPY,
    "pleated skirt + shirt": CATEGORY_PREPPY,

    # Activewear
    "activewear": CATEGORY_ACTIVEWEAR,
    "yoga_set": CATEGORY_ACTIVEWEAR,
    "gym": CATEGORY_ACTIVEWEAR
}

# Canonical Mapping for exact outfit-type matching
OUTFIT_TYPE_CANONICAL_MAP: Dict[str, str] = {
    # TRADITIONAL
    "lehenga_choli": "lehenga choli",
    "lehenga choli": "lehenga choli",
    "lehenga": "lehenga choli",

    "sharara": "sharara",
    "sharara_set": "sharara",
    "sharara set": "sharara",

    "long_dress": "long dress",
    "long dress": "long dress",
    "ethnic_long_dress": "long dress",

    "saree": "saree",
    "silk_saree": "saree",
    "silk saree": "saree",
    "organza_saree": "saree",
    "organza saree": "saree",
    "contemporary_saree": "saree",

    "anarkali": "anarkali",
    "anarkali_suit": "anarkali",
    "anarkali suit": "anarkali",

    "kurti_palazzo": "kurti + palazzo",
    "kurti + palazzo": "kurti + palazzo",
    "kurti_bottom": "kurti + palazzo",
    "kurti": "kurti + palazzo",

    # WESTERN
    "jumpsuit": "jumpsuit",

    "co_ords": "co-ords",
    "co-ords": "co-ords",
    "coords": "co-ords",

    "coord_set": "co-ord set",
    "co-ord set": "co-ord set",
    "coord set": "co-ord set",

    "wrap_dress": "wrap dress",
    "wrap dress": "wrap dress",

    "bodycon_dress": "bodycon dress",
    "bodycon dress": "bodycon dress",

    "slip_dress": "slip dress",
    "slip dress": "slip dress",

    "shirt_dress": "shirt dress",
    "shirt dress": "shirt dress",

    "cocktail_dress": "cocktail dress",
    "cocktail dress": "cocktail dress",
    "cocktail": "cocktail dress",

    "top_wide_leg": "top + wide-leg jeans",
    "top + wide-leg jeans": "top + wide-leg jeans",
    "top + wide-leg pants": "top + wide-leg jeans",

    "jeans_top": "t-shirt + jeans",
    "t-shirt + jeans": "t-shirt + jeans",
    "t_shirt_jeans": "t-shirt + jeans",

    "top_trousers": "top + trousers",
    "top + trousers": "top + trousers",

    "dress": "dress",
    "dresses": "dress",
    "maxi_dress": "dress",
    "mini_dress": "dress",
    "midi_dress": "dress",
    "a_line_dress": "dress",
    "fit_and_flare_dress": "dress",
    "pleated_dress": "dress",
    "sundress": "dress",

    # STREETWEAR
    "oversized_hoodie_pants": "oversized hoodie + pants",
    "oversized hoodie + pants": "oversized hoodie + pants",
    "hoodie_pants": "oversized hoodie + pants",
    "hoodie_cargo_pants": "oversized hoodie + pants",
    "oversized hoodie + cargo pants": "oversized hoodie + pants",

    "graphic_layered": "graphic layered",
    "graphic layered": "graphic layered",
    "graphic_tee_baggy_jeans": "graphic layered",
    "graphic tee + baggy jeans": "graphic layered",

    "cargo_sweatshirt": "cargo + sweatshirt",
    "cargo + sweatshirt": "cargo + sweatshirt",
    "bomber_parachute_pants": "cargo + sweatshirt",
    "bomber jacket + parachute pants": "cargo + sweatshirt",

    # PROFESSIONAL
    "blazer_outfit": "blazer outfit",
    "blazer outfit": "blazer outfit",
    "blazer_trousers": "blazer outfit",
    "blazer + structured trousers": "blazer outfit",
    "blazer + wide-leg trousers": "blazer outfit",
    "three_piece_suit": "blazer outfit",
    "waistcoat_trousers": "blazer outfit",
    "blazer_pencil_skirt": "blazer outfit",
    "blazer + pencil skirt": "blazer outfit",
    "sheath_dress": "blazer outfit",

    "blouse_pencil_pant": "blouse + pencil-cut pant",
    "blouse + pencil-cut pant": "blouse + pencil-cut pant",
    "blouse_pencil_cut_pant": "blouse + pencil-cut pant",
    "blouse + pencil pant": "blouse + pencil-cut pant",
    "shirt_trousers": "blouse + pencil-cut pant",
    "shirt + trousers": "blouse + pencil-cut pant",

    "blouse_pencil_skirt": "blouse + pencil skirt",
    "blouse + pencil skirt": "blouse + pencil skirt",

    # BOHO / PREPPY / ACTIVEWEAR
    "boho_maxi_dress": "flowy maxi",
    "flowy maxi": "flowy maxi",
    "preppy_cardigan_skirt": "pleated skirt + shirt",
    "pleated skirt + shirt": "pleated skirt + shirt",
    "yoga_set": "yoga set",
    "yoga set": "yoga set"
}


def normalize_outfit_type(outfit_type_val: Any) -> str:
    """Normalizes an outfitType value into its canonical taxonomy key."""
    if not outfit_type_val:
        return ""
    raw_str = str(outfit_type_val).strip().lower()
    clean = raw_str.replace("-", " ").replace("_", " ")

    if raw_str in OUTFIT_TYPE_CANONICAL_MAP:
        return OUTFIT_TYPE_CANONICAL_MAP[raw_str]
    if clean in OUTFIT_TYPE_CANONICAL_MAP:
        return OUTFIT_TYPE_CANONICAL_MAP[clean]

    for k, v in OUTFIT_TYPE_CANONICAL_MAP.items():
        if k == clean or k == raw_str:
            return v

    return clean


def _clean_list(val: Any) -> List[str]:
    """Normalizes field values into a list of clean lowercase strings."""
    if not val:
        return []
    if isinstance(val, str):
        return [item.strip().lower() for item in val.split(",") if item.strip()]
    if isinstance(val, list):
        res = []
        for item in val:
            if isinstance(item, str):
                res.extend([i.strip().lower() for i in item.split(",") if i.strip()])
            elif item is not None:
                res.append(str(item).strip().lower())
        return res
    return [str(val).strip().lower()]


class TaxonomyConstraintEngine:
    """
    Resolves target category and exact outfitType constraints from user styling preferences,
    enforcing hard eligibility filtering before RAG retrieval, ML scoring, and ranking.
    """

    @staticmethod
    def resolve_allowed_outfit_types(prefs: Union[PreferencesInput, Dict[str, Any]]) -> Optional[Set[str]]:
        """
        Extracts explicit outfitType(s) requested by the user and normalizes them into canonical taxonomy keys.
        Returns None if no specific outfitType was selected (e.g. general browsing, surprise_me, or empty).
        """
        if isinstance(prefs, PreferencesInput):
            p_dict = prefs.model_dump()
        elif isinstance(prefs, dict):
            p_dict = prefs
        else:
            return None

        raw_types = _clean_list(p_dict.get("outfitTypes"))
        if p_dict.get("outfitType"):
            raw_types.extend(_clean_list(p_dict.get("outfitType")))

        generic_tokens = {"surprise_me", "surprise me", "any", "all", "none", ""}
        specific_types = [t for t in raw_types if t not in generic_tokens]

        if not specific_types:
            return None

        canonical_set: Set[str] = set()
        for t in specific_types:
            canon = normalize_outfit_type(t)
            if canon:
                canonical_set.add(canon)

        return canonical_set if canonical_set else None

    @staticmethod
    def determine_target_category(prefs: Union[PreferencesInput, Dict[str, Any]]) -> Optional[str]:
        """
        Determines the explicit target category requested by the user.
        Evaluates outfitTypes -> styles -> occasions in hierarchical order.
        """
        if isinstance(prefs, PreferencesInput):
            p_dict = prefs.model_dump()
        elif isinstance(prefs, dict):
            p_dict = prefs
        else:
            return None

        outfit_types = _clean_list(p_dict.get("outfitTypes"))
        if p_dict.get("outfitType"):
            outfit_types.extend(_clean_list(p_dict.get("outfitType")))

        styles = _clean_list(p_dict.get("styles"))
        occasions = _clean_list(p_dict.get("occasions"))
        if p_dict.get("occasion"):
            occasions.extend(_clean_list(p_dict.get("occasion")))

        # 1. Primary: Match from explicit outfitType
        for ot in outfit_types:
            ot_clean = ot.replace("_", " ").strip()
            if ot in KEYWORD_TO_CATEGORY:
                return KEYWORD_TO_CATEGORY[ot]
            if ot_clean in KEYWORD_TO_CATEGORY:
                return KEYWORD_TO_CATEGORY[ot_clean]
            for kw, cat in KEYWORD_TO_CATEGORY.items():
                if kw in ot or kw in ot_clean:
                    return cat

        # 2. Secondary: Match from explicit style/vibe
        for st in styles:
            st_clean = st.replace("_", " ").strip()
            if st in KEYWORD_TO_CATEGORY:
                return KEYWORD_TO_CATEGORY[st]
            if st_clean in KEYWORD_TO_CATEGORY:
                return KEYWORD_TO_CATEGORY[st_clean]
            for kw, cat in KEYWORD_TO_CATEGORY.items():
                if kw in st or kw in st_clean:
                    return cat

        # 3. Tertiary: Match from occasion if domain-specific (e.g. wedding/office/work)
        for occ in occasions:
            occ_clean = occ.replace("_", " ").strip()
            if occ in KEYWORD_TO_CATEGORY:
                return KEYWORD_TO_CATEGORY[occ]
            if occ_clean in KEYWORD_TO_CATEGORY:
                return KEYWORD_TO_CATEGORY[occ_clean]

        return None

    @staticmethod
    def is_outfit_eligible(
        item: Dict[str, Any],
        target_category: Optional[str] = None,
        allowed_outfit_types: Optional[Set[str]] = None
    ) -> bool:
        """
        Determines if an outfit item is eligible based on exact outfitType and category constraints.
        Priority:
        1. If allowed_outfit_types is specified, exact outfitType constraint has STRICT PRIORITY.
        2. Category constraint is checked as a secondary constraint.
        """
        item_type_raw = str(item.get("outfitType", "")).strip()
        item_canon_type = normalize_outfit_type(item_type_raw)
        item_cat = str(item.get("category", "")).strip().lower()

        # 1. Exact outfitType constraint check
        if allowed_outfit_types:
            type_match = False
            if item_canon_type in allowed_outfit_types:
                type_match = True
            elif "dress" in allowed_outfit_types and "dress" in item_canon_type and item_cat == "western":
                type_match = True
            elif any(at == item_canon_type for at in allowed_outfit_types):
                type_match = True

            if not type_match:
                return False

            if target_category:
                norm_target = target_category.strip().lower()
                cat_match = (
                    item_cat == norm_target or
                    (norm_target in ("traditional", "ethnic") and item_cat in ("traditional", "ethnic"))
                )
                if not cat_match:
                    return False

            return True

        # 2. Category constraint check (when no exact outfitType is specified)
        if target_category:
            norm_target = target_category.strip().lower()
            return (
                item_cat == norm_target or
                (norm_target in ("traditional", "ethnic") and item_cat in ("traditional", "ethnic"))
            )

        return True

    @staticmethod
    def filter_catalog(
        catalog_items: List[Dict[str, Any]],
        target_category: Optional[str] = None,
        allowed_outfit_types: Optional[Set[str]] = None
    ) -> List[Dict[str, Any]]:
        """
        Filters a list of catalog items using exact outfitType constraint (priority)
        and category constraint (secondary).
        """
        if not allowed_outfit_types and not target_category:
            return catalog_items

        filtered = [
            item for item in catalog_items
            if TaxonomyConstraintEngine.is_outfit_eligible(
                item=item,
                target_category=target_category,
                allowed_outfit_types=allowed_outfit_types
            )
        ]

        logger.info(
            "Taxonomy Constraint: Filtered candidate pool from %d to %d items (Allowed Types: %s, Category: %s)",
            len(catalog_items), len(filtered), allowed_outfit_types, target_category
        )
        return filtered if filtered else catalog_items

    @staticmethod
    def filter_catalog_by_category(
        catalog_items: List[Dict[str, Any]],
        target_category: Optional[str]
    ) -> List[Dict[str, Any]]:
        """Backwards compatible category-only filter."""
        return TaxonomyConstraintEngine.filter_catalog(
            catalog_items=catalog_items,
            target_category=target_category,
            allowed_outfit_types=None
        )


taxonomy_engine = TaxonomyConstraintEngine()

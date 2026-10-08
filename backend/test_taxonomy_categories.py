"""Comprehensive Test Suite for Chic Genie Exact OutfitType Constraint Filtering.

Validates:
1. TRADITIONAL: requested = ['lehenga_choli', 'sharara', 'long_dress']
   - Every returned item's outfitType is strictly one of {lehenga choli, sharara, long dress}.
   - Saree, Anarkali, Kurti + Palazzo are NEVER returned.
2. WESTERN: requested = ['jumpsuit', 'co_ords', 'coord_set']
   - Every returned item's outfitType is strictly one of {jumpsuit, co-ords, co-ord set}.
3. STREETWEAR: requested = ['oversized_hoodie_pants', 'graphic_layered', 'cargo_sweatshirt']
   - Every returned item's outfitType is strictly one of {oversized hoodie + pants, graphic layered, cargo + sweatshirt}.
4. PROFESSIONAL: requested = ['blazer_outfit', 'blouse_pencil_pant']
   - Every returned item's outfitType is strictly one of {blazer outfit, blouse + pencil-cut pant}.
"""

import sys
import io
import json
from pathlib import Path

# Ensure UTF-8 output encoding on Windows consoles
if sys.stdout and hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

BACKEND_DIR = Path(__file__).resolve().parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app.models.preferences import PreferencesInput
from app.services.recommendation_engine import RecommendationEngine
from app.services.taxonomy import taxonomy_engine, normalize_outfit_type

engine = RecommendationEngine()

test_cases = [
    {
        "category_name": "TRADITIONAL",
        "requested_types": ["lehenga_choli", "sharara", "long_dress"],
        "expected_canonical_types": {"lehenga choli", "sharara", "long dress"},
        "forbidden_types": {"saree", "silk saree", "organza saree", "anarkali", "kurti + palazzo", "kurti_palazzo"},
        "prefs": PreferencesInput(
            bodyShape="pear",
            occasions=["wedding", "festival"],
            styles=["traditional", "royal", "festive"],
            outfitTypes=["lehenga_choli", "sharara", "long_dress"],
            colors=["emerald", "ruby", "gold"],
            palette="rich jewel"
        )
    },
    {
        "category_name": "WESTERN",
        "requested_types": ["jumpsuit", "co_ords", "coord_set"],
        "expected_canonical_types": {"jumpsuit", "co-ords", "co-ord set"},
        "forbidden_types": {"wrap dress", "bodycon dress", "slip dress", "shirt dress"},
        "prefs": PreferencesInput(
            bodyShape="hourglass",
            occasions=["dinner", "date"],
            styles=["romantic", "minimal chic"],
            outfitTypes=["jumpsuit", "co_ords", "coord_set"],
            colors=["burgundy", "gold"],
            palette="rich jewel"
        )
    },
    {
        "category_name": "STREETWEAR",
        "requested_types": ["oversized_hoodie_pants", "graphic_layered", "cargo_sweatshirt"],
        "expected_canonical_types": {"oversized hoodie + pants", "graphic layered", "cargo + sweatshirt"},
        "forbidden_types": {"wrap dress", "blazer outfit", "saree"},
        "prefs": PreferencesInput(
            bodyShape="inverted_triangle",
            occasions=["casual", "college"],
            styles=["streetwear", "edgy"],
            outfitTypes=["oversized_hoodie_pants", "graphic_layered", "cargo_sweatshirt"],
            colors=["black", "graphite", "olive"],
            palette="monochrome"
        )
    },
    {
        "category_name": "PROFESSIONAL",
        "requested_types": ["blazer_outfit", "blouse_pencil_pant"],
        "expected_canonical_types": {"blazer outfit", "blouse + pencil-cut pant"},
        "forbidden_types": {"blouse + pencil skirt", "wrap dress", "saree", "hoodie"},
        "prefs": PreferencesInput(
            bodyShape="rectangle",
            occasions=["office", "interview", "presentation"],
            styles=["professional", "business_formal"],
            outfitTypes=["blazer_outfit", "blouse_pencil_pant"],
            colors=["charcoal", "black", "navy"],
            palette="monochrome"
        )
    }
]


def run_exact_outfit_type_validation():
    print("=" * 80)
    print("CHIC GENIE - EXACT OUTFIT TYPE HARD CONSTRAINT VALIDATION")
    print("=" * 80)

    total_catalog_count = len(engine.catalog)
    print(f"Total catalog population before filtering: {total_catalog_count} items\n")

    all_passed = True
    test_reports = []

    for tc in test_cases:
        cat_name = tc["category_name"]
        req_types = tc["requested_types"]
        expected_canons = tc["expected_canonical_types"]
        forbidden_types = tc["forbidden_types"]
        prefs = tc["prefs"]

        print(f"\n>>> [TESTING EXACT OUTFIT TYPE: {cat_name}]")
        print(f"    • Requested outfitTypes: {req_types}")
        print(f"    • Expected Canonical Target Pool: {expected_canons}")
        print(f"    • Forbidden Types: {forbidden_types}")

        # 1. Inspect resolved constraints
        resolved_types = taxonomy_engine.resolve_allowed_outfit_types(prefs)
        resolved_cat = taxonomy_engine.determine_target_category(prefs)
        print(f"    • Resolved Allowed Types: {resolved_types}")
        print(f"    • Resolved Target Category: {resolved_cat}")

        assert resolved_types == expected_canons, f"Resolved types mismatch: expected {expected_canons}, got {resolved_types}"

        # 2. Compute candidate count before and after filtering
        eligible_candidates = taxonomy_engine.filter_catalog(
            engine.catalog,
            target_category=resolved_cat,
            allowed_outfit_types=resolved_types
        )
        before_count = total_catalog_count
        after_count = len(eligible_candidates)
        print(f"    • Candidates BEFORE filter: {before_count}")
        print(f"    • Candidates AFTER exact outfitType filter: {after_count}")

        # 3. Generate recommendations through AI pipeline
        recs = engine.get_recommendations(prefs, count=3)
        print(f"    • AI Pipeline Returned {len(recs)} Recommendations:")

        rec_details = []
        cat_passed = True

        for i, rec in enumerate(recs, 1):
            canon_rec_type = normalize_outfit_type(rec.outfitType)
            is_valid_type = canon_rec_type in expected_canons
            is_forbidden = any(f in rec.outfitType.lower() or f == canon_rec_type for f in forbidden_types)

            status_str = "PASSED" if (is_valid_type and not is_forbidden) else "FAILED"
            if not (is_valid_type and not is_forbidden):
                cat_passed = False
                all_passed = False

            print(f"      [{i}] {rec.name}")
            print(f"          ID: {rec.id} | Category: {rec.category} | OutfitType: '{rec.outfitType}' (Canonical: '{canon_rec_type}')")
            print(f"          Match: {rec.preferenceMatch}% | Avatar: {rec.avatarUrl}")
            print(f"          Validation Status: {status_str}")

            rec_details.append({
                "id": rec.id,
                "name": rec.name,
                "category": rec.category,
                "outfitType": rec.outfitType,
                "canonicalType": canon_rec_type,
                "preferenceMatch": rec.preferenceMatch,
                "status": status_str
            })

        test_reports.append({
            "category": cat_name,
            "requestedTypes": req_types,
            "beforeFilterCount": before_count,
            "afterFilterCount": after_count,
            "passed": cat_passed,
            "top3": rec_details
        })

        print("-" * 80)

    print("\n" + "=" * 80)
    if all_passed:
        print("ALL EXACT OUTFIT TYPE HARD CONSTRAINT TESTS PASSED 100% SUCCESSFULLY!")
    else:
        print("EXACT OUTFIT TYPE VALIDATION FAILURES DETECTED!")
    print("=" * 80)

    return all_passed, test_reports


if __name__ == "__main__":
    passed, reports = run_exact_outfit_type_validation()
    if not passed:
        sys.exit(1)

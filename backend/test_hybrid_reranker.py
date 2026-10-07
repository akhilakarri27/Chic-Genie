"""Comprehensive Verification Test for Chic Genie Hybrid Reranker.

Evaluates the transparent multi-factor weighted formula across 4 core styling personas:
- Scenario 1: Romantic Dinner
- Scenario 2: Festive Traditional Celebration
- Scenario 3: Smart Casual Workwear
- Scenario 4: Relaxed Streetwear

Formula:
Final Hybrid Score = (0.50 * RAG) + (0.25 * Preference) + (0.15 * BodyShape) + (0.10 * Novelty)
"""

import sys
import io
import logging
from pathlib import Path

# Ensure UTF-8 console output
if sys.stdout and hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

# Add backend directory to sys.path
BACKEND_DIR = Path(__file__).resolve().parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app.models.preferences import PreferencesInput
from app.services.hybrid_reranker import hybrid_reranker
from app.services.rag_service import rag_service

logging.basicConfig(level=logging.WARNING)


def print_score_table(results, title=""):
    print(f"\n{'='*95}")
    print(f" {title.upper()}")
    print(f"{'='*95}")
    header = f"{'Rank':<5} | {'Outfit ID':<32} | {'RAG (50%)':<10} | {'Pref (25%)':<10} | {'Body (15%)':<10} | {'Nov (10%)':<10} | {'HYBRID':<8}"
    print(header)
    print("-" * 95)
    for idx, item in enumerate(results, start=1):
        row = (
            f"#{idx:<4} | "
            f"{item['id']:<32} | "
            f"{item['rag_similarity']:<10.4f} | "
            f"{item['preference_score']:<10.4f} | "
            f"{item['body_compatibility']:<10.4f} | "
            f"{item['novelty_score']:<10.4f} | "
            f"{item['hybrid_score']:<8.4f}"
        )
        print(row)
        print(f"       Look: {item['name']} ({item['category']} | {item['outfitType']} | Style: {item['style']})")
    print("-" * 95)


def run_hybrid_tests():
    print("=" * 95)
    print("🌟 CHIC GENIE -- HYBRID RERANKING TEST SUITE")
    print("=" * 95)
    print("Formula: Hybrid Score = (0.50 * RAG) + (0.25 * Preference) + (0.15 * BodyShape) + (0.10 * Novelty)")
    print("All component sub-scores normalized in range [0.00, 1.00]\n")

    scenarios = [
        {
            "name": "Scenario 1: Romantic Evening Dinner",
            "prefs": PreferencesInput(
                bodyShape="hourglass",
                styles=["romantic", "elegant"],
                occasions=["dinner", "date"],
                colors=["burgundy", "gold"],
                palette="rich jewel",
                outfitTypes=["wrap dress", "midi dress"],
                footwear=["block heels"],
                jewellery=["minimal gold"],
                weather=["mild", "breezy"],
                preferredFit="tailored"
            )
        },
        {
            "name": "Scenario 2: Festive Traditional Celebration",
            "prefs": PreferencesInput(
                bodyShape="pear",
                styles=["festive", "traditional", "royal"],
                occasions=["wedding", "festive", "party"],
                colors=["emerald", "gold", "ruby"],
                palette="rich jewel",
                outfitTypes=["saree", "lehenga"],
                footwear=["embellished juttis"],
                jewellery=["kundan earrings", "gold temple jewellery"],
                season="Autumn/Winter"
            )
        },
        {
            "name": "Scenario 3: Smart Casual Workwear & Office Blazer",
            "prefs": PreferencesInput(
                bodyShape="rectangle",
                styles=["smart casual", "minimal chic", "clean"],
                occasions=["work", "office", "presentation"],
                colors=["charcoal", "white", "black", "navy"],
                palette="monochrome",
                outfitTypes=["blazer", "trousers"],
                footwear=["loafers", "pointed flats"],
                fit="tailored",
                comfort="balanced"
            )
        },
        {
            "name": "Scenario 4: Relaxed Streetwear & Sneaker Style",
            "prefs": PreferencesInput(
                bodyShape="inverted_triangle",
                styles=["streetwear", "casual", "edgy"],
                occasions=["casual", "hangout", "college"],
                colors=["olive", "black", "white"],
                palette="earthy",
                outfitTypes=["cargo", "oversized tee", "jacket"],
                footwear=["sneakers", "chunky trainers"],
                fit="oversized",
                comfort="comfort_first"
            )
        }
    ]

    for scenario in scenarios:
        prefs = scenario["prefs"]
        query_text = rag_service.build_user_query(prefs)
        print(f"\n📝 Natural-Language Search Query:\n   \"{query_text}\"")

        # Perform Hybrid Reranking (top 3 diverse picks)
        top_picks = hybrid_reranker.rerank(prefs=prefs, top_k=3, rag_candidate_count=12)
        print_score_table(top_picks, title=scenario["name"])

    print("\n" + "=" * 95)
    print("✅ HYBRID RERANKING TEST SUITE COMPLETED SUCCESSFULLY!")
    print("=" * 95)


if __name__ == "__main__":
    run_hybrid_tests()

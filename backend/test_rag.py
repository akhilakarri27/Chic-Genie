"""Standalone Test Script for Chic Genie RAG Pipeline.

Validates:
1. SentenceTransformer embedding model loading.
2. ChromaDB indexing of fashion_catalog.json.
3. Preference-to-natural-language query synthesis.
4. Dense semantic similarity retrieval across multiple realistic styling scenarios.
"""

import sys
import io
import logging
from pathlib import Path

# Ensure UTF-8 output encoding on Windows consoles
if sys.stdout and hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

# Add backend directory to sys.path so app modules import cleanly
BACKEND_DIR = Path(__file__).resolve().parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app.models.preferences import PreferencesInput
from app.services.embedding_service import embedding_service
from app.services.vector_store import vector_store_service
from app.services.rag_service import rag_service

# Configure test logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("test_rag_pipeline")


def run_tests():
    print("=" * 80)
    print("CHIC GENIE -- RAG RETRIEVAL PIPELINE TEST")
    print("=" * 80)

    # 1. Test Embedding Service
    print("\n[Step 1] Verifying Embedding Service...")
    print(f"  * Model Name: {embedding_service.model_name}")
    print(f"  * Embedding Dimension: {embedding_service.dimension}")
    sample_vec = embedding_service.embed_text("chic burgundy wrap dress")
    print(f"  * Sample vector generated successfully (length: {len(sample_vec)}, sample: {sample_vec[:3]}...)")

    # 2. Test Vector Store Indexing
    print("\n[Step 2] Indexing Fashion Catalog into ChromaDB...")
    indexed_count = rag_service.index_knowledge_base(force_reindex=True)
    print(f"  * Successfully indexed {indexed_count} catalog items into ChromaDB collection '{vector_store_service.collection_name}'.")

    # 3. Test Scenarios
    scenarios = [
        {
            "title": "Scenario A: Romantic Evening Dinner",
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
            "title": "Scenario B: Festive Traditional Ethnic Celebration",
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
            "title": "Scenario C: Smart Casual Workwear & Office Blazer",
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
            "title": "Scenario D: Relaxed Streetwear & Sneaker Style",
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

    for idx, sc in enumerate(scenarios, start=1):
        print(f"\n" + "-" * 80)
        print(f"[{idx}/{len(scenarios)}] {sc['title']}")
        print("-" * 80)

        prefs = sc["prefs"]
        # Generate user query
        query_str = rag_service.build_user_query(prefs)
        print(f"Synthesized Natural-Language Query:\n   \"{query_str}\"\n")

        # Execute RAG retrieval
        results = rag_service.retrieve_candidates(prefs=prefs, top_k=3)

        print(f"Top {len(results)} Retrieved Outfits:")
        for rank, res in enumerate(results, start=1):
            pct = res["similarity_score"] * 100.0
            print(f"   [{rank}] ID: {res['id']}")
            print(f"       Title: {res['name']}")
            print(f"       Category: {res['category']} | Outfit Type: {res['outfitType']} | Style: {res['style']}")
            print(f"       Semantic Match: {pct:.2f}% (Cosine Distance: {res['distance']:.4f})")
            print(f"       Colors: {res['color']} | Avatar: {res['metadata'].get('avatarUrl')}")
            print(f"       Doc Preview: {res['document_snippet']}")
            print()

    print("=" * 80)
    print("ALL RAG RETRIEVAL TESTS COMPLETED SUCCESSFULLY!")
    print("=" * 80)


if __name__ == "__main__":
    run_tests()

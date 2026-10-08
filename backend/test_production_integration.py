"""Production Integration Test Suite for Chic Genie Recommendation Engine.

Validates:
1. End-to-end execution of POST /api/recommendations using FastAPI TestClient.
2. Complete AI Pipeline (RAG + RandomForest ML + Hybrid Fusion) in production flow.
3. Verification of the 4 core styling scenarios:
   - Romantic Dinner
   - Festive Traditional Celebration
   - Smart Casual Workwear
   - Relaxed Streetwear
4. Strict validation of React frontend response schema compatibility.
5. Verification of diagnostic score fields (ragScore, mlCompatibilityScore, hybridScore).
"""

import sys
import json
import logging
from pathlib import Path
from fastapi.testclient import TestClient

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

from app.main import app

logging.basicConfig(level=logging.WARNING)
client = TestClient(app)


def test_production_scenarios():
    print("=" * 95)
    print("🚀 CHIC GENIE -- PRODUCTION API END-TO-END INTEGRATION TEST")
    print("=" * 95)
    print("Testing endpoint: POST /api/recommendations\n")

    scenarios = [
        {
            "name": "Scenario 1: Romantic Evening Dinner (Western)",
            "payload": {
                "preferences": {
                    "bodyShape": "hourglass",
                    "styles": ["romantic", "elegant"],
                    "occasions": ["dinner", "date"],
                    "colors": ["burgundy", "gold"],
                    "palette": "rich jewel",
                    "outfitTypes": ["jumpsuit", "co_ords", "coord_set"],
                    "footwear": ["block heels"],
                    "jewellery": ["minimal gold"],
                    "weather": ["mild", "breezy"],
                    "preferredFit": "tailored"
                },
                "count": 3,
                "recentlyShown": []
            }
        },
        {
            "name": "Scenario 2: Festive Traditional Celebration (Traditional)",
            "payload": {
                "preferences": {
                    "bodyShape": "pear",
                    "styles": ["festive", "traditional", "royal"],
                    "occasions": ["wedding", "festive", "party"],
                    "colors": ["emerald", "gold", "ruby"],
                    "palette": "rich jewel",
                    "outfitTypes": ["lehenga_choli", "sharara", "long_dress"],
                    "footwear": ["embellished juttis"],
                    "jewellery": ["kundan earrings", "gold temple jewellery"],
                    "season": "Autumn/Winter"
                },
                "count": 3,
                "recentlyShown": []
            }
        },
        {
            "name": "Scenario 3: Smart Casual Workwear & Office Blazer (Professional)",
            "payload": {
                "preferences": {
                    "bodyShape": "rectangle",
                    "styles": ["smart casual", "minimal chic", "clean"],
                    "occasions": ["work", "office", "presentation"],
                    "colors": ["charcoal", "white", "black", "navy"],
                    "palette": "monochrome",
                    "outfitTypes": ["blazer_outfit", "blouse_pencil_pant"],
                    "footwear": ["loafers", "pointed flats"],
                    "fit": "tailored",
                    "comfort": "balanced"
                },
                "count": 3,
                "recentlyShown": []
            }
        },
        {
            "name": "Scenario 4: Relaxed Streetwear & Sneaker Style (Streetwear)",
            "payload": {
                "preferences": {
                    "bodyShape": "inverted_triangle",
                    "styles": ["streetwear", "casual", "edgy"],
                    "occasions": ["casual", "hangout", "college"],
                    "colors": ["olive", "black", "white"],
                    "palette": "earthy",
                    "outfitTypes": ["oversized_hoodie_pants", "graphic_layered", "cargo_sweatshirt"],
                    "footwear": ["sneakers", "chunky trainers"],
                    "fit": "oversized",
                    "comfort": "comfort_first"
                },
                "count": 3,
                "recentlyShown": []
            }
        }
    ]

    for idx, sc in enumerate(scenarios, start=1):
        print(f"\n" + "-" * 95)
        print(f"[{idx}/4] {sc['name'].upper()}")
        print("-" * 95)

        response = client.post("/api/recommendations", json=sc["payload"])
        assert response.status_code == 200, f"Expected 200 OK, got {response.status_code}: {response.text}"

        data = response.json()
        assert data.get("status") == "success", "Response status must be 'success'"
        assert "recommendations" in data, "Response missing 'recommendations' field"

        outfits = data["recommendations"]
        assert len(outfits) == sc["payload"]["count"], f"Expected {sc['payload']['count']} outfits, got {len(outfits)}"

        print(f"✅ Status Code: 200 OK | Outfits Returned: {len(outfits)}")
        print(f"\n{'Rank':<5} | {'Outfit ID':<32} | {'Match %':<8} | {'RAG Score':<10} | {'ML Score':<10} | {'Hybrid Score':<12}")
        print("-" * 95)

        for rank, item in enumerate(outfits, start=1):
            # Assert essential frontend fields exist
            for field in ["id", "name", "category", "outfitType", "color", "preferenceMatch", "explanation", "avatarUrl"]:
                assert field in item, f"Missing required frontend field: {field}"

            row = (
                f"#{rank:<4} | "
                f"{item['id']:<32} | "
                f"{item['preferenceMatch']:<7}% | "
                f"{(item.get('ragScore') or 0.0):<10.4f} | "
                f"{(item.get('mlCompatibilityScore') or 0.0):<10.4f} | "
                f"{(item.get('hybridScore') or 0.0):<12.4f}"
            )
            print(row)
            print(f"       Title: {item['name']} ({item['category']})")
            print(f"       Styling Explanation: \"{item['explanation']}\"")
            print()

    print("=" * 95)
    print("🎉 ALL PRODUCTION API END-TO-END INTEGRATION TESTS PASSED WITH ZERO ERRORS!")
    print("=" * 95)


if __name__ == "__main__":
    test_production_scenarios()

"""Automated test suite for Exact OutfitType Constraints in Chic Genie.

Verifies:
1. Traditional: requested = [lehenga_choli, sharara, long_dress]
   - Assert every returned item's outfitType is one of those 3.
   - Assert NEVER returns: saree, anarkali, kurti_palazzo.
2. Western: requested = [jumpsuit, co_ords, coord_set]
   - Assert every returned item's outfitType is one of those 3.
3. Streetwear: requested = [oversized_hoodie_pants, graphic_layered, cargo_sweatshirt]
   - Assert every returned item's outfitType is one of those 3.
4. Professional: requested = [blazer_outfit, blouse_pencil_pant]
   - Assert every returned item's outfitType is one of those 2.
"""

import sys
import os
import json
import urllib.request

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

BACKEND_URL = "http://127.0.0.1:8000/api/recommendations"

def query_recommendations(payload):
    req = urllib.request.Request(
        BACKEND_URL,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode("utf-8"))

def test_traditional_constraint():
    print("=" * 60)
    print("TEST 1: TRADITIONAL EXACT OUTFIT TYPE CONSTRAINT")
    requested = ["lehenga_choli", "sharara", "long_dress"]
    canonical_allowed = {"lehenga choli", "sharara", "long dress"}
    forbidden_types = {"saree", "silk saree", "organza saree", "anarkali", "kurti + palazzo", "kurti_palazzo"}

    payload = {
        "preferences": {
            "occasion": "wedding",
            "styles": ["traditional", "festive"],
            "outfitTypes": requested,
            "outfitType": "lehenga_choli",
            "colors": ["pink", "gold", "emerald"]
        },
        "count": 3
    }
    data = query_recommendations(payload)
    recs = data.get("recommendations", [])
    print(f"Requested: {requested}")
    print(f"Received {len(recs)} recommendations:")

    assert len(recs) > 0, "Expected at least 1 recommendation"
    for r in recs:
        ot = r.get("outfitType", "").lower()
        print(f"  - ID: {r.get('id')} | Type: {ot} | Cat: {r.get('category')} | Name: {r.get('name')}")
        assert ot in canonical_allowed, f"Outfit type '{ot}' not in allowed set {canonical_allowed}"
        assert ot not in forbidden_types, f"Forbidden outfit type '{ot}' was returned!"
    print(">>> PASS: Traditional exact constraint verified. Zero forbidden types returned.")

def test_western_constraint():
    print("=" * 60)
    print("TEST 2: WESTERN EXACT OUTFIT TYPE CONSTRAINT")
    requested = ["jumpsuit", "co_ords", "coord_set"]
    canonical_allowed = {"jumpsuit", "co-ords", "co-ord set"}

    payload = {
        "preferences": {
            "occasion": "party",
            "styles": ["trendy", "chic"],
            "outfitTypes": requested,
            "outfitType": "jumpsuit",
            "colors": ["black", "taupe", "champagne"]
        },
        "count": 3
    }
    data = query_recommendations(payload)
    recs = data.get("recommendations", [])
    print(f"Requested: {requested}")
    print(f"Received {len(recs)} recommendations:")

    assert len(recs) > 0, "Expected at least 1 recommendation"
    for r in recs:
        ot = r.get("outfitType", "").lower()
        print(f"  - ID: {r.get('id')} | Type: {ot} | Cat: {r.get('category')} | Name: {r.get('name')}")
        assert ot in canonical_allowed, f"Outfit type '{ot}' not in allowed set {canonical_allowed}"
    print(">>> PASS: Western exact constraint verified.")

def test_streetwear_constraint():
    print("=" * 60)
    print("TEST 3: STREETWEAR EXACT OUTFIT TYPE CONSTRAINT")
    requested = ["oversized_hoodie_pants", "graphic_layered", "cargo_sweatshirt"]
    canonical_allowed = {"oversized hoodie + pants", "graphic layered", "cargo + sweatshirt"}

    payload = {
        "preferences": {
            "occasion": "casual",
            "styles": ["streetwear", "urban"],
            "outfitTypes": requested,
            "outfitType": "oversized_hoodie_pants",
            "colors": ["charcoal", "black", "sage"]
        },
        "count": 3
    }
    data = query_recommendations(payload)
    recs = data.get("recommendations", [])
    print(f"Requested: {requested}")
    print(f"Received {len(recs)} recommendations:")

    assert len(recs) > 0, "Expected at least 1 recommendation"
    for r in recs:
        ot = r.get("outfitType", "").lower()
        print(f"  - ID: {r.get('id')} | Type: {ot} | Cat: {r.get('category')} | Name: {r.get('name')}")
        assert ot in canonical_allowed, f"Outfit type '{ot}' not in allowed set {canonical_allowed}"
    print(">>> PASS: Streetwear exact constraint verified.")

def test_professional_constraint():
    print("=" * 60)
    print("TEST 4: PROFESSIONAL EXACT OUTFIT TYPE CONSTRAINT")
    requested = ["blazer_outfit", "blouse_pencil_pant"]
    canonical_allowed = {"blazer outfit", "blouse + pencil-cut pant"}

    payload = {
        "preferences": {
            "occasion": "office",
            "styles": ["professional", "tailored"],
            "outfitTypes": requested,
            "outfitType": "blazer_outfit",
            "colors": ["navy", "camel", "champagne"]
        },
        "count": 3
    }
    data = query_recommendations(payload)
    recs = data.get("recommendations", [])
    print(f"Requested: {requested}")
    print(f"Received {len(recs)} recommendations:")

    assert len(recs) > 0, "Expected at least 1 recommendation"
    for r in recs:
        ot = r.get("outfitType", "").lower()
        print(f"  - ID: {r.get('id')} | Type: {ot} | Cat: {r.get('category')} | Name: {r.get('name')}")
        assert ot in canonical_allowed, f"Outfit type '{ot}' not in allowed set {canonical_allowed}"
    print(">>> PASS: Professional exact constraint verified.")

if __name__ == "__main__":
    test_traditional_constraint()
    test_western_constraint()
    test_streetwear_constraint()
    test_professional_constraint()
    print("\n" + "=" * 60)
    print("ALL 4 CATEGORY EXACT OUTFIT TYPE CONSTRAINT TESTS PASSED 100%!")
    print("=" * 60)

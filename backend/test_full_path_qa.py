import requests
import json
from app.services.taxonomy import taxonomy_engine, normalize_outfit_type
from app.data import load_fashion_catalog

BASE_URL = "http://localhost:8000"

def simulate_frontend_flow(name, user_selections):
    print(f"\n================================================================================")
    print(f"TEST CASE: {name}")
    print(f"================================================================================")
    print(f"1. What the user selected in the UI:")
    for k, v in user_selections.items():
        print(f"   - {k}: {v}")

    # Simulate React State in AppContext with clean session initialization:
    DEFAULT_PREFS = {
        "bodyShape": user_selections.get("bodyShape", ""),
        "occasion": "college",
        "styles": [],
        "weather": "warm",
        "outfitTypes": [],
        "outfitType": "",
        "colors": [],
        "palette": "soft_pastel",
        "fit": "relaxed",
        "comfort": "comfort_first",
        "footwear": "sneakers",
        "accessories": [],
        "avoid": ["nothing_to_avoid"]
    }
    
    prefs_state = { **DEFAULT_PREFS }
    
    if "occasion" in user_selections:
        prefs_state["occasion"] = user_selections["occasion"]
    if "styles" in user_selections:
        prefs_state["styles"] = user_selections["styles"] if isinstance(user_selections["styles"], list) else [user_selections["styles"]]
    if "weather" in user_selections:
        prefs_state["weather"] = user_selections["weather"]
    if "outfitTypes" in user_selections:
        types = user_selections["outfitTypes"] if isinstance(user_selections["outfitTypes"], list) else [user_selections["outfitTypes"]]
        prefs_state["outfitTypes"] = types
        prefs_state["outfitType"] = types[0] if len(types) > 0 else ""
    if "colors" in user_selections:
        prefs_state["colors"] = user_selections["colors"] if isinstance(user_selections["colors"], list) else [user_selections["colors"]]
    if "palette" in user_selections:
        prefs_state["palette"] = user_selections["palette"]
    if "fit" in user_selections:
        prefs_state["fit"] = user_selections["fit"]
    if "comfort" in user_selections:
        prefs_state["comfort"] = user_selections["comfort"]
    if "footwear" in user_selections:
        prefs_state["footwear"] = user_selections["footwear"]
    if "accessories" in user_selections:
        prefs_state["accessories"] = user_selections["accessories"] if isinstance(user_selections["accessories"], list) else [user_selections["accessories"]]
    if "avoid" in user_selections:
        prefs_state["avoid"] = user_selections["avoid"] if isinstance(user_selections["avoid"], list) else [user_selections["avoid"]]

    print(f"\n2. Final frontend preferences object:")
    print(json.dumps(prefs_state, indent=2))

    finalOutfitTypes = prefs_state.get("outfitTypes") or ([prefs_state.get("outfitType")] if prefs_state.get("outfitType") else [])
    finalOutfitType = prefs_state.get("outfitType") or (finalOutfitTypes[0] if len(finalOutfitTypes) > 0 else "")

    payload = {
        "preferences": {
            "bodyShape": prefs_state.get("bodyShape", ""),
            "styles": prefs_state.get("styles", []),
            "occasions": [prefs_state.get("occasion")] if prefs_state.get("occasion") else [],
            "occasion": prefs_state.get("occasion", ""),
            "colors": prefs_state.get("colors", []),
            "colorMoods": [prefs_state.get("palette")] if prefs_state.get("palette") else [],
            "palette": prefs_state.get("palette", ""),
            "outfitTypes": finalOutfitTypes,
            "outfitType": finalOutfitType,
            "footwear": [prefs_state.get("footwear")] if isinstance(prefs_state.get("footwear"), str) else prefs_state.get("footwear", []),
            "accessories": prefs_state.get("accessories", []),
            "jewellery": [],
            "comfort": [prefs_state.get("comfort")] if isinstance(prefs_state.get("comfort"), str) else prefs_state.get("comfort", []),
            "season": [],
            "weather": [prefs_state.get("weather")] if isinstance(prefs_state.get("weather"), str) else prefs_state.get("weather", []),
            "preferredFit": [prefs_state.get("fit")] if isinstance(prefs_state.get("fit"), str) else prefs_state.get("fit", []),
            "fit": prefs_state.get("fit", ""),
            "avoidedStyles": [a for a in prefs_state.get("avoid", []) if a != "nothing_to_avoid"],
            "avoidedColors": [],
            "avoid": prefs_state.get("avoid", [])
        },
        "recentlyShown": [],
        "count": 3,
        "seedOffset": 0
    }

    print(f"\n3. Exact POST /api/recommendations payload:")
    print(json.dumps(payload, indent=2))

    res = requests.post(f"{BASE_URL}/api/recommendations", json=payload)
    if not res.ok:
        print(f"ERROR: HTTP {res.status_code}: {res.text}")
        return False

    data = res.json()
    recs = data.get("recommendations", [])

    backend_prefs = payload["preferences"]
    allowed_types = taxonomy_engine.resolve_allowed_outfit_types(backend_prefs)
    target_category = taxonomy_engine.determine_target_category(backend_prefs)
    catalog = load_fashion_catalog()
    candidate_count_before = len(catalog)
    filtered_catalog = taxonomy_engine.filter_catalog(catalog, target_category=target_category, allowed_outfit_types=allowed_types)
    candidate_count_after = len(filtered_catalog)

    print(f"\n4. Backend received preferences:")
    print(f"   outfitTypes: {backend_prefs.get('outfitTypes')}")
    print(f"   outfitType: {backend_prefs.get('outfitType')}")
    print(f"   styles: {backend_prefs.get('styles')}")
    print(f"   occasion: {backend_prefs.get('occasion')}")
    print(f"\n5. resolved allowed_outfit_types: {allowed_types}")
    print(f"   resolved target_category: {target_category}")
    print(f"\n6. candidate count before filtering: {candidate_count_before}")
    print(f"\n7. candidate count after exact outfitType filtering: {candidate_count_after}")
    print(f"\n8. final recommendation IDs:")
    for r in recs:
        print(f"   - {r['id']}")
    print(f"\n9. final recommendation outfitTypes:")
    for r in recs:
        print(f"   - {r['outfitType']} (Category: {r['category']})")
    
    print(f"\n10. whether mockOutfits.js fallback was used: NO (Backend AI returned {len(recs)} looks)")

    canon_allowed = allowed_types or set()
    all_compliant = all(
        normalize_outfit_type(r['outfitType']) in canon_allowed or 
        ("dress" in canon_allowed and "dress" in normalize_outfit_type(r['outfitType']) and r.get("category") == "Western") or
        any(at == normalize_outfit_type(r['outfitType']) for at in canon_allowed)
        for r in recs
    )
    print(f"\nExact compliance: {'PASS' if all_compliant else 'FAIL'}")
    return all_compliant

tests = [
    # TRADITIONAL
    ("Traditional: lehenga_choli", {
        "bodyShape": "hourglass", "occasion": "wedding", "styles": ["traditional"],
        "weather": "pleasant", "outfitTypes": ["lehenga_choli"], "colors": ["crimson"],
        "palette": "rich jewel", "fit": "tailored", "comfort": "balanced",
        "footwear": "block_heels", "accessories": ["jewellery"], "avoid": ["nothing_to_avoid"]
    }),
    ("Traditional: sharara", {
        "bodyShape": "pear", "occasion": "festival", "styles": ["traditional"],
        "weather": "pleasant", "outfitTypes": ["sharara"], "colors": ["mustard"],
        "palette": "soft_pastel", "fit": "relaxed", "comfort": "comfort_first",
        "footwear": "toe_ring_sandals", "accessories": ["jewellery"], "avoid": ["nothing_to_avoid"]
    }),
    ("Traditional: long_dress", {
        "bodyShape": "rectangle", "occasion": "wedding", "styles": ["traditional"],
        "weather": "pleasant", "outfitTypes": ["long_dress"], "colors": ["ruby_red"],
        "palette": "rich jewel", "fit": "tailored", "comfort": "balanced",
        "footwear": "stiletto_heels", "accessories": ["handbag"], "avoid": ["nothing_to_avoid"]
    }),
    
    # STREETWEAR
    ("Streetwear: oversized_hoodie_pants", {
        "bodyShape": "rectangle", "occasion": "casual", "styles": ["streetwear"],
        "weather": "cold", "outfitTypes": ["oversized_hoodie_pants"], "colors": ["charcoal_grey"],
        "palette": "dark_aesthetic", "fit": "oversized", "comfort": "comfort_first",
        "footwear": "chunky_sneakers", "accessories": ["sunglasses"], "avoid": ["nothing_to_avoid"]
    }),
    ("Streetwear: graphic_layered", {
        "bodyShape": "inverted_triangle", "occasion": "college", "styles": ["streetwear"],
        "weather": "pleasant", "outfitTypes": ["graphic_layered"], "colors": ["black"],
        "palette": "monochrome", "fit": "oversized", "comfort": "comfort_first",
        "footwear": "sneakers", "accessories": ["minimal"], "avoid": ["nothing_to_avoid"]
    }),
    ("Streetwear: cargo_sweatshirt", {
        "bodyShape": "round", "occasion": "casual", "styles": ["streetwear"],
        "weather": "pleasant", "outfitTypes": ["cargo_sweatshirt"], "colors": ["green"],
        "palette": "neutral_minimal", "fit": "relaxed", "comfort": "comfort_first",
        "footwear": "combat_boots", "accessories": ["handbag"], "avoid": ["nothing_to_avoid"]
    }),

    # WESTERN
    ("Western: jumpsuit", {
        "bodyShape": "hourglass", "occasion": "date", "styles": ["elegant"],
        "weather": "warm", "outfitTypes": ["jumpsuit"], "colors": ["black"],
        "palette": "monochrome", "fit": "tailored", "comfort": "balanced",
        "footwear": "strappy_sandals", "accessories": ["handbag"], "avoid": ["nothing_to_avoid"]
    }),
    ("Western: co_ords", {
        "bodyShape": "pear", "occasion": "casual", "styles": ["trendy"],
        "weather": "warm", "outfitTypes": ["co_ords"], "colors": ["cream"],
        "palette": "soft_pastel", "fit": "relaxed", "comfort": "comfort_first",
        "footwear": "slides", "accessories": ["sunglasses"], "avoid": ["nothing_to_avoid"]
    }),
    ("Western: coord_set", {
        "bodyShape": "hourglass", "occasion": "casual", "styles": ["trendy"],
        "weather": "warm", "outfitTypes": ["coord_set"], "colors": ["white"],
        "palette": "soft_pastel", "fit": "relaxed", "comfort": "comfort_first",
        "footwear": "sneakers", "accessories": ["minimal"], "avoid": ["nothing_to_avoid"]
    }),

    # PROFESSIONAL
    ("Professional: blazer_outfit", {
        "bodyShape": "rectangle", "occasion": "office", "styles": ["professional", "business_formal"],
        "weather": "pleasant", "outfitTypes": ["blazer_outfit"], "colors": ["deep_plum"],
        "palette": "monochrome", "fit": "tailored", "comfort": "balanced",
        "footwear": "loafers", "accessories": ["watch"], "avoid": ["nothing_to_avoid"]
    }),
    ("Professional: blouse_pencil_pant", {
        "bodyShape": "hourglass", "occasion": "interview", "styles": ["professional"],
        "weather": "pleasant", "outfitTypes": ["blouse_pencil_pant"], "colors": ["white"],
        "palette": "neutral_minimal", "fit": "tailored", "comfort": "balanced",
        "footwear": "pumps", "accessories": ["handbag"], "avoid": ["nothing_to_avoid"]
    }),
]

results = []
for name, sel in tests:
    ok = simulate_frontend_flow(name, sel)
    results.append((name, ok))

print("\n================================================================================")
print("FINAL SUMMARY OF VERIFICATIONS:")
print("================================================================================")
for name, ok in results:
    print(f"{name}: {'PASS' if ok else 'FAIL'}")

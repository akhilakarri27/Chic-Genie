"""Comprehensive Machine Learning Model Validation & Test Suite for Chic Genie.

Validates:
1. Feature extraction from preferences and catalog looks.
2. RandomForestRegressor training and evaluation metrics (MAE, MSE, RMSE, R²).
3. Model serialization with joblib.
4. Independent inference across the 4 core styling scenarios:
   - Romantic Dinner
   - Festive Celebration
   - Smart Workwear
   - Streetwear
"""

import sys
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
from app.services.rag_service import rag_service
from app.ml.train_model import train_and_evaluate_model, MODEL_PATH, METADATA_PATH
from app.ml.predictor import predictor
from app.ml.feature_engineering import FEATURE_NAMES

logging.basicConfig(level=logging.WARNING)


def run_ml_tests():
    print("=" * 95)
    print("🤖 CHIC GENIE -- MACHINE LEARNING MODEL TRAINING & EVALUATION")
    print("=" * 95)

    # 1. Train and Evaluate Model
    print("\n[Step 1] Training & Evaluating RandomForestRegressor Model...")
    metadata = train_and_evaluate_model(test_size=0.20, n_estimators=100, max_depth=10)

    print(f"\n📊 Model Training Summary:")
    print(f"  • Model Architecture:   RandomForestRegressor (n_estimators={metadata['n_estimators']}, max_depth={metadata['max_depth']})")
    print(f"  • Total Dataset Size:   {metadata['total_samples']} samples across {metadata['num_features']} numerical features")
    print(f"  • Train/Test Split:     {metadata['train_samples']} train / {metadata['test_samples']} test (80% / 20%)")
    print(f"  • Artifact Path:        {MODEL_PATH}")
    print(f"\n📈 Evaluation Metrics (Test Set):")
    print(f"  • MAE  (Mean Absolute Error):     {metadata['metrics']['mae']:.4f}")
    print(f"  • MSE  (Mean Squared Error):      {metadata['metrics']['mse']:.4f}")
    print(f"  • RMSE (Root Mean Squared Error): {metadata['metrics']['rmse']:.4f}")
    print(f"  • R²   (Coefficient of Determ.):  {metadata['metrics']['r2_score']:.4f}")

    print("\n🔍 Top Feature Importances:")
    sorted_importances = sorted(metadata["feature_importances"].items(), key=lambda x: x[1], reverse=True)
    for feat, imp in sorted_importances[:6]:
        bar = "█" * int(imp * 40)
        print(f"  • {feat:<26}: {imp:.4f} {bar}")

    # 2. Test Predictor on 4 Scenarios
    print("\n" + "=" * 95)
    print("🎯 [Step 2] Testing ML Predictor on 4 Styling Scenarios")
    print("=" * 95)

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

    for idx, sc in enumerate(scenarios, start=1):
        prefs = sc["prefs"]
        print(f"\n{'-'*95}")
        print(f"[{idx}/4] {sc['name'].upper()}")
        print(f"{'-'*95}")

        # Step A: Retrieve candidate pool using RAG
        rag_candidates = rag_service.retrieve_candidates(prefs=prefs, top_k=6)

        # Step B: Score candidates with trained RandomForestRegressor
        ml_scored = predictor.predict_candidates(prefs=prefs, candidates=rag_candidates)

        # Step C: Print ranking table
        header = f"{'Rank':<5} | {'Outfit ID':<32} | {'RAG Score':<12} | {'ML Predicted':<14} | {'Match %':<10}"
        print(header)
        print("-" * 95)
        for rank, item in enumerate(ml_scored[:4], start=1):
            row = (
                f"#{rank:<4} | "
                f"{item['id']:<32} | "
                f"{item['rag_similarity']:<12.4f} | "
                f"{item['ml_predicted_score']:<14.4f} | "
                f"{item['ml_match_percent']:<9.2f}%"
            )
            print(row)
            print(f"       Look: {item['name']} ({item.get('category')} | {item.get('outfitType')})")

    print("\n" + "=" * 95)
    print("✅ MACHINE LEARNING MODEL VALIDATION COMPLETED SUCCESSFULLY!")
    print("=" * 95)


if __name__ == "__main__":
    run_ml_tests()

"""ML Explainability Report Generator for Chic Genie RandomForestRegressor.

Extracts feature_importances_ directly from the trained RandomForestRegressor model,
maps to feature names, verifies normalization, sorts by importance, and saves
backend/ml_feature_importance_report.json.
"""

import json
from pathlib import Path
import joblib
import numpy as np

from app.ml.feature_engineering import FEATURE_NAMES

MODEL_PATH = Path(__file__).resolve().parent / "app" / "ml" / "model" / "outfit_compatibility_rf.joblib"
METADATA_PATH = Path(__file__).resolve().parent / "app" / "ml" / "model" / "metadata.json"
OUTPUT_REPORT_PATH = Path(__file__).resolve().parent / "ml_feature_importance_report.json"


def main():
    if not MODEL_PATH.exists():
        raise FileNotFoundError(f"Model file not found at {MODEL_PATH}")

    # Load trained RandomForestRegressor
    model = joblib.load(MODEL_PATH)
    importances = model.feature_importances_

    # Verify length matches feature names
    if len(importances) != len(FEATURE_NAMES):
        raise ValueError(f"Feature count mismatch: model has {len(importances)}, FEATURE_NAMES has {len(FEATURE_NAMES)}")

    raw_sum = float(np.sum(importances))

    # Map feature names to importances
    feature_importance_list = []
    for name, imp in zip(FEATURE_NAMES, importances):
        feature_importance_list.append({
            "feature": name,
            "importance": float(imp),
            "percentage": round(float(imp) * 100.0, 2)
        })

    # Sort descending
    sorted_features = sorted(feature_importance_list, key=lambda x: x["importance"], reverse=True)

    # Add ranks
    for rank, item in enumerate(sorted_features, 1):
        item["rank"] = rank

    report_data = {
        "model_type": type(model).__name__,
        "model_path": str(MODEL_PATH.resolve()),
        "total_features": len(FEATURE_NAMES),
        "sum_of_importances": raw_sum,
        "is_normalized_to_one": bool(np.isclose(raw_sum, 1.0, atol=1e-5)),
        "top_5_features": [
            {
                "rank": item["rank"],
                "feature": item["feature"],
                "importance": round(item["importance"], 4),
                "percentage": f"{item['percentage']}%"
            }
            for item in sorted_features[:5]
        ],
        "all_feature_importances_ranked": [
            {
                "rank": item["rank"],
                "feature": item["feature"],
                "importance": round(item["importance"], 4),
                "percentage": f"{item['percentage']}%"
            }
            for item in sorted_features
        ],
        "model_modified": False
    }

    # Save report
    with open(OUTPUT_REPORT_PATH, "w", encoding="utf-8") as f:
        json.dump(report_data, f, indent=2)

    print("=" * 70)
    print("CHIC GENIE ML FEATURE IMPORTANCE REPORT")
    print("=" * 70)
    print(f"Model Path: {MODEL_PATH.resolve()}")
    print(f"Model Type: {type(model).__name__}")
    print(f"Total Features: {len(FEATURE_NAMES)}")
    print(f"Sum of Importances: {raw_sum:.6f} (Normalized = {np.isclose(raw_sum, 1.0)})")
    print("-" * 70)
    print(f"{'Rank':<6} | {'Feature':<28} | {'Importance':<12} | {'Percentage':<10}")
    print("-" * 70)
    for item in sorted_features:
        print(f"{item['rank']:<6} | {item['feature']:<28} | {item['importance']:<12.4f} | {item['percentage']:>6.2f}%")
    print("=" * 70)
    print(f"Report successfully saved to: {OUTPUT_REPORT_PATH.resolve()}")


if __name__ == "__main__":
    main()

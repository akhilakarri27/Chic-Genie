"""Training Pipeline for Chic Genie Outfit Compatibility RandomForestRegressor.

Generates a weakly-supervised domain-derived training dataset from catalog outfits and
diverse user preference profiles, trains a scikit-learn RandomForestRegressor,
evaluates performance metrics (MAE, MSE, RMSE, R²), and persists the model artifact.
"""

import os
import json
import logging
import random
from pathlib import Path
from datetime import datetime
from typing import List, Dict, Any, Tuple

import joblib
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

from app.data import load_fashion_catalog
from app.ml.feature_engineering import extract_features, FEATURE_NAMES

logger = logging.getLogger("chic_genie.ml.training")
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")

MODEL_DIR = Path(__file__).resolve().parent / "model"
MODEL_PATH = MODEL_DIR / "outfit_compatibility_rf.joblib"
METADATA_PATH = MODEL_DIR / "metadata.json"

RANDOM_SEED = 42


def set_seed(seed: int = RANDOM_SEED):
    """Sets random seeds for complete reproducibility."""
    random.seed(seed)
    np.random.seed(seed)


def generate_synthetic_preference_profiles(num_profiles: int = 150) -> List[Dict[str, Any]]:
    """
    Generates diverse, realistic user preference profiles spanning body shapes,
    styles, occasions, color palettes, garment types, and fit coordinates.
    """
    body_shapes = ["hourglass", "pear", "rectangle", "inverted_triangle", "round"]
    styles_pool = [
        ["romantic", "elegant"],
        ["minimal chic", "clean"],
        ["streetwear", "casual", "edgy"],
        ["festive", "traditional", "royal"],
        ["smart casual", "formal", "office"],
        ["boho", "relaxed"],
        ["preppy", "cute"],
        ["activewear", "sporty"]
    ]
    occasions_pool = [
        ["dinner", "date"],
        ["wedding", "festive"],
        ["work", "office", "presentation"],
        ["casual", "hangout", "college"],
        ["party", "nightout"],
        ["travel", "vacation"]
    ]
    colors_pool = [
        ["burgundy", "gold"],
        ["emerald", "ruby", "gold"],
        ["charcoal", "white", "black", "navy"],
        ["olive", "black", "white"],
        ["lavender", "silver"],
        ["sage", "beige", "ivory"],
        ["dusty rose", "cream"],
        ["mustard", "terracotta"]
    ]
    palettes_pool = ["rich jewel", "monochrome", "earthy", "pastel", "neutral", "vibrant"]
    outfit_types_pool = [
        ["wrap dress", "midi dress"],
        ["saree", "lehenga"],
        ["blazer", "trousers"],
        ["cargo", "oversized tee", "jacket"],
        ["co-ord set", "linen set"],
        ["anarkali", "kurti set"],
        ["pleated skirt", "shirt"]
    ]
    fits_pool = ["tailored", "relaxed", "oversized", "fitted"]
    comforts_pool = ["balanced", "comfort_first", "style_first"]
    weathers_pool = [["mild", "breezy"], ["warm"], ["cool", "cold"], ["humid"]]
    seasons_pool = ["Autumn/Winter", "Spring/Summer", "Monsoon", "All Season"]
    footwear_pool = [["block heels"], ["sneakers"], ["loafers"], ["juttis"], ["strappy heels"], ["pointed flats"]]

    profiles: List[Dict[str, Any]] = []

    for i in range(num_profiles):
        prof = {
            "id": f"pref_profile_{i:04d}",
            "bodyShape": random.choice(body_shapes),
            "styles": random.choice(styles_pool),
            "occasions": random.choice(occasions_pool),
            "colors": random.choice(colors_pool),
            "palette": random.choice(palettes_pool),
            "outfitTypes": random.choice(outfit_types_pool),
            "preferredFit": random.choice(fits_pool),
            "comfort": random.choice(comforts_pool),
            "weather": random.choice(weathers_pool),
            "season": random.choice(seasons_pool),
            "footwear": random.choice(footwear_pool),
            "avoidedStyles": random.choice([[], ["streetwear"], ["boho"], ["glam"]]) if random.random() < 0.25 else [],
            "avoidedColors": random.choice([[], ["neon"], ["black"], ["yellow"]]) if random.random() < 0.20 else []
        }
        profiles.append(prof)

    return profiles


def compute_domain_target_score(
    features_dict: Dict[str, float]
) -> float:
    """
    Computes the domain-derived compatibility target ground truth score in [0.0, 1.0].
    
    Target Formulation:
    - Base compatibility is a synergy of dense RAG similarity, style/occasion alignment,
      body silhouette harmony, and drape/fit match.
    - Synergy bonus (+0.05) if both style and body shape exhibit high harmony.
    - Avoidance penalty (-0.40) if avoided aesthetics are present.
    - Controlled Gaussian noise (sigma=0.015) representing natural styling subjectivity.
    """
    f_rag = features_dict["rag_similarity"]
    f_style = features_dict["style_match"]
    f_occ = features_dict["occasion_match"]
    f_body = features_dict["body_shape_compatibility"]
    f_color = features_dict["color_match"]
    f_type = features_dict["outfit_type_match"]
    f_fit = features_dict["fit_comfort_match"]
    f_nov = features_dict["novelty_score"]
    f_avoid = features_dict["avoid_penalty_flag"]

    # Base domain weighted ground truth
    base_score = (
        0.35 * f_rag +
        0.18 * f_style +
        0.15 * f_occ +
        0.12 * f_body +
        0.08 * f_color +
        0.06 * f_type +
        0.04 * f_fit +
        0.02 * f_nov
    )

    # Styling synergy bonus: high style match + high body silhouette harmony boosts overall satisfaction
    synergy_bonus = 0.04 if (f_style >= 0.85 and f_body >= 0.90) else 0.0

    # Avoid penalty
    avoid_deduction = 0.40 if f_avoid > 0.5 else 0.0

    # Realistic human subjectivity noise
    noise = float(np.random.normal(0.0, 0.015))

    target = base_score + synergy_bonus - avoid_deduction + noise
    return float(np.clip(target, 0.0, 1.0))


def build_training_dataset(
    catalog: List[Dict[str, Any]],
    num_profiles: int = 200
) -> Tuple[np.ndarray, np.ndarray, List[Dict[str, Any]]]:
    """
    Generates matrix X of features and vector y of compatibility scores.
    """
    set_seed(RANDOM_SEED)
    profiles = generate_synthetic_preference_profiles(num_profiles=num_profiles)
    logger.info("Generated %d synthetic user preference personas.", len(profiles))

    X_list: List[List[float]] = []
    y_list: List[float] = []
    metadata_records: List[Dict[str, Any]] = []

    for prof in profiles:
        for outfit in catalog:
            # Simulate realistic RAG semantic similarity score correlated with text overlap
            # We compute a base similarity with slight variation
            style_match_prior = 0.85 if any(s in outfit.get("styles", []) or s == outfit.get("style") for s in prof["styles"]) else 0.45
            occ_match_prior = 0.90 if any(o in outfit.get("occasions", []) or o == outfit.get("occasion") for o in prof["occasions"]) else 0.40
            sim_prior = (style_match_prior * 0.5) + (occ_match_prior * 0.5) + np.random.uniform(-0.10, 0.10)
            sim_rag = float(np.clip(sim_prior, 0.25, 0.95))

            # Simulate novelty score
            sim_novelty = random.choice([1.0, 1.0, 1.0, 0.75, 0.40])

            features = extract_features(
                prefs=prof,
                outfit=outfit,
                rag_similarity=sim_rag,
                novelty_score=sim_novelty
            )
            f_dict = dict(zip(FEATURE_NAMES, features))
            target_score = compute_domain_target_score(f_dict)

            X_list.append(features)
            y_list.append(target_score)
            metadata_records.append({
                "pref_id": prof["id"],
                "outfit_id": outfit.get("id"),
                "target": target_score
            })

    X = np.array(X_list, dtype=np.float32)
    y = np.array(y_list, dtype=np.float32)
    logger.info("Generated training dataset: X.shape = %s, y.shape = %s", X.shape, y.shape)
    return X, y, metadata_records


def train_and_evaluate_model(
    test_size: float = 0.20,
    n_estimators: int = 100,
    max_depth: int = 10
) -> Dict[str, Any]:
    """
    Executes full ML training workflow:
    1. Loads fashion catalog.
    2. Builds weakly-supervised feature & target matrix.
    3. Splits into train/test sets.
    4. Fits RandomForestRegressor.
    5. Evaluates MAE, MSE, RMSE, R².
    6. Persists model artifact with metadata.
    """
    set_seed(RANDOM_SEED)
    catalog = load_fashion_catalog()
    if not catalog:
        raise ValueError("Fashion catalog is empty or missing.")

    logger.info("Loaded fashion catalog containing %d looks.", len(catalog))
    X, y, _ = build_training_dataset(catalog=catalog, num_profiles=220)

    # Train / Test split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=test_size, random_state=RANDOM_SEED
    )
    logger.info(
        "Train/Test Split (%.0f%% / %.0f%%): Train samples = %d, Test samples = %d",
        (1.0 - test_size) * 100.0,
        test_size * 100.0,
        X_train.shape[0],
        X_test.shape[0]
    )

    # Instantiate & Train RandomForestRegressor
    rf = RandomForestRegressor(
        n_estimators=n_estimators,
        max_depth=max_depth,
        min_samples_split=4,
        min_samples_leaf=2,
        random_state=RANDOM_SEED,
        n_jobs=-1
    )
    logger.info("Training RandomForestRegressor (n_estimators=%d, max_depth=%d)...", n_estimators, max_depth)
    rf.fit(X_train, y_train)

    # Evaluate on Test Set
    y_pred = rf.predict(X_test)
    y_pred_clipped = np.clip(y_pred, 0.0, 1.0)

    mae = float(mean_absolute_error(y_test, y_pred_clipped))
    mse = float(mean_squared_error(y_test, y_pred_clipped))
    rmse = float(np.sqrt(mse))
    r2 = float(r2_score(y_test, y_pred_clipped))

    logger.info("=" * 60)
    logger.info("ML Model Evaluation Metrics (Test Set):")
    logger.info("  MAE  (Mean Absolute Error):      %.4f", mae)
    logger.info("  MSE  (Mean Squared Error):       %.4f", mse)
    logger.info("  RMSE (Root Mean Squared Error):  %.4f", rmse)
    logger.info("  R²   (Coefficient of Determ.):   %.4f", r2)
    logger.info("=" * 60)

    # Feature importances
    importances = dict(zip(FEATURE_NAMES, [round(float(imp), 4) for imp in rf.feature_importances_]))
    logger.info("Feature Importances: %s", json.dumps(importances, indent=2))

    # Save Model Artifact
    os.makedirs(MODEL_DIR, exist_ok=True)
    joblib.dump(rf, MODEL_PATH)
    logger.info("Saved trained RandomForestRegressor to: %s", MODEL_PATH)

    metadata = {
        "model_type": "RandomForestRegressor",
        "n_estimators": n_estimators,
        "max_depth": max_depth,
        "features": FEATURE_NAMES,
        "num_features": len(FEATURE_NAMES),
        "total_samples": int(X.shape[0]),
        "train_samples": int(X_train.shape[0]),
        "test_samples": int(X_test.shape[0]),
        "metrics": {
            "mae": round(mae, 4),
            "mse": round(mse, 4),
            "rmse": round(rmse, 4),
            "r2_score": round(r2, 4)
        },
        "feature_importances": importances,
        "target_definition": (
            "Weakly-supervised domain compatibility target Ground Truth blending RAG similarity (0.35), "
            "style match (0.18), occasion match (0.15), body silhouette harmony (0.12), "
            "color match (0.08), garment type (0.06), fit (0.04), novelty (0.02), "
            "styling synergy bonus (+0.04), avoid penalty (-0.40), and Gaussian noise (sigma=0.015)."
        ),
        "trained_at": datetime.now().isoformat(),
        "random_seed": RANDOM_SEED
    }

    with open(METADATA_PATH, "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2)
    logger.info("Saved model metadata to: %s", METADATA_PATH)

    return metadata


if __name__ == "__main__":
    train_and_evaluate_model()

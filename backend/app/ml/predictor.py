"""ML Compatibility Predictor Service for Chic Genie.

Loads the trained RandomForestRegressor model artifact and performs high-speed
compatibility score inference for candidate fashion ensembles.
"""

import os
import json
import logging
from pathlib import Path
from typing import List, Dict, Any, Optional, Union

import joblib
import numpy as np

from app.models.preferences import PreferencesInput
from app.ml.feature_engineering import extract_features, extract_features_dict, FEATURE_NAMES

logger = logging.getLogger("chic_genie.ml.predictor")
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")

MODEL_DIR = Path(__file__).resolve().parent / "model"
MODEL_PATH = MODEL_DIR / "outfit_compatibility_rf.joblib"
METADATA_PATH = MODEL_DIR / "metadata.json"


class OutfitCompatibilityPredictor:
    """
    Inference service for ML outfit compatibility scoring.
    """

    def __init__(self, model_path: Optional[Path] = None):
        self.model_path = model_path or MODEL_PATH
        self.model = None
        self.metadata = {}
        self._load_model()

    def _load_model(self):
        """Loads trained joblib model artifact or triggers automatic training if absent."""
        if not self.model_path.exists():
            logger.info("Model file not found at %s. Triggering training pipeline...", self.model_path)
            from app.ml.train_model import train_and_evaluate_model
            self.metadata = train_and_evaluate_model()

        try:
            self.model = joblib.load(self.model_path)
            logger.info("Loaded RandomForestRegressor model from: %s", self.model_path)
            if METADATA_PATH.exists():
                with open(METADATA_PATH, "r", encoding="utf-8") as f:
                    self.metadata = json.load(f)
        except Exception as e:
            logger.error("Error loading model artifact: %s", e)
            raise e

    def predict_score(
        self,
        prefs: Union[PreferencesInput, Dict[str, Any]],
        outfit: Dict[str, Any],
        rag_similarity: float = 0.5,
        novelty_score: float = 1.0
    ) -> float:
        """
        Predicts compatibility score in [0.0, 1.0] for a single outfit.
        """
        if self.model is None:
            self._load_model()

        features = extract_features(
            prefs=prefs,
            outfit=outfit,
            rag_similarity=rag_similarity,
            novelty_score=novelty_score
        )
        X = np.array([features], dtype=np.float32)
        score = float(self.model.predict(X)[0])
        return round(float(np.clip(score, 0.0, 1.0)), 4)

    def predict_candidates(
        self,
        prefs: Union[PreferencesInput, Dict[str, Any]],
        candidates: List[Dict[str, Any]],
        recently_shown: Optional[List[str]] = None
    ) -> List[Dict[str, Any]]:
        """
        Predicts compatibility scores for a batch of candidate outfits.
        Returns candidates enriched with `ml_predicted_score` and component features.
        """
        if not candidates:
            return []
        if self.model is None:
            self._load_model()

        recently_shown = recently_shown or []
        X_batch: List[List[float]] = []
        enriched: List[Dict[str, Any]] = []

        from app.services.novelty import calculate_novelty_score

        for cand in candidates:
            outfit_id = str(cand.get("id"))
            rag_sim = float(cand.get("similarity_score", cand.get("rag_similarity", 0.5)))
            nov_score = float(cand.get("novelty_score", calculate_novelty_score(outfit_id, recently_shown)))

            # Feature dictionary & ordered vector
            f_dict = extract_features_dict(
                prefs=prefs,
                outfit=cand,
                rag_similarity=rag_sim,
                novelty_score=nov_score
            )
            feature_vector = [f_dict[name] for name in FEATURE_NAMES]
            X_batch.append(feature_vector)

            enriched.append({
                **cand,
                "rag_similarity": round(rag_sim, 4),
                "novelty_score": round(nov_score, 4),
                "features": f_dict
            })

        # Batch prediction
        X_mat = np.array(X_batch, dtype=np.float32)
        preds = self.model.predict(X_mat)
        clipped_preds = np.clip(preds, 0.0, 1.0)

        for i in range(len(enriched)):
            pred_score = round(float(clipped_preds[i]), 4)
            enriched[i]["ml_predicted_score"] = pred_score
            enriched[i]["ml_match_percent"] = round(pred_score * 100.0, 2)

        # Sort descending by ML predicted score
        enriched.sort(key=lambda x: x["ml_predicted_score"], reverse=True)
        return enriched


# Global singleton instance
predictor = OutfitCompatibilityPredictor()

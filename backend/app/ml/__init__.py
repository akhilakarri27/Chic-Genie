"""Machine Learning Package for Chic Genie.

Provides feature engineering, model training, and ML compatibility prediction
using scikit-learn RandomForestRegressor.
"""

from app.ml.feature_engineering import extract_features, FEATURE_NAMES
from app.ml.predictor import predictor, OutfitCompatibilityPredictor

__all__ = [
    "extract_features",
    "FEATURE_NAMES",
    "predictor",
    "OutfitCompatibilityPredictor",
]

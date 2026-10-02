"""Configuration Settings for Chic Genie Backend."""

import os
from typing import List, Dict
from dotenv import load_dotenv

# Load .env file if present
load_dotenv()


class Settings:
    PROJECT_NAME: str = os.getenv("PROJECT_NAME", "Chic Genie Backend")
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    API_V1_STR: str = os.getenv("API_V1_STR", "/api")
    
    # CORS Configuration
    CORS_ORIGINS: List[str] = [
        origin.strip()
        for origin in os.getenv("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173").split(",")
        if origin.strip()
    ]

    # Centralized Recommendation Scoring Weights
    SCORING_WEIGHTS: Dict[str, float] = {
        "style_match": 25.0,
        "body_shape_compatibility": 20.0,
        "occasion_match": 20.0,
        "outfit_type_match": 15.0,
        "color_match": 15.0,
        "footwear_match": 10.0,
        "accessory_match": 5.0,
        "season_weather_match": 10.0,
        "fit_comfort_match": 10.0,
        "novelty_bonus": 10.0,
    }


settings = Settings()

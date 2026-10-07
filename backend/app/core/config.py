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

    # RAG & Vector Store Configuration
    EMBEDDING_MODEL_NAME: str = os.getenv("EMBEDDING_MODEL_NAME", "all-MiniLM-L6-v2")
    CHROMA_PERSIST_DIR: str = os.getenv(
        "CHROMA_PERSIST_DIR",
        os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "chroma_db")
    )
    CHROMA_COLLECTION_NAME: str = os.getenv("CHROMA_COLLECTION_NAME", "chic_genie_fashion_catalog")

    # Hybrid Reranking Weights (Normalized to sum to 1.0)
    HYBRID_WEIGHTS: Dict[str, float] = {
        "rag_semantic_similarity": 0.50,
        "preference_match": 0.25,
        "body_shape_compatibility": 0.15,
        "novelty": 0.10,
    }

    # Production AI/ML Pipeline Configuration
    AI_RECOMMENDATIONS_ENABLED: bool = os.getenv("AI_RECOMMENDATIONS_ENABLED", "true").lower() in ("true", "1", "yes")
    FINAL_PIPELINE_WEIGHTS: Dict[str, float] = {
        "rag_similarity": 0.35,
        "ml_compatibility": 0.35,
        "preference_match": 0.15,
        "body_shape_compatibility": 0.10,
        "novelty": 0.05,
    }

    # LLM Generation Layer Configuration
    LLM_ENABLED: bool = os.getenv("LLM_ENABLED", "true").lower() in ("true", "1", "yes")
    LLM_PROVIDER: str = os.getenv("LLM_PROVIDER", "auto")  # auto, gemini, openai, ollama, fallback
    LLM_MODEL_NAME: str = os.getenv("LLM_MODEL_NAME", "gemini-1.5-flash")
    LLM_TIMEOUT_SECONDS: float = float(os.getenv("LLM_TIMEOUT_SECONDS", "4.0"))
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", os.getenv("GOOGLE_API_KEY", ""))
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    OPENAI_API_BASE: str = os.getenv("OPENAI_API_BASE", "https://api.openai.com/v1")
    OLLAMA_API_BASE: str = os.getenv("OLLAMA_API_BASE", "http://localhost:11434")


settings = Settings()

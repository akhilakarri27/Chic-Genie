"""Fashion Catalog Data Loader for Chic Genie."""

import json
from pathlib import Path
from typing import List, Dict, Any

CATALOG_PATH = Path(__file__).parent / "fashion_catalog.json"


def load_fashion_catalog() -> List[Dict[str, Any]]:
    """Loads and returns the comprehensive fashion catalog from fashion_catalog.json."""
    try:
        with open(CATALOG_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading fashion catalog: {e}")
        return []


# Pre-loaded catalog instance
FASHION_CATALOG = load_fashion_catalog()

__all__ = ["load_fashion_catalog", "FASHION_CATALOG"]

"""Vector Store Service for Chic Genie RAG Pipeline.

Manages persistent ChromaDB vector storage, document indexing for fashion outfits,
and cosine similarity semantic search.
"""

import os
import logging
from pathlib import Path
from typing import List, Dict, Any, Optional, Union

import chromadb
from chromadb.config import Settings as ChromaSettings

from app.core.config import settings
from app.data import load_fashion_catalog
from app.services.embedding_service import embedding_service, EmbeddingService

logger = logging.getLogger("chic_genie.rag.vector_store")
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")


def _format_list_field(val: Any) -> str:
    """Safely converts list, string, or None into a readable comma-separated string."""
    if not val:
        return ""
    if isinstance(val, list):
        return ", ".join(str(item).strip() for item in val if item)
    return str(val).strip()


def build_outfit_document(outfit: Dict[str, Any]) -> str:
    """
    Converts a fashion_catalog.json item into a rich, comprehensive semantic document text
    encompassing every key design attribute, garment separate, context, and aesthetic coordinate.
    """
    outfit_id = outfit.get("id", "")
    name = outfit.get("name", "Fashion Look")
    category = outfit.get("category", "")
    sub_category = outfit.get("subCategory", "")
    outfit_type = outfit.get("outfitType", "")
    silhouette = outfit.get("silhouette", "")

    # Garments
    garments = []
    if outfit.get("top"):
        garments.append(f"Top: {outfit.get('top')}")
    if outfit.get("bottom"):
        garments.append(f"Bottom: {outfit.get('bottom')}")
    if outfit.get("dress"):
        garments.append(f"Dress: {outfit.get('dress')}")
    if outfit.get("saree"):
        garments.append(f"Saree: {outfit.get('saree')}")
    if outfit.get("blouse"):
        garments.append(f"Blouse: {outfit.get('blouse')}")
    if outfit.get("layer"):
        garments.append(f"Layer/Outerwear: {outfit.get('layer')}")
    garments_text = "; ".join(garments) if garments else "Coordinated ensemble"

    # Color & Aesthetics
    primary_color = outfit.get("color", "")
    secondary_color = outfit.get("secondaryColor", "")
    color_family = outfit.get("colorFamily", "")
    color_mood = outfit.get("colorMood", "")
    palette = outfit.get("palette", "")
    colors = _format_list_field(outfit.get("colors", []))
    pattern = outfit.get("pattern", "")
    fabric = outfit.get("fabric", "")

    # Construction & Fit
    fit = outfit.get("fit", "")
    neckline = outfit.get("neckline", "")
    waist = outfit.get("waistDefinition", "")

    # Styling Coordinates
    style = outfit.get("style", "")
    styles = _format_list_field(outfit.get("styles", []))
    occasions = _format_list_field(outfit.get("occasions", []))
    occasion = outfit.get("occasion", "")
    body_shapes = _format_list_field(outfit.get("bodyShapes", []) or outfit.get("bodyShapeCompatibility", []))

    # Context & Details
    season = outfit.get("season", "")
    weather = _format_list_field(outfit.get("weather", []))
    comfort = outfit.get("comfort", "")
    formality = outfit.get("formality", "")

    # Accessorizing
    footwear = outfit.get("footwear", "")
    jewellery = outfit.get("jewellery", "")
    bag = outfit.get("bag", "")
    accessories = outfit.get("accessories", "")

    # Editorial Description & Tags
    description = outfit.get("description", "")
    tags = _format_list_field(outfit.get("tags", []))

    doc = f"""Title: {name}
ID: {outfit_id}
Category: {category} ({sub_category})
Outfit Format: {outfit_type} | Silhouette: {silhouette}
Garments: {garments_text}
Colors & Palette: {primary_color}, {secondary_color} ({palette} palette, {color_family} family, {color_mood} mood). All colors: {colors}
Fabric & Pattern: {fabric} with {pattern} pattern | Fit: {fit} | Neckline: {neckline} | Waist: {waist}
Aesthetic Styles: {style} (Styles: {styles})
Suitable Occasions: {occasion}, {occasions} | Formality: {formality}
Compatible Body Shapes: {body_shapes}
Season & Weather: {season} ({weather}) | Comfort Level: {comfort}
Footwear: {footwear}
Jewellery & Accents: {jewellery} | Bag: {bag} | Accessories: {accessories}
Editorial Summary: {description}
Search Tags: {tags}"""

    return doc.strip()


def build_outfit_metadata(outfit: Dict[str, Any]) -> Dict[str, Any]:
    """
    Extracts flat primitive metadata for ChromaDB filtering and indexing.
    ChromaDB requires metadata values to be str, int, float, or bool.
    """
    return {
        "id": str(outfit.get("id", "")),
        "name": str(outfit.get("name", "")),
        "category": str(outfit.get("category", "")),
        "subCategory": str(outfit.get("subCategory", "") or ""),
        "outfitType": str(outfit.get("outfitType", "")),
        "silhouette": str(outfit.get("silhouette", "")),
        "color": str(outfit.get("color", "")),
        "colorFamily": str(outfit.get("colorFamily", "") or ""),
        "colorMood": str(outfit.get("colorMood", "") or ""),
        "palette": str(outfit.get("palette", "") or ""),
        "fabric": str(outfit.get("fabric", "") or ""),
        "fit": str(outfit.get("fit", "") or ""),
        "style": str(outfit.get("style", "")),
        "styles": _format_list_field(outfit.get("styles", [])),
        "occasion": str(outfit.get("occasion", "") or ""),
        "occasions": _format_list_field(outfit.get("occasions", [])),
        "bodyShapes": _format_list_field(outfit.get("bodyShapes", []) or outfit.get("bodyShapeCompatibility", [])),
        "season": str(outfit.get("season", "") or ""),
        "formality": str(outfit.get("formality", "") or ""),
        "avatarUrl": str(outfit.get("avatarUrl", "") or "/avatars/casual_chic.jpg"),
        "tags": _format_list_field(outfit.get("tags", []))
    }


class VectorStoreService:
    """
    ChromaDB-backed vector database service for semantic indexing and retrieval.
    """

    def __init__(
        self,
        persist_dir: Optional[str] = None,
        collection_name: Optional[str] = None,
        embedder: Optional[EmbeddingService] = None
    ):
        self.persist_dir = persist_dir or settings.CHROMA_PERSIST_DIR
        self.collection_name = collection_name or settings.CHROMA_COLLECTION_NAME
        self.embedder = embedder or embedding_service

        # Ensure persist directory exists
        os.makedirs(self.persist_dir, exist_ok=True)

        logger.info(
            "Initializing ChromaDB PersistentClient at path: %s",
            self.persist_dir
        )
        self.client = chromadb.PersistentClient(
            path=self.persist_dir,
            settings=ChromaSettings(anonymized_telemetry=False)
        )

        # Get or create collection with cosine similarity distance space
        self.collection = self.client.get_or_create_collection(
            name=self.collection_name,
            metadata={"hnsw:space": "cosine", "description": "Chic Genie fashion catalog embeddings"}
        )
        logger.info(
            "ChromaDB collection '%s' ready. Current document count: %d",
            self.collection_name,
            self.collection.count()
        )

    def count_documents(self) -> int:
        """Returns the number of documents in the collection."""
        return self.collection.count()

    def index_catalog(
        self,
        catalog: Optional[List[Dict[str, Any]]] = None,
        force_reindex: bool = False
    ) -> int:
        """
        Indexes or updates the vector database from fashion_catalog.json.
        Generates document texts and dense embeddings for each outfit.
        """
        catalog = catalog or load_fashion_catalog()
        if not catalog:
            logger.warning("No catalog data available to index.")
            return 0

        existing_count = self.collection.count()
        if existing_count > 0 and not force_reindex:
            logger.info(
                "Vector store already contains %d indexed outfits. Skipping reindex (set force_reindex=True to override).",
                existing_count
            )
            return existing_count

        logger.info(
            "Starting indexing pipeline for %d catalog outfits (force_reindex=%s, embedding_model=%s)...",
            len(catalog),
            force_reindex,
            self.embedder.model_name
        )

        ids: List[str] = []
        documents: List[str] = []
        metadatas: List[Dict[str, Any]] = []

        for item in catalog:
            item_id = str(item.get("id"))
            if not item_id:
                continue

            doc_text = build_outfit_document(item)
            meta = build_outfit_metadata(item)

            ids.append(item_id)
            documents.append(doc_text)
            metadatas.append(meta)

        # Generate dense embeddings for all documents
        embeddings = self.embedder.embed_documents(documents)

        # Upsert into ChromaDB
        self.collection.upsert(
            ids=ids,
            documents=documents,
            metadatas=metadatas,
            embeddings=embeddings
        )

        total_indexed = self.collection.count()
        logger.info(
            "Successfully indexed %d fashion outfits into collection '%s'.",
            total_indexed,
            self.collection_name
        )
        return total_indexed

    def query_similar(
        self,
        query_embedding: List[float],
        top_k: int = 5,
        where: Optional[Dict[str, Any]] = None
    ) -> List[Dict[str, Any]]:
        """
        Performs semantic cosine similarity search against indexed outfits.
        Returns matched documents with metadata and computed similarity scores.
        """
        if self.collection.count() == 0:
            logger.warning("Vector store collection is empty. Please index catalog first.")
            return []

        query_args: Dict[str, Any] = {
            "query_embeddings": [query_embedding],
            "n_results": min(top_k, self.collection.count()),
            "include": ["documents", "metadatas", "distances"]
        }

        if where:
            query_args["where"] = where

        results = self.collection.query(**query_args)

        retrieved: List[Dict[str, Any]] = []
        if not results or not results.get("ids") or not results["ids"][0]:
            return []

        ids = results["ids"][0]
        distances = results.get("distances", [[]])[0]
        metadatas = results.get("metadatas", [[]])[0]
        docs = results.get("documents", [[]])[0]

        for idx in range(len(ids)):
            item_id = ids[idx]
            dist = distances[idx] if idx < len(distances) else 0.0
            meta = metadatas[idx] if idx < len(metadatas) else {}
            doc = docs[idx] if idx < len(docs) else ""

            # For cosine distance, similarity is 1.0 - distance (clamped between 0.0 and 1.0)
            similarity = max(0.0, min(1.0, 1.0 - dist))

            retrieved.append({
                "id": item_id,
                "similarity_score": round(similarity, 4),
                "distance": round(dist, 4),
                "metadata": meta,
                "document": doc
            })

        return retrieved


# Global singleton instance
vector_store_service = VectorStoreService()

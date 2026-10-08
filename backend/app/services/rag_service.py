"""RAG (Retrieval-Augmented Generation) Service for Chic Genie.

Transforms structured user styling coordinates into rich semantic search queries,
executes dense vector retrieval against the ChromaDB fashion catalog knowledge base,
and logs comprehensive retrieval diagnostics.
"""

import logging
from typing import List, Dict, Any, Optional, Union, Set

from app.models.preferences import PreferencesInput
from app.services.embedding_service import embedding_service, EmbeddingService
from app.services.vector_store import vector_store_service, VectorStoreService
from app.data import load_fashion_catalog

logger = logging.getLogger("chic_genie.rag.service")
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")


def _to_list(value: Any) -> List[str]:
    """Helper to safely extract list of non-empty strings."""
    if not value:
        return []
    if isinstance(value, str):
        return [item.strip() for item in value.split(",") if item.strip()]
    if isinstance(value, list):
        items = []
        for v in value:
            if isinstance(v, str):
                items.extend([i.strip() for i in v.split(",") if i.strip()])
            elif v is not None:
                items.append(str(v).strip())
        return items
    return [str(value).strip()]


from app.services.taxonomy import taxonomy_engine


class FashionRAGService:
    """
    RAG service responsible for natural-language query formulation,
    dense semantic vector search, and catalog retrieval for fashion recommendations.
    """

    def __init__(
        self,
        embedder: Optional[EmbeddingService] = None,
        vector_store: Optional[VectorStoreService] = None
    ):
        self.embedder = embedder or embedding_service
        self.vector_store = vector_store or vector_store_service
        self._catalog_map: Dict[str, Dict[str, Any]] = {}
        self._load_catalog_cache()

    def _load_catalog_cache(self):
        """Loads fast in-memory lookup cache of catalog outfits by ID."""
        catalog = load_fashion_catalog()
        self._catalog_map = {str(item.get("id")): item for item in catalog if item.get("id")}

    def build_user_query(self, prefs: Union[PreferencesInput, Dict[str, Any]]) -> str:
        """
        Synthesizes structured user preferences into an expressive natural-language search query.
        
        Example Output:
        "Looking for a romantic, minimal chic wrap dress in burgundy, gold (rich jewel palette) 
        for a dinner, date occasion. Flattering for an hourglass silhouette with tailored fit 
        and balanced comfort. Styled with block heels and minimal gold jewellery for mild, breezy weather."
        """
        if isinstance(prefs, PreferencesInput):
            pref_dict = prefs.model_dump()
        elif isinstance(prefs, dict):
            pref_dict = prefs
        else:
            pref_dict = {}

        styles = _to_list(pref_dict.get("styles"))
        occasions = _to_list(pref_dict.get("occasions"))
        if pref_dict.get("occasion"):
            occasions.extend(_to_list(pref_dict.get("occasion")))
        
        colors = _to_list(pref_dict.get("colors"))
        palettes = _to_list(pref_dict.get("colorMoods"))
        if pref_dict.get("palette"):
            palettes.extend(_to_list(pref_dict.get("palette")))

        outfit_types = _to_list(pref_dict.get("outfitTypes"))
        if pref_dict.get("outfitType"):
            outfit_types.extend(_to_list(pref_dict.get("outfitType")))

        body_shape = ", ".join(_to_list(pref_dict.get("bodyShape")))
        fit = ", ".join(_to_list(pref_dict.get("preferredFit") or pref_dict.get("fit")))
        comfort = ", ".join(_to_list(pref_dict.get("comfort")))
        weather = _to_list(pref_dict.get("weather"))
        season = ", ".join(_to_list(pref_dict.get("season")))
        footwear = _to_list(pref_dict.get("footwear"))
        jewellery = _to_list(pref_dict.get("jewellery"))
        accessories = _to_list(pref_dict.get("accessories"))

        # Build natural-language components
        query_parts: List[str] = []

        # Style & Garment Target
        style_phrase = ", ".join(styles) if styles else ""
        type_phrase = ", ".join(outfit_types) if outfit_types else "complete fashion look"
        
        if style_phrase:
            query_parts.append(f"Looking for a {style_phrase} aesthetic {type_phrase}")
        else:
            query_parts.append(f"Looking for a stylish {type_phrase}")

        # Colors & Palette
        color_phrase = ", ".join(colors) if colors and "any" not in colors else ""
        palette_phrase = ", ".join(palettes) if palettes else ""
        if color_phrase and palette_phrase:
            query_parts.append(f"in {color_phrase} ({palette_phrase} palette)")
        elif color_phrase:
            query_parts.append(f"in {color_phrase}")
        elif palette_phrase:
            query_parts.append(f"featuring a {palette_phrase} color palette")

        # Occasion
        if occasions:
            query_parts.append(f"for {', '.join(occasions)} occasion")

        # Body Shape & Silhouette
        if body_shape:
            query_parts.append(f"flattering for a {body_shape} body shape silhouette")

        # Fit & Comfort
        if fit and comfort:
            query_parts.append(f"with a {fit} fit and {comfort} comfort priority")
        elif fit:
            query_parts.append(f"with a {fit} fit")
        elif comfort:
            query_parts.append(f"designed for {comfort} wear")

        # Context (Weather / Season)
        if weather:
            query_parts.append(f"suitable for {', '.join(weather)} weather")
        if season:
            query_parts.append(f"in {season} season")

        # Accents & Accessories
        acc_list = []
        if footwear:
            acc_list.append(f"footwear: {', '.join(footwear)}")
        if jewellery:
            acc_list.append(f"jewellery: {', '.join(jewellery)}")
        if accessories:
            acc_list.append(f"accessories: {', '.join(accessories)}")
        if acc_list:
            query_parts.append(f"coordinated with {', '.join(acc_list)}")

        query = ". ".join(query_parts) + "."
        return query

    def index_knowledge_base(self, force_reindex: bool = False) -> int:
        """
        Indexes or refreshes the ChromaDB vector database using the fashion catalog.
        """
        logger.info("Triggering vector database indexing (model: %s)...", self.embedder.model_name)
        count = self.vector_store.index_catalog(force_reindex=force_reindex)
        self._load_catalog_cache()
        logger.info("Knowledge base indexing complete. Total documents indexed: %d", count)
        return count

    def retrieve_candidates(
        self,
        prefs: Union[PreferencesInput, Dict[str, Any]],
        top_k: int = 5,
        recently_shown: Optional[List[str]] = None,
        target_category: Optional[str] = None,
        allowed_outfit_types: Optional[Set[str]] = None
    ) -> List[Dict[str, Any]]:
        """
        Retrieves top relevant fashion recommendations using dense semantic vector search.
        Applies hard exact outfitType constraint (priority) and category constraint (secondary).
        
        Returns:
            List of dictionaries containing:
            - id: str
            - name: str
            - similarity_score: float (0.0 to 1.0)
            - distance: float
            - raw_catalog_item: Dict[str, Any] (full original catalog item)
            - metadata: Dict[str, Any]
            - document_snippet: str
            - generated_query: str
        """
        recently_shown = recently_shown or []

        # Resolve constraints if not provided
        if allowed_outfit_types is None:
            allowed_outfit_types = taxonomy_engine.resolve_allowed_outfit_types(prefs)
        if target_category is None:
            target_category = taxonomy_engine.determine_target_category(prefs)

        # 1. Synthesize natural-language query
        user_query = self.build_user_query(prefs)
        logger.info("=" * 60)
        logger.info("Chic Genie RAG Retrieval Request:")
        logger.info("Generated Semantic Query: \"%s\"", user_query)
        logger.info("Allowed Outfit Types Constraint: %s", allowed_outfit_types or "None (All Types)")
        logger.info("Target Category Constraint: %s", target_category or "None (Full Catalog)")
        logger.info("Embedding Model: %s (Dim: %d)", self.embedder.model_name, self.embedder.dimension)

        # 2. Ensure knowledge base is indexed
        if self.vector_store.count_documents() == 0:
            logger.info("Vector database empty. Performing auto-indexing...")
            self.index_knowledge_base(force_reindex=False)

        # 3. Compute query embedding vector
        query_vector = self.embedder.embed_query(user_query)

        # 4. Filter catalog candidates using exact constraint engine FIRST
        catalog = load_fashion_catalog()
        eligible_items = taxonomy_engine.filter_catalog(
            catalog,
            target_category=target_category,
            allowed_outfit_types=allowed_outfit_types
        )
        eligible_ids: Set[str] = {str(item.get("id")) for item in eligible_items if item.get("id")}
        
        logger.info(
            "RAG Pre-filtering: Filtered from %d total catalog items to %d eligible candidates (Allowed Types: %s)",
            len(catalog), len(eligible_ids), allowed_outfit_types
        )

        # 5. Fetch semantic vector search candidates from ChromaDB over eligible items
        doc_count = self.vector_store.count_documents()
        fetch_k = max(doc_count, top_k + len(recently_shown))
        raw_results = self.vector_store.query_similar(query_embedding=query_vector, top_k=fetch_k)

        # 6. Enrich candidates and enforce strict membership in eligible_ids
        results: List[Dict[str, Any]] = []
        for r in raw_results:
            outfit_id = str(r["id"])
            if outfit_id not in eligible_ids:
                continue
            if recently_shown and outfit_id in recently_shown:
                continue

            catalog_item = self._catalog_map.get(outfit_id, {})

            results.append({
                "id": outfit_id,
                "name": r["metadata"].get("name") or catalog_item.get("name", ""),
                "category": r["metadata"].get("category") or catalog_item.get("category", ""),
                "outfitType": r["metadata"].get("outfitType") or catalog_item.get("outfitType", ""),
                "style": r["metadata"].get("style") or catalog_item.get("style", ""),
                "color": r["metadata"].get("color") or catalog_item.get("color", ""),
                "similarity_score": r["similarity_score"],
                "distance": r["distance"],
                "metadata": r["metadata"],
                "raw_catalog_item": catalog_item,
                "document_snippet": r["document"][:200] + "...",
                "generated_query": user_query
            })

            if len(results) >= top_k:
                break

        # If recently_shown excluded too many, allow unshown eligible candidates
        if len(results) < min(len(eligible_ids), top_k):
            for r in raw_results:
                outfit_id = str(r["id"])
                if outfit_id in eligible_ids and not any(res["id"] == outfit_id for res in results):
                    catalog_item = self._catalog_map.get(outfit_id, {})
                    results.append({
                        "id": outfit_id,
                        "name": r["metadata"].get("name") or catalog_item.get("name", ""),
                        "category": r["metadata"].get("category") or catalog_item.get("category", ""),
                        "outfitType": r["metadata"].get("outfitType") or catalog_item.get("outfitType", ""),
                        "style": r["metadata"].get("style") or catalog_item.get("style", ""),
                        "color": r["metadata"].get("color") or catalog_item.get("color", ""),
                        "similarity_score": r["similarity_score"],
                        "distance": r["distance"],
                        "metadata": r["metadata"],
                        "raw_catalog_item": catalog_item,
                        "document_snippet": r["document"][:200] + "...",
                        "generated_query": user_query
                    })
                    if len(results) >= top_k:
                        break

        # 6. Detailed diagnostic logging
        logger.info(
            "RAG Retrieval Summary: Returned %d matches (requested top_k=%d, allowed_types=%s, category=%s):",
            len(results), top_k, allowed_outfit_types, target_category
        )
        for rank, res in enumerate(results, start=1):
            logger.info(
                "  [%d] ID: %s | Match: %.2f%% (Dist: %.4f) | %s | %s | %s",
                rank,
                res["id"],
                res["similarity_score"] * 100.0,
                res["distance"],
                res["name"],
                res["category"],
                res["outfitType"]
            )
        logger.info("=" * 60)

        return results


# Global singleton instance
rag_service = FashionRAGService()

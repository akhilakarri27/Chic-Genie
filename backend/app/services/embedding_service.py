"""Embedding Service for Chic Genie RAG Pipeline.

Utilizes sentence-transformers to generate dense semantic vector representations
for fashion catalog items and user styling preference queries.
"""

import logging
from typing import List, Optional
from sentence_transformers import SentenceTransformer

from app.core.config import settings

logger = logging.getLogger("chic_genie.rag.embedding_service")
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")


class EmbeddingService:
    """
    Singleton / thread-safe service for managing sentence-transformers models
    and computing text embeddings.
    """

    _instance: Optional["EmbeddingService"] = None
    _model: Optional[SentenceTransformer] = None

    def __new__(cls, model_name: Optional[str] = None):
        if cls._instance is None:
            cls._instance = super(EmbeddingService, cls).__new__(cls)
        return cls._instance

    def __init__(self, model_name: Optional[str] = None):
        target_model = model_name or settings.EMBEDDING_MODEL_NAME
        if self._model is None:
            logger.info("Initializing SentenceTransformer embedding model: %s", target_model)
            try:
                self._model = SentenceTransformer(target_model)
                self._model_name = target_model
                if hasattr(self._model, "get_embedding_dimension"):
                    self._dimension = self._model.get_embedding_dimension()
                else:
                    self._dimension = self._model.get_sentence_embedding_dimension()
                logger.info(
                    "Embedding model '%s' loaded successfully. Vector dimension: %d",
                    self._model_name,
                    self._dimension
                )
            except Exception as e:
                logger.error("Failed to load embedding model '%s': %s", target_model, e)
                raise e

    @property
    def model_name(self) -> str:
        """Returns the name of the active embedding model."""
        return self._model_name

    @property
    def dimension(self) -> int:
        """Returns the output vector dimensionality."""
        return self._dimension

    def embed_text(self, text: str) -> List[float]:
        """
        Generates a normalized embedding vector for a single string.
        """
        if not text or not text.strip():
            logger.warning("Empty text passed to embed_text; returning zero-vector.")
            return [0.0] * self._dimension

        embedding = self._model.encode(text.strip(), normalize_embeddings=True)
        return embedding.tolist()

    def embed_documents(self, texts: List[str], batch_size: int = 32) -> List[List[float]]:
        """
        Generates normalized embedding vectors for a batch of documents.
        """
        if not texts:
            return []

        cleaned_texts = [t.strip() if t and t.strip() else "fashion outfit" for t in texts]
        logger.info("Generating embeddings for %d documents (batch_size=%d)...", len(cleaned_texts), batch_size)
        embeddings = self._model.encode(
            cleaned_texts,
            batch_size=batch_size,
            show_progress_bar=False,
            normalize_embeddings=True
        )
        logger.info("Generated %d document embeddings.", len(embeddings))
        return embeddings.tolist()

    def embed_query(self, query: str) -> List[float]:
        """
        Generates an embedding vector for a user styling preference query.
        """
        logger.debug("Embedding user query: %s", query)
        return self.embed_text(query)


# Global singleton instance
embedding_service = EmbeddingService()

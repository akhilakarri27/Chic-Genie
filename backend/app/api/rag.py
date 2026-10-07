"""RAG Retrieval API Endpoints for Chic Genie.

Enables testing and direct semantic query execution against the ChromaDB vector database.
"""

from typing import List, Dict, Any, Optional
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field

from app.models.preferences import PreferencesInput, RecommendationRequest
from app.services.rag_service import rag_service

router = APIRouter(prefix="/rag", tags=["RAG Retrieval"])


class RAGRetrievalItem(BaseModel):
    id: str
    name: str
    category: str
    outfitType: str
    style: str
    color: str
    similarity_score: float
    distance: float
    metadata: Dict[str, Any]
    document_snippet: str


class RAGRetrievalResponse(BaseModel):
    status: str = "success"
    query: str
    count: int
    results: List[RAGRetrievalItem]


class RAGIndexResponse(BaseModel):
    status: str = "success"
    indexed_documents: int
    collection_name: str
    embedding_model: str


@router.post(
    "/query",
    response_model=RAGRetrievalResponse,
    status_code=status.HTTP_200_OK,
    summary="Semantic vector retrieval query using user styling coordinates"
)
async def query_rag(request: RecommendationRequest) -> RAGRetrievalResponse:
    """
    Executes dense semantic retrieval against the ChromaDB fashion catalog knowledge base.
    Generates a natural-language query representation and returns ranked candidates with similarity scores.
    """
    try:
        candidates = rag_service.retrieve_candidates(
            prefs=request.preferences,
            top_k=request.count,
            recently_shown=request.recentlyShown
        )
        user_query = rag_service.build_user_query(request.preferences)

        results = [
            RAGRetrievalItem(
                id=c["id"],
                name=c["name"],
                category=c["category"],
                outfitType=c["outfitType"],
                style=c["style"],
                color=c["color"],
                similarity_score=c["similarity_score"],
                distance=c["distance"],
                metadata=c["metadata"],
                document_snippet=c["document_snippet"]
            )
            for c in candidates
        ]

        return RAGRetrievalResponse(
            status="success",
            query=user_query,
            count=len(results),
            results=results
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"RAG retrieval error: {str(e)}"
        )


@router.post(
    "/index",
    response_model=RAGIndexResponse,
    status_code=status.HTTP_200_OK,
    summary="Index or refresh fashion catalog vector database"
)
async def index_rag(force: bool = False) -> RAGIndexResponse:
    """
    Indexes the fashion catalog into ChromaDB embeddings.
    """
    try:
        count = rag_service.index_knowledge_base(force_reindex=force)
        return RAGIndexResponse(
            status="success",
            indexed_documents=count,
            collection_name=rag_service.vector_store.collection_name,
            embedding_model=rag_service.embedder.model_name
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Indexing error: {str(e)}"
        )


class HybridRerankItem(BaseModel):
    id: str
    name: str
    category: str
    outfitType: str
    style: str
    color: str
    rag_similarity: float
    preference_score: float
    body_compatibility: float
    novelty_score: float
    hybrid_score: float
    avatarUrl: Optional[str] = None


class HybridRerankResponse(BaseModel):
    status: str = "success"
    formula: str = "Final = (0.50 * RAG) + (0.25 * Preference) + (0.15 * BodyShape) + (0.10 * Novelty)"
    count: int
    results: List[HybridRerankItem]


@router.post(
    "/hybrid",
    response_model=HybridRerankResponse,
    status_code=status.HTTP_200_OK,
    summary="Execute multi-factor hybrid reranking"
)
async def query_hybrid(request: RecommendationRequest) -> HybridRerankResponse:
    """
    Executes hybrid reranking combining:
    - RAG semantic similarity (0.50)
    - Preference/rule matching (0.25)
    - Body-shape compatibility (0.15)
    - Novelty score (0.10)
    Returns ranked candidates with transparent sub-scores and diversity filtering.
    """
    try:
        from app.services.hybrid_reranker import hybrid_reranker
        top_picks = hybrid_reranker.rerank(
            prefs=request.preferences,
            top_k=request.count,
            recently_shown=request.recentlyShown
        )

        results = [
            HybridRerankItem(
                id=item["id"],
                name=item["name"],
                category=item["category"],
                outfitType=item["outfitType"],
                style=item["style"],
                color=item["color"],
                rag_similarity=item["rag_similarity"],
                preference_score=item["preference_score"],
                body_compatibility=item["body_compatibility"],
                novelty_score=item["novelty_score"],
                hybrid_score=item["hybrid_score"],
                avatarUrl=item.get("avatarUrl")
            )
            for item in top_picks
        ]

        return HybridRerankResponse(
            status="success",
            count=len(results),
            results=results
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Hybrid reranking error: {str(e)}"
        )


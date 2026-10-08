# Chic Genie — AI-Powered Fashion Intelligence & Recommendation System

Chic Genie is an end-to-end, personalized fashion styling and outfit recommendation platform. It combines dense semantic vector search (**Retrieval-Augmented Generation / RAG**), tabular Machine Learning (**RandomForestRegressor**), deterministic taxonomy constraint enforcement, and dynamic editorial natural language generation to curate personalized looks based on user silhouette, aesthetic preferences, occasion, and comfort requirements.

---

## Table of Contents
1. [Project Overview](#1-project-overview)
2. [Problem Statement](#2-problem-statement)
3. [Objectives](#3-objectives)
4. [Key Features](#4-key-features)
5. [Technology Stack](#5-technology-stack)
6. [System Architecture](#6-system-architecture)
7. [Complete Recommendation Pipeline](#7-complete-recommendation-pipeline)
8. [Frontend Architecture](#8-frontend-architecture)
9. [Backend Architecture](#9-backend-architecture)
10. [RAG Implementation](#10-rag-implementation)
11. [ML Implementation & Performance Metrics](#11-ml-implementation--performance-metrics)
12. [ML Explainability & Feature Importance](#12-ml-explainability--feature-importance)
13. [Hybrid Ranking Formula](#13-hybrid-ranking-formula)
14. [Exact Outfit-Type Taxonomy Engine](#14-exact-outfit-type-taxonomy-engine)
15. [Diversity & Novelty Handling](#15-diversity--novelty-handling)
16. [LLM Explanation Layer](#16-llm-explanation-layer)
17. [API Endpoints](#17-api-endpoints)
18. [Testing & Evaluation](#18-testing--evaluation)
19. [Real Browser End-to-End Verification](#19-real-browser-end-to-end-verification)
20. [Project Directory Structure](#20-project-directory-structure)
21. [Setup and Run Instructions](#21-setup-and-run-instructions)
22. [System Limitations](#22-system-limitations)
23. [Future Enhancements](#23-future-enhancements)

---

## 1. Project Overview
Modern fashion e-commerce platforms often suffer from "catalog fatigue," presenting vast unfiltered grids of clothing that ignore individual body silhouettes, color harmony, and occasion constraints. Chic Genie solves this by acting as an intelligent AI Personal Stylist that transforms multi-step user preferences into cohesive, head-to-toe ensemble recommendations.

The system enforces strict taxonomic constraints to prevent category and outfit-type leakage, retrieves semantically relevant candidates via vector embeddings, evaluates multi-factor compatibility using a trained machine learning model, and reranks the results using a hybrid multi-objective formula.

---

## 2. Problem Statement
Generic fashion recommendation engines typically rely solely on collaborative filtering (e.g., "users who bought X also bought Y") or keyword matching. These methods exhibit critical shortcomings:
* **Zero Silhouette Awareness:** Recommendations often mismatch the user's specific body shape (e.g., hourglass, pear, rectangle, apple, inverted triangle).
* **Category and Silhouette Format Drift:** Users selecting an ethnic ensemble (e.g., *Lehenga Choli*) or a tailored workwear outfit (e.g., *Blazer Outfit*) frequently receive unrelated items (such as casual t-shirts or Western dresses) due to unconstrained search.
* **Lack of Explainability:** Recommendations are delivered without personalized styling rationale, diminishing user trust.
* **Candidate Pool Saturation:** Recommenders repeatedly surface identical items across pagination cycles.

---

## 3. Objectives
1. **Deterministic Taxonomic Precision:** Ensure 100% exact compliance with selected outfit formats (e.g., *Lehenga Choli*, *Sharara*, *Jumpsuit*, *Co-ords*, *Oversized Hoodie + Pants*, *Blazer Outfit*) before scoring.
2. **Dense Semantic Retrieval (RAG):** Map rich, multi-attribute user preference prompts into a dense semantic vector space for contextual retrieval.
3. **ML-Driven Compatibility Scoring:** Predict silhouette, palette, occasion, and comfort alignment using a trained supervised regression model.
4. **Multi-Factor Hybrid Reranking:** Combine semantic vector similarity, tabular ML compatibility, heuristic preference rules, silhouette harmony, and diversity/novelty penalties into a unified score.
5. **Explainable AI:** Provide transparent feature importance breakdowns and dynamic natural language styling rationales for every recommended look.

---

## 4. Key Features
* **Interactive 6-Step Preferences Wizard:** Captures body shape silhouette, occasion, aesthetic styles, color mood & palette, garment format, comfort, fit, footwear, accessories, and avoided attributes.
* **Curated 39-Look Multi-Category Catalog:** High-definition ensembles covering Traditional, Western, Streetwear, and Professional aesthetics.
* **Zero-Leakage Taxonomy Engine:** Canonical normalization and strict pre-filtering to prevent cross-category contamination.
* **Vector Semantic Search (ChromaDB + MiniLM):** Fast semantic retrieval over dense 384-dimensional embeddings.
* **RandomForest Tabular Scorer:** Evaluates 14 distinct styling and compatibility features.
* **Dynamic Editorial Styling Notes:** Synthesizes custom explanations tailored to user choices.
* **Interactive AI Stylist Chat:** Conversational assistant for dynamic styling queries and fashion tips.
* **Favorites & Wardrobe Management:** Local storage persistence for saving, filtering, and organizing curated looks.

---

## 5. Technology Stack

### Frontend
* **Core:** React 19, JavaScript (ES6+)
* **Build Tool:** Vite
* **Routing:** React Router DOM v7
* **State Management:** React Context API (`AppContext`)
* **Styling:** Vanilla CSS3 Design System (Glassmorphism, CSS Custom Properties, Responsive Grids)
* **Icons:** Lucide React

### Backend
* **Web Framework:** FastAPI (Python 3.10+)
* **Server:** Uvicorn (ASGI)
* **Data Validation:** Pydantic v2
* **Vector Database:** ChromaDB (Embedded / Persistent Client)
* **Embedding Model:** `sentence-transformers/all-MiniLM-L6-v2` (384-dimensional dense vectors)
* **Machine Learning:** Scikit-Learn (`RandomForestRegressor`), NumPy, Pandas, Joblib
* **Testing:** Pytest, Custom Automated QA Verification Suites

---

## 6. System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           FRONTEND (React + Vite)                       │
│  ┌────────────────────────┐  ┌─────────────────┐  ┌──────────────────┐  │
│  │   Preferences Wizard   │  │ Recommendations │  │ AI Stylist Chat  │  │
│  └───────────┬────────────┘  └────────▲────────┘  └──────────────────┘  │
│              │                        │                                 │
│              │ AppContext / api.js    │ JSON Response                   │
└──────────────┼────────────────────────┼─────────────────────────────────┘
               │ POST /api/recommendations
┌──────────────▼────────────────────────┴─────────────────────────────────┐
│                           BACKEND (FastAPI)                             │
│                                                                         │
│  1. Pydantic Request Validation (PreferencesInput)                      │
│     └── Validates bodyShape, occasion, styles, outfitTypes, colors...   │
│                                                                         │
│  2. Exact Taxonomy Constraint Engine (taxonomy.py)                      │
│     ├── Resolves canonical outfit type & target category               │
│     └── Pre-filters 39 catalog items -> Eligible candidates only       │
│                                                                         │
│  3. Dense Semantic Vector Retrieval (rag_service.py)                    │
│     ├── Synthesizes contextual natural language preference prompt       │
│     ├── Generates 384-dim embedding via all-MiniLM-L6-v2                │
│     └── ChromaDB vector query over pre-filtered candidate subset        │
│                                                                         │
│  4. Tabular Feature Extraction & ML Scoring (predictor.py)              │
│     ├── Computes 14 normalized numerical styling features               │
│     └── RandomForestRegressor predicts ensemble compatibility score     │
│                                                                         │
│  5. Multi-Factor Hybrid Reranking (recommendation_engine.py)            │
│     └── Final = 0.35 RAG + 0.35 ML + 0.15 Pref + 0.10 Body + 0.05 Nov   │
│                                                                         │
│  6. Editorial Explanation & Response Synthesis (llm_service.py)         │
│     └── Formulates structured Outfit models with styling rationale     │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 7. Complete Recommendation Pipeline

The recommendation pipeline processes every curation request through 6 deterministic, sequential stages:

1. **Preference Payload Ingestion:**
   The frontend captures user inputs from the Wizard into `AppContext`, which dispatches a structured JSON payload to `POST /api/recommendations`.
2. **Deterministic Taxonomy Pre-Filtering (`taxonomy.py`):**
   * Maps UI identifiers (`lehenga_choli`, `blazer_outfit`, `oversized_hoodie_pants`, etc.) to canonical taxonomy entries.
   * Filters the complete fashion catalog (39 items) down to eligible candidates *before* scoring. This guarantees 100% compliance with user intent and eliminates cross-category leakage.
3. **Dense Semantic Retrieval (`rag_service.py`):**
   * Generates a descriptive query text summarizing the user's styling profile.
   * Embeds the query into a 384-dimensional dense vector using `all-MiniLM-L6-v2`.
   * Queries the ChromaDB vector index over the eligible candidate pool to compute cosine similarity scores.
4. **14-Feature ML Compatibility Scoring (`predictor.py` + `feature_engineering.py`):**
   * Constructs a 14-dimensional feature vector for each candidate.
   * Evaluates feature values using the trained `RandomForestRegressor` to output a non-linear compatibility score between 0.0 and 1.0.
5. **Multi-Factor Hybrid Fusion (`recommendation_engine.py`):**
   * Applies the weighted hybrid ranking formula combining semantic similarity, ML compatibility, heuristic preference rules, silhouette compatibility, and novelty.
6. **Editorial Explanation Generation & Delivery:**
   * Synthesizes personalized styling advice based on silhouette harmony, occasion dressing, and accessory pairing.

---

## 8. Frontend Architecture

The user interface is built as a single-page application (SPA) focused on clean luxury aesthetics, micro-interactions, and mobile responsiveness:

* **`src/context/AppContext.jsx`:** Central state store managing user profile state, active preference selections, recent recommendations, and saved looks. Includes automated fallback protection and pagination seed tracking.
* **`src/pages/PreferencesWizard.jsx`:** 6-step guided curation flow:
  1. *Body Silhouette Selection:* Visual cards with proportional styling tips.
  2. *Occasion & Aesthetics:* Multiple style tag toggles (Traditional, Western, Streetwear, Professional).
  3. *Outfit Format Selection:* Multi-select cards matching the canonical taxonomy.
  4. *Palette & Color Mood:* Swatches for neutrals, rich jewels, pastels, and monochromes.
  5. *Fit & Comfort:* Drape, fit preference, and comfort priorities.
  6. *Footwear, Accessories & Avoidances:* Accent pairings and negative filtering tags.
* **`src/pages/Recommendations.jsx`:** Editorial showcase displaying top-ranked looks with confidence match badges, breakdown drawer, and dynamic styling rationale.
* **`src/pages/Home.jsx`:** Hero landing with instant preset launch pads and trending vibe collections.
* **`src/pages/StylistChat.jsx`:** Conversational AI fashion assistant interface.
* **`src/pages/Profile.jsx`:** User styling preferences summary and saved looks wardrobe.

---

## 9. Backend Architecture

The backend is architected in Python using FastAPI with modular separation of concerns:

* **`app/main.py`:** Application entry point, CORS middleware configuration, and startup event hooks (initializing ChromaDB catalog embeddings).
* **`app/api/`:** REST route handlers:
  * `recommendations.py`: Core endpoint `POST /api/recommendations`.
  * `rag.py`: RAG search and status endpoints.
  * `health.py`: Liveness and readiness probes.
* **`app/services/taxonomy.py`:** Centralized fashion taxonomy engine with canonical name normalization, alias mapping, category resolution, and strict candidate filtering.
* **`app/services/rag_service.py`:** Embedding generation and ChromaDB vector retrieval service.
* **`app/services/recommendation_engine.py`:** Orchestrates taxonomy filtering, RAG retrieval, ML inference, hybrid fusion, and response serialization.
* **`app/ml/`:** Machine learning subsystem containing model artifacts, training scripts, feature engineering, and inference predictor.

---

## 10. RAG Implementation

Chic Genie uses a Retrieval-Augmented Generation pattern to perform dense semantic retrieval over fashion catalog items:

* **Embedding Model:** `sentence-transformers/all-MiniLM-L6-v2`
* **Embedding Dimension:** `384` dense floating-point values.
* **Vector Store:** **ChromaDB** with a persistent local storage directory (`backend/app/data/chroma_db`).
* **Document Chunking / Indexing:** Each catalog outfit is indexed as a rich structured text document containing:
  `"[Name] is a [Category] outfit of type [OutfitType] with a [Style] style in [Color] ([ColorMood] palette). Designed for [Occasion] occasions with a [Fit] fit, [Comfort] comfort priority, and [Formality] formality. Pairs with [Footwear] and [Accessories]. Flattering for [FlatteringBodyShapes] silhouettes."`
* **Query Synthesis:** When a user requests recommendations, their selections are synthesized into a natural language prompt and embedded into the same 384-dimensional space.
* **Pre-Filtering Constraint:** Cosine similarity distance is calculated across items pre-filtered by the taxonomy engine to prevent cross-category drift.

---

## 11. ML Implementation & Performance Metrics

### Model Architecture
* **Algorithm:** `RandomForestRegressor` (`scikit-learn`)
* **Hyperparameters:** `n_estimators = 100`, `max_depth = 10`, `random_state = 42`
* **Input Features:** `14` normalized numerical features ($x_i \in [0.0, 1.0]$)
* **Model Artifact:** [`backend/app/ml/model/outfit_compatibility_rf.joblib`](backend/app/ml/model/outfit_compatibility_rf.joblib)

### Dataset Specification
* **Dataset Type:** **Weakly-supervised / domain-derived synthetic dataset** combining structured fashion ontology rules, silhouette harmony matrices, color theory rules, and Gaussian noise ($\sigma = 0.015$).
* **Note on Dataset:** *The 8,580 training/test samples are domain-derived simulated interactions based on fashion design principles and are not empirical human user ratings.*
* **Total Samples:** `8,580`
* **Training Partition (80%):** `6,864` samples
* **Testing Partition (20%):** `1,716` samples

### Offline Evaluation Metrics
The model was evaluated on the held-out 1,716 test samples (recorded in `backend/app/ml/model/metadata.json`):

| Metric | Measured Value | Interpretation |
| :--- | :--- | :--- |
| **Coefficient of Determination ($R^2$)** | **`0.9866`** | Explains 98.66% of the variance in the domain compatibility ground truth *(Note: $R^2$ is a regression variance metric, not classification accuracy)* |
| **Mean Absolute Error (MAE)** | **`0.0130`** | Average deviation of only 1.30% from the target score on a 0–1 scale |
| **Root Mean Squared Error (RMSE)** | **`0.0165`** | Low penalty for outlier predictions across all held-out test splits |

---

## 12. ML Explainability & Feature Importance

Feature importance values were extracted directly from the trained `RandomForestRegressor` via Gini importance (`feature_importances_`) without retraining.

Full report: [`backend/ml_feature_importance_report.json`](backend/ml_feature_importance_report.json)

### Complete Feature Importance Table (14 Features, Sorted)

| Rank | Feature Name | Description | Importance | Percentage |
| :---: | :--- | :--- | :---: | :---: |
| **1** | `rag_similarity` | Dense semantic vector cosine similarity between user prompt and outfit | **`0.7196`** | 71.96% |
| **2** | `avoid_penalty_flag` | Negative binary constraint flag if outfit contains avoided styles/colors | **`0.2122`** | 21.22% |
| **3** | `color_match` | Match score across user selected colors and outfit color family | **`0.0297`** | 2.97% |
| **4** | `style_match` | Overlap between user aesthetic styles and outfit style tags | **`0.0179`** | 1.79% |
| **5** | `body_shape_compatibility` | Proportional silhouette compatibility score based on body shape | **`0.0125`** | 1.25% |
| **6** | `outfit_type_match` | Format alignment between preference outfit type and outfit metadata | **`0.0039`** | 0.39% |
| **7** | `occasion_match` | Suitability of the ensemble for the selected event/occasion | **`0.0016`** | 0.16% |
| **8** | `fit_comfort_match` | Drape, fit type, and comfort priority alignment | **`0.0011`** | 0.11% |
| **9** | `novelty_score` | Non-repetition recency factor penalizing recently shown looks | **`0.0010`** | 0.10% |
| **10** | `weather_season_match` | Seasonal and climatic suitability | **`0.0003`** | 0.03% |
| **11** | `formality_match` | Formality level alignment (casual, smart casual, festive, formal) | **`0.0001`** | 0.01% |
| **12** | `footwear_match` | Footwear coordination and compatibility | **`0.0001`** | 0.01% |
| **13** | `palette_match` | Mood and color palette classification match | **`0.0000`** | 0.00% |
| **14** | `accessory_match` | Jewellery, bags, and accessory synergy | **`0.0000`** | 0.00% |
| **—** | **Total Sum of Importances** | **Strictly normalized sum** | **`1.0000`** | **100.00%** |

### Top 5 Features Analysis
1. **`rag_similarity` (71.96%):** The primary driver of contextual styling alignment, ensuring that the visual description and multi-attribute prompt match the retrieved look.
2. **`avoid_penalty_flag` (21.22%):** The primary negative filter, ensuring that disliked aesthetics or colors are strongly penalized.
3. **`color_match` (2.97%):** Ensures accurate color family harmony.
4. **`style_match` (1.79%):** Reinforces high-level aesthetic vibe matching (Traditional, Streetwear, Western, Professional).
5. **`body_shape_compatibility` (1.25%):** Ensures proportion-flattering cuts for the user's specific silhouette.

---

## 13. Hybrid Ranking Formula

The final candidate ranking score is computed via a multi-objective hybrid fusion formula configured in [`app/core/config.py`](backend/app/core/config.py):

$$\text{Final Hybrid Score} = (0.35 \times S_{\text{RAG}}) + (0.35 \times S_{\text{ML}}) + (0.15 \times S_{\text{Preference}}) + (0.10 \times S_{\text{BodyShape}}) + (0.05 \times S_{\text{Novelty}})$$

Where:
* $S_{\text{RAG}} \in [0.0, 1.0]$: Dense semantic cosine similarity from ChromaDB vector retrieval.
* $S_{\text{ML}} \in [0.0, 1.0]$: Non-linear multi-factor compatibility score predicted by the `RandomForestRegressor`.
* $S_{\text{Preference}} \in [0.0, 1.0]$: Direct heuristic rule match across selected styles, occasions, and color palettes.
* $S_{\text{BodyShape}} \in [0.0, 1.0]$: Silhouette harmony matrix score matching the user's body shape (Hourglass, Pear, Rectangle, Apple, Inverted Triangle) against the outfit cut.
* $S_{\text{Novelty}} \in [0.0, 1.0]$: Recency decay penalty ensuring freshly surfaced items rank higher than previously shown looks.

---

## 14. Exact Outfit-Type Taxonomy Engine

To prevent cross-category drift and ensure 100% exact outfit-type compliance, [`backend/app/services/taxonomy.py`](backend/app/services/taxonomy.py) enforces canonical normalization and pre-scoring candidate filtering.

### Supported Taxonomy by Category

| Category | UI / Request Identifier | Canonical Outfit Type | Example Look in Catalog |
| :--- | :--- | :--- | :--- |
| **Traditional** | `lehenga_choli` | `lehenga choli` | Royal Crimson Embroidered Silk Lehenga Choli |
| **Traditional** | `sharara` | `sharara` | Festive Mustard Georgette Tiered Sharara Set |
| **Traditional** | `long_dress` | `long dress` (Ethnic Gown / Anarkali) | Majestic Maroon Embroidered Raw Silk Ethnic Long Dress |
| **Traditional** | `saree` | `saree` | Emerald Kanjivaram Silk Saree |
| **Western** | `jumpsuit` | `jumpsuit` | Architectural Black Crepe Belted Jumpsuit |
| **Western** | `co_ords` | `co-ords` | Tailored Taupe Linen Vest & Bermuda Shorts Co-ords |
| **Western** | `coord_set` | `co-ord set` | Champagne Pleated Satin Blouse & Wide-Leg Pants Co-ord Set |
| **Western** | `wrap_dress` | `wrap dress` | Terracotta Silk Wrap Dress |
| **Streetwear** | `oversized_hoodie_pants` | `oversized hoodie + pants` | Graphite Oversized Hoodie & Relaxed Cargo Pants |
| **Streetwear** | `graphic_layered` | `graphic layered` | Monochrome Graphic Print Tee & Utility Mesh Vest Ensemble |
| **Streetwear** | `cargo_sweatshirt` | `cargo + sweatshirt` | Sage Green Mineral-Wash Crewneck & Parachute Cargos |
| **Professional** | `blazer_outfit` | `blazer outfit` | Executive Tailored Navy Blazer & Wide-Leg Trousers |
| **Professional** | `blouse_pencil_pant` | `blouse + pencil-cut pant` | French Blue Crisp Collar Blouse & Charcoal Pencil-Cut Pant |

---

## 15. Diversity & Novelty Handling

To prevent visual monotony and ensure rich ensemble variety:
1. **Ensemble Diversity Metric:** Evaluates the pairwise diversity of the top-3 recommendations across three orthogonal attributes:
   $$\text{Diversity Score} = 0.40 \times \left(\frac{U_{\text{silhouettes}}}{N}\right) + 0.35 \times \left(\frac{U_{\text{colors}}}{N}\right) + 0.25 \times \left(\frac{U_{\text{fabrics}}}{N}\right)$$
   Where $U$ represents the count of unique attributes among $N$ recommended outfits.
2. **Session Pagination & Novelty:** The frontend passes `recentlyShown` candidate IDs during session exploration, causing the backend novelty function to apply a smooth decay factor:
   $$S_{\text{Novelty}}(id) = \max(0.10, 1.0 - (0.35 \times \text{seen\_count}))$$

---

## 16. LLM Explanation Layer

The platform includes an editorial explanation module ([`backend/app/services/llm_service.py`](backend/app/services/llm_service.py)):
* **Role Clarification:** *The LLM service functions strictly as a natural language generation and explanation layer; it is NOT the core compatibility scoring engine.*
* **Deterministic Fallback Generator:** In environments without an active external LLM API key, a rule-based deterministic styling generator synthesizes natural language styling rationales.
* **Generated Content:**
  * **Styling Advice:** Why the specific cut flatters the user's selected silhouette.
  * **Color Rationale:** How the outfit's palette complements the selected occasion.
  * **Footwear & Accessory Suggestions:** Precise tips on finishing the ensemble.

---

## 17. API Endpoints

FastAPI provides an interactive OpenAPI / Swagger documentation interface at `http://localhost:8000/api/docs`.

| Method | Endpoint | Description | Request Body / Parameters |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Root API metadata and system status | None |
| `GET` | `/api/health` | Service health check and loaded model status | None |
| `POST` | `/api/recommendations` | **Primary curation endpoint**: Returns top tailored outfits | `{"preferences": {...}, "recentlyShown": [], "count": 3, "seedOffset": 0}` |
| `POST` | `/api/rag/search` | Direct RAG semantic search over the fashion catalog | `{"query": "string", "top_k": 5}` |
| `GET` | `/api/rag/status` | ChromaDB collection statistics and document counts | None |
| `GET` | `/api/docs` | Interactive Swagger UI API documentation | None |
| `GET` | `/api/openapi.json` | OpenAPI 3.0 specification schema | None |

---

## 18. Testing & Evaluation

The recommendation engine was evaluated using [`backend/evaluate_recommender.py`](backend/evaluate_recommender.py) across all 4 major fashion categories:

### Performance Evaluation Summary

| Metric | Measured Value | Benchmark / Goal | Status |
| :--- | :---: | :---: | :---: |
| **Exact Outfit-Type Compliance** | **`100.00%`** | `100.0%` (Zero cross-format leakage) | **PASS** |
| **Category Compliance** | **`100.00%`** | `100.0%` (Zero category leakage) | **PASS** |
| **Average RAG Similarity Score** | **`0.6480`** | `> 0.5000` (Strong semantic alignment) | **PASS** |
| **Average ML Compatibility Score** | **`0.7625`** | `> 0.6500` (High silhouette harmony) | **PASS** |
| **Average Hybrid Score** | **`0.7497`** | `> 0.6500` (Consistent high confidence) | **PASS** |
| **Top-3 Average Diversity Score** | **`0.9697`** | `> 0.7500` (Varied textures & colors) | **PASS** |
| **Mock Fallback Usage** | **`0.00%`** (0/11) | `0.0%` (Pure Backend AI execution) | **PASS** |

### Automated Test Scripts
* **`backend/test_taxonomy_categories.py`:** Tests exact outfit-type constraints across Traditional, Western, Streetwear, and Professional categories.
* **`backend/test_full_path_qa.py`:** Traces end-to-end request payloads from React state simulation through backend taxonomy, RAG, ML, and response validation.
* **`backend/generate_ml_explainability_report.py`:** Extracts and ranks all 14 random forest feature importances.

---

## 19. Real Browser End-to-End Verification

The complete user workflow was verified through automated end-to-end browser execution:

```
[User UI Selection]
  ├── Selects "Hourglass" silhouette on Step 1
  ├── Selects "Traditional" vibe on Step 2
  ├── Selects "Lehenga Choli" format on Step 3
  ├── Selects "Crimson / Rich Jewel" on Step 4
  ├── Selects "Tailored / Balanced" on Step 5
  └── Clicks "Generate My Style"
         │
         ▼
[React AppContext]
  ├── Cleans preferences & sets outfitTypes: ['lehenga_choli']
  └── Invokes api.js fetchRecommendations() with recentlyShown: []
         │
         ▼
[FastAPI Backend /api/recommendations]
  ├── taxonomy.py resolves allowed types: {'lehenga choli'}
  ├── Pre-filters 39 catalog items down to 2 eligible candidates
  ├── RAG computes cosine similarity (look_t01: 0.8014, look_t02: 0.7552)
  ├── RandomForest ML scores compatibility (look_t01: 0.9182, look_t02: 0.8537)
  ├── Hybrid reranker fuses scores (look_t01: 0.8773, look_t02: 0.8283)
  └── Returns 2 curated looks in JSON format
         │
         ▼
[Recommendations.jsx UI]
  ├── Renders Royal Crimson Silk Lehenga & Blush Floral Organza Lehenga
  ├── Displays exact 95% and 91% preference match badges
  └── 0% mock fallback used; pure AI pipeline response displayed
```

---

## 20. Project Directory Structure

```
Chic-Genie/
├── README.md                               # Project documentation
├── package.json                            # Frontend npm scripts & dependencies
├── vite.config.js                          # Vite build & proxy configuration
├── index.html                              # Web app HTML5 entry point
│
├── src/                                    # React Frontend Application
│   ├── main.jsx                            # React root rendering
│   ├── App.jsx                             # Top-level routing & layout
│   ├── index.css                           # Global design system & theme variables
│   │
│   ├── context/
│   │   └── AppContext.jsx                  # Centralized state management store
│   │
│   ├── pages/
│   │   ├── Home.jsx                        # Landing page & preset discovery
│   │   ├── PreferencesWizard.jsx           # 6-step personalized styling wizard
│   │   ├── Recommendations.jsx             # Curated looks showroom & breakdown
│   │   ├── StylistChat.jsx                 # Conversational AI stylist chat
│   │   └── Profile.jsx                     # User silhouette profile & saved wardrobe
│   │
│   ├── components/
│   │   ├── Navbar.jsx                      # Navigation header & reset action
│   │   ├── Footer.jsx                      # Footer component
│   │   └── OutfitCard.jsx                  # Modular outfit display card
│   │
│   ├── data/
│   │   ├── mockOutfits.js                  # Fallback outfit definitions
│   │   ├── preferenceOptions.js            # Wizard options & canonical taxonomy
│   │   └── aiStylistPrompts.js             # Conversational stylist system prompts
│   │
│   └── services/
│       └── api.js                          # REST client for FastAPI backend
│
└── backend/                                # FastAPI Recommendation Backend
    ├── requirements.txt                    # Python dependencies
    ├── evaluate_recommender.py             # Recommendation evaluation script
    ├── generate_ml_explainability_report.py# Feature importance extractor
    ├── ml_feature_importance_report.json   # Verified ML feature importance data
    ├── test_taxonomy_categories.py         # Category constraint test suite
    ├── test_full_path_qa.py                # End-to-end simulation test suite
    │
    └── app/
        ├── main.py                         # FastAPI server & route registration
        │
        ├── api/
        │   ├── health.py                   # GET /api/health
        │   ├── recommendations.py          # POST /api/recommendations
        │   └── rag.py                      # POST /api/rag/search & status
        │
        ├── core/
        │   └── config.py                   # Centralized configuration & weights
        │
        ├── models/
        │   ├── preferences.py              # Pydantic input validation models
        │   └── outfit.py                   # Pydantic outfit response models
        │
        ├── services/
        │   ├── taxonomy.py                 # Exact outfit-type taxonomy engine
        │   ├── rag_service.py              # Vector search & candidate retrieval
        │   ├── embedding_service.py        # SentenceTransformer wrapper
        │   ├── vector_store.py             # ChromaDB client manager
        │   ├── recommendation_engine.py    # Hybrid scoring & recommendation orchestrator
        │   ├── hybrid_reranker.py          # Multi-objective reranking utility
        │   ├── compatibility.py            # Silhouette & body shape harmony rules
        │   ├── novelty.py                  # Diversity & recency decay calculations
        │   └── llm_service.py              # Editorial explanation synthesizer
        │
        ├── ml/
        │   ├── feature_engineering.py      # 14-feature transformation pipeline
        │   ├── predictor.py                # RandomForest inference wrapper
        │   ├── train_model.py              # Synthetic dataset generation & model training
        │   └── model/
        │       ├── outfit_compatibility_rf.joblib  # Trained model weights
        │       └── metadata.json                   # Verified model metrics (R², MAE, RMSE)
        │
        └── data/
            ├── fashion_catalog.json        # 39 curated fashion catalog ensembles
            └── chroma_db/                  # Persistent ChromaDB vector index files
```

---

## 21. Setup and Run Instructions

### Prerequisites
* **Node.js:** v18.0.0 or higher
* **Python:** v3.10 or higher
* **Git:** Installed on local machine

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/akhilakarri27/Chic-Genie.git
cd Chic-Genie
```

---

### Step 2: Backend Setup & Launch

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. Create and activate a Python virtual environment:
   ```bash
   # On Windows:
   python -m venv venv
   .\venv\Scripts\activate

   # On macOS/Linux:
   python3 -m venv venv
   source venv/bin/activate
   ```

3. Install required Python packages:
   ```bash
   pip install -r requirements.txt
   ```

4. Start the FastAPI server:
   ```bash
   python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
   ```
   *The backend will initialize ChromaDB, load `all-MiniLM-L6-v2`, and serve API endpoints at `http://127.0.0.1:8000`.*

---

### Step 3: Frontend Setup & Launch

1. Open a new terminal and navigate to the project root:
   ```bash
   cd "c:\Users\sridh\OneDrive\Chic Genei"
   ```

2. Install Node.js dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The web application will launch locally at `http://localhost:5173`.*

---

### Step 4: Running Test & Evaluation Suites

To run the automated verification and evaluation scripts:

```bash
cd backend

# 1. Run exact category taxonomy compliance test
python test_taxonomy_categories.py

# 2. Run end-to-end full path QA test
python test_full_path_qa.py

# 3. Run comprehensive recommendation evaluation report
python evaluate_recommender.py

# 4. Generate ML explainability feature importance report
python generate_ml_explainability_report.py
```

---

## 22. System Limitations

1. **Catalog Volume:** The active catalog currently contains 39 curated looks. While sufficient for demonstration across all 4 major style categories, large-scale commercial deployments require thousands of catalog items.
2. **Weakly-Supervised ML Ground Truth:** The machine learning dataset ($8,580$ samples) is synthesized from domain-specific fashion rules rather than real-world user clickstream or purchase data.
3. **Local Embedding Latency:** The SentenceTransformer model (`all-MiniLM-L6-v2`) runs locally on CPU, resulting in a 200–400ms inference overhead per batch query during cold starts.
4. **Static Imagery:** Outfits utilize static curated editorial photography rather than real-time dynamic 3D clothing rendering.

---

## 23. Future Enhancements

1. **Human-in-the-Loop Active Learning:** Incorporate real user interaction logs (saves, skips, wishlist additions) to transition the RandomForest model into an online reinforcement learning / contextual bandit recommender.
2. **Multimodal Visual Retrieval (CLIP):** Integrate visual embeddings using OpenAI CLIP to enable image-based search ("Find outfits with a similar drape to this photo").
3. **Virtual Try-On Diffusion Models:** Connect AI diffusion pipelines (e.g., IDM-VTON) to render photo-realistic virtual try-ons directly onto user avatars.
4. **Weather & Geolocation Integration:** Automatically fetch local climate conditions via weather APIs to dynamically pre-filter seasonal fabrics.

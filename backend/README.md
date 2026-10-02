# Chic Genie — Fashion Intelligence Backend

FastAPI-powered recommendation engine and fashion intelligence service for **Chic Genie**.

---

## 🚀 Quick Start

### 1. Navigate to backend directory
```bash
cd backend
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Run FastAPI Server
```bash
uvicorn app.main:app --reload --port 8000
```

---

## 📡 API Endpoints

- **Root & Metadata:** `GET http://localhost:8000/`
- **Swagger Documentation:** `GET http://localhost:8000/api/docs`
- **OpenAPI Schema:** `GET http://localhost:8000/api/openapi.json`
- **Health Check:** `GET http://localhost:8000/api/health`
- **Curated Recommendations:** `POST http://localhost:8000/api/recommendations`

---

## 🏗️ Architecture & Services

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                     # FastAPI application entry & CORS middleware
│   │
│   ├── api/
│   │   ├── __init__.py
│   │   ├── health.py               # GET /api/health
│   │   └── recommendations.py      # POST /api/recommendations
│   │
│   ├── models/
│   │   ├── __init__.py
│   │   ├── preferences.py          # Flexible Pydantic preference inputs
│   │   └── outfit.py               # Complete styled look & response schemas
│   │
│   ├── services/
│   │   ├── __init__.py
│   │   ├── recommendation_engine.py# Multi-factor scoring engine
│   │   ├── compatibility.py        # Silhouette & body shape styling harmony
│   │   └── novelty.py              # Non-repetition & diversity selection
│   │
│   ├── data/
│   │   ├── __init__.py
│   │   └── fashion_catalog.json    # Comprehensive fashion catalog
│   │
│   └── core/
│       ├── __init__.py
│       └── config.py               # Centralized settings & scoring weights
│
├── requirements.txt
├── .env.example
├── .gitignore
└── README.md
```

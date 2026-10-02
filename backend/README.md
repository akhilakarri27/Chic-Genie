# Chic Genie - Backend API

FastAPI backend service for the Chic Genie fashion and style recommendation application.

## Tech Stack
- **Python**: 3.11+
- **Framework**: FastAPI
- **Server**: Uvicorn
- **Validation**: Pydantic
- **Environment Management**: python-dotenv

## Project Structure
```text
backend/
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── api/
│   │   ├── __init__.py
│   │   ├── health.py
│   │   └── recommendations.py
│   ├── core/
│   │   ├── __init__.py
│   │   └── config.py
│   ├── data/
│   │   ├── __init__.py
│   │   └── fashion_catalog.py
│   ├── models/
│   │   ├── __init__.py
│   │   └── preferences.py
│   └── services/
│       ├── __init__.py
│       └── recommendation_engine.py
├── requirements.txt
├── .env.example
└── README.md
```

## Setup & Installation

### 1. Create and activate a virtual environment
```bash
# Windows (PowerShell)
python -m venv .venv
.venv\Scripts\Activate.ps1

# Linux / macOS
python3 -m venv .venv
source .venv/bin/activate
```

### 2. Install dependencies
```bash
pip install -r requirements.txt
```

### 3. Environment Variables
Create a `.env` file from the `.env.example` template:
```bash
cp .env.example .env
```

### 4. Run the Development Server
```bash
uvicorn app.main:app --reload --port 8000
```

## API Endpoints

### 1. Health Check
- `GET /api/health`
  ```json
  {
    "status": "online",
    "service": "Chic Genie Backend"
  }
  ```

### 2. Style Recommendations
- `POST /api/recommendations`
  - **Request Body**:
    ```json
    {
      "preferences": {
        "bodyShape": "hourglass",
        "styles": ["cute", "casual_vibe"],
        "occasions": ["college"],
        "colors": ["pink", "blue"],
        "outfitType": "jeans_top",
        "weather": "warm",
        "comfort": "comfort_first",
        "footwear": "sneakers",
        "accessories": ["minimal", "handbag"],
        "avoid": ["nothing_to_avoid"]
      },
      "count": 3,
      "seedOffset": 0,
      "recentlyShown": []
    }
    ```
  - **Response**:
    ```json
    {
      "status": "success",
      "count": 3,
      "recommendations": [
        {
          "id": "outfit-003-denim-poplin-blush",
          "name": "Blush Poplin Peplum Top & Straight Vintage Denim",
          "category": "Western",
          "subCategory": "Separates",
          "style": "Cute & Playful",
          "styles": ["cute", "casual_vibe", "feminine"],
          "occasion": "casual",
          "occasions": ["casual", "college", "coffee"],
          "weather": ["warm", "pleasant"],
          "season": "Spring",
          "outfitType": "jeans_top",
          "top": "Blush pink tiered peplum cotton poplin blouse with tie sleeves",
          "bottom": "High-rise straight-leg vintage washed blue denim jeans",
          "color": "pink",
          "footwear": "Rose gold ballet flats with bow detail",
          "bag": "Blush pink quilted camera crossbody bag",
          "jewellery": "Rose quartz stud earrings and delicate chain bracelet",
          "accessories": "Pastel pink claw clip",
          "avatarUrl": "/avatars/casual_chic.jpg",
          "tags": ["Cute Peplum", "Straight Denim", "Blush Pink", "Weekend Brunch"],
          "preferenceMatch": 96,
          "explanation": "Curated by Chic Genie tailored for Hourglass silhouette for college with balanced aesthetic harmony."
        }
      ]
    }
    ```

- Interactive Swagger Docs: [http://localhost:8000/api/docs](http://localhost:8000/api/docs)

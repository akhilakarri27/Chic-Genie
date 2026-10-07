"""LLM Explanation Service for Chic Genie.

Generates grounded, personalized styling rationale and actionable styling tips
for top-ranked curated outfits based on user preferences and outfit metadata.
Supports Gemini, OpenAI, Ollama, and safe deterministic fallback generators.
"""

import json
import logging
import re
from typing import List, Dict, Any, Optional, Tuple, Union

import httpx

from app.core.config import settings
from app.models.preferences import PreferencesInput
from app.models.outfit import Outfit

logger = logging.getLogger("chic_genie.llm_service")
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")


class LLMExplanationService:
    """
    Editorial styling explanation service.
    Synthesizes grounded styling rationale and styling tips strictly from
    supplied outfit metadata and user styling coordinates.
    """

    def __init__(self):
        self.provider = settings.LLM_PROVIDER.lower()
        self.model_name = settings.LLM_MODEL_NAME
        self.timeout = settings.LLM_TIMEOUT_SECONDS
        self._detect_active_provider()

    def _detect_active_provider(self):
        """Auto-detects available LLM provider based on configured environment variables."""
        if not settings.LLM_ENABLED:
            self.active_provider = "fallback"
            logger.info("LLM generation is disabled in settings. Using deterministic styling generator.")
            return

        if self.provider == "gemini" or (self.provider == "auto" and settings.GEMINI_API_KEY):
            if settings.GEMINI_API_KEY:
                self.active_provider = "gemini"
                logger.info("Active LLM provider: Google Gemini (model: %s)", self.model_name)
                return

        if self.provider == "openai" or (self.provider == "auto" and settings.OPENAI_API_KEY):
            if settings.OPENAI_API_KEY:
                self.active_provider = "openai"
                logger.info("Active LLM provider: OpenAI (model: %s)", self.model_name)
                return

        if self.provider == "ollama":
            self.active_provider = "ollama"
            logger.info("Active LLM provider: Local Ollama (%s)", settings.OLLAMA_API_BASE)
            return

        self.active_provider = "fallback"
        logger.info("No active external LLM API key detected. Using high-precision deterministic styling generator.")

    def _to_list(self, val: Any) -> List[str]:
        """Converts strings or lists to clean lowercase string lists."""
        if not val:
            return []
        if isinstance(val, str):
            return [v.strip() for v in val.split(",") if v.strip()]
        if isinstance(val, list):
            return [str(v).strip() for v in val if v]
        return [str(val).strip()]

    def generate_deterministic_explanation(
        self,
        outfit_dict: Dict[str, Any],
        prefs: PreferencesInput
    ) -> Tuple[str, str]:
        """
        Synthesizes a rich, grammatically polished, and grounded explanation
        and styling tip deterministically without requiring external API calls.
        """
        # User details
        shape = prefs.bodyShape.capitalize() if prefs.bodyShape else "your"
        styles = self._to_list(prefs.styles)
        style_text = ", ".join(styles) if styles else "curated"
        occasions = self._to_list(prefs.occasions)
        if prefs.occasion:
            occasions.append(prefs.occasion)
        occasion_text = ", ".join(occasions) if occasions else "your selected occasion"

        # Outfit details
        color = str(outfit_dict.get("color") or "").replace("_", " ").title()
        outfit_type = str(outfit_dict.get("outfitType") or "ensemble")
        silhouette = str(outfit_dict.get("silhouette") or "balanced proportion")
        fabric = str(outfit_dict.get("fabric") or "")
        waist = str(outfit_dict.get("waistDefinition") or "")
        footwear = str(outfit_dict.get("footwear") or "").lower()
        jewellery = str(outfit_dict.get("jewellery") or "").lower()
        accessories = str(outfit_dict.get("accessories") or "").lower()

        # Build grounded rationale
        parts: List[str] = []

        # 1. Color and Occasion alignment
        if fabric:
            parts.append(f"Chic Genie curated this {color} {outfit_type} in {fabric} for {occasion_text}")
        else:
            parts.append(f"Chic Genie curated this {color} {outfit_type} for {occasion_text}")

        # 2. Silhouette & Body Shape Harmony
        if prefs.bodyShape:
            if waist:
                parts.append(f"framing your {shape} silhouette with a {waist} waistline for balanced proportion")
            else:
                parts.append(f"designed with a {silhouette} silhouette to complement your {shape} frame")
        else:
            parts.append(f"tailored in a {silhouette} silhouette")

        # 3. Aesthetics & Finishing Accents
        acc_details = []
        if footwear:
            acc_details.append(footwear)
        if jewellery:
            acc_details.append(jewellery)
        
        if acc_details:
            parts.append(f"and pairing with {', '.join(acc_details[:2])} for a refined {style_text} aesthetic.")
        else:
            parts.append(f"channeling a refined {style_text} aesthetic.")

        explanation = ", ".join(parts[:-1]) + " " + parts[-1] if len(parts) > 1 else parts[0] + "."

        # Build grounded styling tip
        if jewellery and footwear:
            styling_tip = f"Elevate this look by balancing {jewellery} with clean {footwear}."
        elif footwear:
            styling_tip = f"Complete the silhouette with {footwear} for effortless proportion."
        elif accessories:
            styling_tip = f"Finish the styling with {accessories} to polish the ensemble."
        else:
            styling_tip = f"Keep accessories refined to let the {color} palette take center stage."

        return explanation, styling_tip

    def _build_prompt(self, outfit_dict: Dict[str, Any], prefs: PreferencesInput) -> Dict[str, str]:
        """Builds strict system and user prompt for grounded explanation generation."""
        system_prompt = (
            "You are Chic Genie's Senior Editorial Fashion Stylist. "
            "Your task is to generate a concise, personalized styling explanation and one styling tip "
            "for a curated fashion look. "
            "\nSTRICT GROUNDING RULES:\n"
            "1. Ground your explanation EXCLUSIVELY in the provided outfit metadata, user preferences, and styling scores.\n"
            "2. NEVER hallucinate or invent brand names, prices, purchasing links, or garments not present in the metadata.\n"
            "3. Address the specific occasion, body shape silhouette harmony, color palette, and provided accessories.\n"
            "4. Return strictly a valid JSON object with exactly two keys: 'explanation' and 'stylingTip'.\n"
            "   - 'explanation': 2-3 sentence personalized styling rationale for the Chic Genie look card (max 45 words).\n"
            "   - 'stylingTip': 1 actionable styling tip focusing on the provided accessories/footwear/drape (max 18 words)."
        )

        user_prompt = f"""USER STYLING PREFERENCES:
- Body Shape: {prefs.bodyShape or 'universal'}
- Preferred Styles: {prefs.styles}
- Target Occasion: {prefs.occasions or prefs.occasion}
- Colors & Palette: {prefs.colors} ({prefs.palette or 'balanced'})
- Weather & Season: {prefs.weather} ({prefs.season or 'All season'})
- Fit & Comfort: {prefs.preferredFit or prefs.fit} ({prefs.comfort})
- Preferred Footwear: {prefs.footwear}
- Preferred Jewellery: {prefs.jewellery}

CURATED OUTFIT METADATA:
- ID: {outfit_dict.get('id')}
- Title: {outfit_dict.get('name')}
- Category: {outfit_dict.get('category')} ({outfit_dict.get('subCategory')})
- Outfit Type: {outfit_dict.get('outfitType')} | Silhouette: {outfit_dict.get('silhouette')}
- Garments: Top: {outfit_dict.get('top')}, Bottom: {outfit_dict.get('bottom')}, Dress: {outfit_dict.get('dress')}, Saree: {outfit_dict.get('saree')}, Layer: {outfit_dict.get('layer')}
- Color & Palette: {outfit_dict.get('color')} ({outfit_dict.get('palette')} palette, mood: {outfit_dict.get('colorMood')})
- Fabric & Pattern: {outfit_dict.get('fabric')} with {outfit_dict.get('pattern')} pattern | Fit: {outfit_dict.get('fit')}
- Waist & Neckline: Waist: {outfit_dict.get('waistDefinition')} | Neckline: {outfit_dict.get('neckline')}
- Footwear: {outfit_dict.get('footwear')}
- Jewellery & Accents: {outfit_dict.get('jewellery')} | Bag: {outfit_dict.get('bag')} | Accessories: {outfit_dict.get('accessories')}
- Preference Match: {outfit_dict.get('preferenceMatch', 95)}% | RAG Score: {outfit_dict.get('ragScore')} | ML Score: {outfit_dict.get('mlCompatibilityScore')}

Generate the JSON response:"""

        return {"system": system_prompt, "user": user_prompt}

    async def _call_gemini_api(self, prompt: Dict[str, str]) -> Tuple[str, str]:
        """Calls Google Gemini REST API."""
        api_key = settings.GEMINI_API_KEY
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{self.model_name}:generateContent?key={api_key}"
        
        payload = {
            "contents": [
                {
                    "parts": [
                        {"text": prompt["system"] + "\n\n" + prompt["user"]}
                    ]
                }
            ],
            "generationConfig": {
                "temperature": 0.3,
                "maxOutputTokens": 200,
                "responseMimeType": "application/json"
            }
        }

        async with httpx.AsyncClient(timeout=self.timeout) as client:
            resp = await client.post(url, json=payload)
            resp.raise_for_status()
            data = resp.json()
            text = data["candidates"][0]["content"]["parts"][0]["text"]
            parsed = json.loads(text)
            return parsed.get("explanation", ""), parsed.get("stylingTip", "")

    async def _call_openai_api(self, prompt: Dict[str, str]) -> Tuple[str, str]:
        """Calls OpenAI / OpenAI-compatible API."""
        url = f"{settings.OPENAI_API_BASE.rstrip('/')}/chat/completions"
        headers = {
            "Authorization": f"Bearer {settings.OPENAI_API_KEY}",
            "Content-Type": "application/json"
        }
        payload = {
            "model": self.model_name if "gpt" in self.model_name else "gpt-4o-mini",
            "messages": [
                {"role": "system", "content": prompt["system"]},
                {"role": "user", "content": prompt["user"]}
            ],
            "temperature": 0.3,
            "max_tokens": 200,
            "response_format": {"type": "json_object"}
        }

        async with httpx.AsyncClient(timeout=self.timeout) as client:
            resp = await client.post(url, headers=headers, json=payload)
            resp.raise_for_status()
            data = resp.json()
            content = data["choices"][0]["message"]["content"]
            parsed = json.loads(content)
            return parsed.get("explanation", ""), parsed.get("stylingTip", "")

    async def _generate_single_outfit_explanation(
        self,
        outfit_dict: Dict[str, Any],
        prefs: PreferencesInput
    ) -> Tuple[str, str, bool]:
        """
        Attempts LLM explanation generation with automatic fallback on failure.
        Returns (explanation, stylingTip, aiGenerated).
        """
        if self.active_provider == "fallback":
            exp, tip = self.generate_deterministic_explanation(outfit_dict, prefs)
            return exp, tip, False

        prompt = self._build_prompt(outfit_dict, prefs)

        try:
            if self.active_provider == "gemini":
                exp, tip = await self._call_gemini_api(prompt)
            elif self.active_provider == "openai":
                exp, tip = await self._call_openai_api(prompt)
            else:
                exp, tip = self.generate_deterministic_explanation(outfit_dict, prefs)
                return exp, tip, False

            if exp and tip:
                return exp.strip(), tip.strip(), True
        except Exception as e:
            logger.warning(
                "LLM call to %s failed (%s). Using deterministic styling generator.",
                self.active_provider,
                e
            )

        # Fallback
        exp, tip = self.generate_deterministic_explanation(outfit_dict, prefs)
        return exp, tip, False

    async def enrich_outfits_with_explanations(
        self,
        outfits: List[Outfit],
        prefs: PreferencesInput
    ) -> List[Outfit]:
        """
        Enriches a list of curated outfits with personalized explanations and styling tips.
        Guarantees that every outfit receives high-quality styling guidance.
        """
        if not outfits:
            return []

        enriched: List[Outfit] = []
        for outfit in outfits:
            outfit_dict = outfit.model_dump()
            exp, tip, is_ai = await self._generate_single_outfit_explanation(outfit_dict, prefs)

            # Update explanation and stylingTip
            outfit.explanation = exp
            outfit.stylingTip = tip
            outfit.aiGenerated = is_ai
            enriched.append(outfit)

        logger.info(
            "Enriched %d outfits with styling explanations (provider: %s, aiGenerated: %s)",
            len(enriched),
            self.active_provider,
            any(o.aiGenerated for o in enriched)
        )
        return enriched


# Global singleton instance
llm_service = LLMExplanationService()

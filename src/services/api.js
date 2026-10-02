/**
 * Chic Genie API Service
 * Handles seamless communication with the FastAPI backend.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * Fetch personalized styling recommendations from FastAPI backend
 * 
 * @param {Object} preferences - User styling coordinates
 * @param {number} count - Number of outfits to curate (default 3)
 * @param {number} seedOffset - Offset for non-repetition generation
 * @param {Array<string>} recentlyShown - IDs of recently viewed outfits
 * @returns {Promise<Array<Object>>} - Array of complete outfit recommendations
 */
export async function fetchRecommendations(preferences = {}, count = 3, seedOffset = 0, recentlyShown = []) {
  const payload = {
    preferences: {
      bodyShape: preferences.bodyShape || '',
      styles: preferences.styles || [],
      occasions: preferences.occasions || (preferences.occasion ? [preferences.occasion] : []),
      occasion: preferences.occasion || null,
      colors: preferences.colors || [],
      colorMoods: preferences.colorMoods || (preferences.palette ? [preferences.palette] : []),
      palette: preferences.palette || null,
      outfitTypes: preferences.outfitTypes || (preferences.outfitType ? [preferences.outfitType] : []),
      outfitType: preferences.outfitType || null,
      footwear: preferences.footwear || null,
      accessories: preferences.accessories || [],
      jewellery: preferences.jewellery || null,
      comfort: preferences.comfort || null,
      season: preferences.season || null,
      weather: preferences.weather || null,
      preferredFit: preferences.preferredFit || preferences.fit || null,
      fit: preferences.fit || null,
      avoidedStyles: preferences.avoidedStyles || [],
      avoidedColors: preferences.avoidedColors || [],
      avoid: preferences.avoid || []
    },
    count,
    seedOffset,
    recentlyShown
  };

  try {
    const response = await fetch(`${API_BASE_URL}/recommendations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.recommendations || [];
  } catch (error) {
    console.error('Backend connection error:', error);
    throw new Error('Chic Genie styling engine is temporarily unavailable. Please try again.');
  }
}

/**
 * Check backend health status
 */
export async function checkBackendHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (!response.ok) return { status: 'offline' };
    return await response.json();
  } catch (error) {
    return { status: 'offline', error: error.message };
  }
}

/**
 * Chic Genie API Service
 * Handles seamless communication with the FastAPI backend.
 */

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000').replace(/\/$/, '');

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
      styles: Array.isArray(preferences.styles) ? preferences.styles : (preferences.styles ? [preferences.styles] : []),
      occasions: Array.isArray(preferences.occasions) ? preferences.occasions : (preferences.occasion ? [preferences.occasion] : []),
      colors: Array.isArray(preferences.colors) ? preferences.colors : (preferences.colors ? [preferences.colors] : []),
      colorMoods: Array.isArray(preferences.colorMoods) ? preferences.colorMoods : (preferences.palette ? [preferences.palette] : []),
      outfitTypes: Array.isArray(preferences.outfitTypes) ? preferences.outfitTypes : (preferences.outfitType ? [preferences.outfitType] : []),
      footwear: Array.isArray(preferences.footwear) ? preferences.footwear : (preferences.footwear ? [preferences.footwear] : []),
      accessories: Array.isArray(preferences.accessories) ? preferences.accessories : (preferences.accessories ? [preferences.accessories] : []),
      jewellery: Array.isArray(preferences.jewellery) ? preferences.jewellery : (preferences.jewellery ? [preferences.jewellery] : []),
      comfort: Array.isArray(preferences.comfort) ? preferences.comfort : (preferences.comfort ? [preferences.comfort] : []),
      season: Array.isArray(preferences.season) ? preferences.season : (preferences.season ? [preferences.season] : []),
      weather: Array.isArray(preferences.weather) ? preferences.weather : (preferences.weather ? [preferences.weather] : []),
      preferredFit: Array.isArray(preferences.preferredFit) ? preferences.preferredFit : (preferences.fit ? [preferences.fit] : []),
      avoidedStyles: Array.isArray(preferences.avoidedStyles) ? preferences.avoidedStyles : [],
      avoidedColors: Array.isArray(preferences.avoidedColors) ? preferences.avoidedColors : []
    },
    recentlyShown: Array.isArray(recentlyShown) ? recentlyShown : [],
    count,
    seedOffset
  };

  try {
    const response = await fetch(`${API_BASE_URL}/api/recommendations`, {
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
    const response = await fetch(`${API_BASE_URL}/api/health`);
    if (!response.ok) return { status: 'offline' };
    return await response.json();
  } catch (error) {
    return { status: 'offline', error: error.message };
  }
}


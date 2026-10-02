import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_OUTFITS, getRecommendedOutfits } from '../data/mockOutfits';
import { fetchRecommendations } from '../services/api';

const AppContext = createContext(null);

const DEFAULT_PREFERENCES = {
  bodyShape: '',
  occasion: 'college',
  styles: ['cute', 'casual_vibe'],
  weather: 'warm',
  outfitType: 'jeans_top',
  colors: ['pink', 'blue', 'pastel'],
  palette: 'soft_pastel',
  fit: 'relaxed',
  comfort: 'comfort_first',
  footwear: 'sneakers',
  accessories: ['minimal', 'handbag'],
  avoid: ['nothing_to_avoid']
};

export function AppProvider({ children }) {
  // Navigation: 'opening', 'bodyshape', 'home', 'preferences', 'recommendations', 'saved', 'style', 'stylist', 'profile', 'customize'
  const [currentRoute, setCurrentRoute] = useState('opening');
  
  // Body shape state persisted to localStorage
  const [bodyShape, setBodyShapeState] = useState(() => {
    try {
      return localStorage.getItem('chic_genie_body_shape') || '';
    } catch (e) {
      return '';
    }
  });

  const [preferences, setPreferences] = useState(() => {
    let savedShape = '';
    try {
      savedShape = localStorage.getItem('chic_genie_body_shape') || '';
    } catch (e) {}
    return { ...DEFAULT_PREFERENCES, bodyShape: savedShape };
  });

  const [recommendations, setRecommendations] = useState(() => getRecommendedOutfits(DEFAULT_PREFERENCES, 3, 0));
  const [seedOffset, setSeedOffset] = useState(0);

  const setBodyShape = async (shape) => {
    setBodyShapeState(shape);
    try {
      localStorage.setItem('chic_genie_body_shape', shape);
    } catch (e) {
      console.warn('Failed to save body shape', e);
    }
    const updatedPrefs = { ...preferences, bodyShape: shape };
    setPreferences(updatedPrefs);
    
    // Fetch fresh recommendations from FastAPI backend for updated silhouette
    try {
      const backendRecs = await fetchRecommendations(updatedPrefs, 3, 0);
      if (backendRecs && backendRecs.length > 0) {
        setRecommendations(backendRecs);
      }
    } catch (error) {
      const fallbackRecs = getRecommendedOutfits(updatedPrefs, 3, 0);
      setRecommendations(fallbackRecs);
    }
  };
  
  // Saved looks with initial sample saved items from mock data
  const [savedLooks, setSavedLooks] = useState(() => {
    try {
      const stored = localStorage.getItem('chic_genie_saved_looks');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Could not load saved looks from localStorage', e);
    }
    // Default initial saved looks
    return [
      {
        ...MOCK_OUTFITS[0],
        savedAt: 'Today at 10:45 AM',
        dateSaved: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      },
      {
        ...MOCK_OUTFITS[2],
        savedAt: 'Yesterday',
        dateSaved: 'Sep 30, 2026'
      }
    ];
  });

  // Active outfit for "Why this look?" modal
  const [activeWhyLook, setActiveWhyLook] = useState(null);

  // Active outfit for "Customize" drawer/modal
  const [activeCustomizeOutfit, setActiveCustomizeOutfit] = useState(null);

  // Toast notifications
  const [toasts, setToasts] = useState([]);

  // User profile
  const [userProfile, setUserProfile] = useState({
    name: 'Tejaswi',
    email: 'tejaswi.chic@genie.fashion',
    avatarText: 'TG',
    archetype: 'The Effortless Minimalist with a Romantic Nuance',
    memberSince: '2026',
    favoriteStyle: 'Cute & Casual Chic',
    favoriteColors: ['Dusty Rose', 'Deep Plum', 'Ivory', 'Lavender'],
    notificationsEnabled: true,
    hapticFeedback: true
  });

  // Sync saved looks to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('chic_genie_saved_looks', JSON.stringify(savedLooks));
    } catch (e) {
      console.warn('Failed to save to localStorage', e);
    }
  }, [savedLooks]);

  // Route navigation helper
  const navigateTo = (route, params = null) => {
    if (params && params.outfit) {
      if (route === 'customize') {
        setActiveCustomizeOutfit(params.outfit);
      }
    }
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Toast helper
  const showToast = (message, type = 'success', icon = '✨') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type, icon }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3600);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Initial recommendation fetch on mount from FastAPI backend
  useEffect(() => {
    let isMounted = true;
    fetchRecommendations(preferences, 3, 0, [])
      .then(recs => {
        if (isMounted && recs && recs.length > 0) {
          setRecommendations(recs);
        }
      })
      .catch(() => {
        // Retain initial state gracefully if backend is booting
      });
    return () => { isMounted = false; };
  }, []);

  // Generate recommendations from preferences via FastAPI Backend
  const generateRecommendationsFromPreferences = async (customPrefs = null) => {
    const prefsToUse = customPrefs || preferences;
    const currentlyDisplayedIds = recommendations.map(r => r.id);
    try {
      const newRecs = await fetchRecommendations(prefsToUse, 3, 0, currentlyDisplayedIds);
      if (newRecs && newRecs.length > 0) {
        setRecommendations(newRecs);
      } else {
        const fallback = getRecommendedOutfits(prefsToUse, 3, 0);
        setRecommendations(fallback);
      }
    } catch (error) {
      showToast('Chic Genie styling engine is temporarily unavailable. Please try again.', 'error', '⚠️');
      const fallback = getRecommendedOutfits(prefsToUse, 3, 0);
      setRecommendations(fallback);
    }
    setSeedOffset(0);
    navigateTo('recommendations');
  };

  // "Give Me Another Look" - non-repetition generation via FastAPI Backend
  const regenerateRecommendations = async () => {
    const nextSeed = seedOffset + 1;
    setSeedOffset(nextSeed);
    const currentlyDisplayedIds = recommendations.map(r => r.id);
    try {
      const newRecs = await fetchRecommendations(preferences, 3, nextSeed, currentlyDisplayedIds);
      if (newRecs && newRecs.length > 0) {
        setRecommendations(newRecs);
        showToast('Curated 3 fresh looks tailored to your recipe', 'info', '🔄');
      } else {
        const fallback = getRecommendedOutfits(preferences, 3, nextSeed, currentlyDisplayedIds);
        setRecommendations(fallback);
        showToast('Curated 3 fresh looks tailored to your recipe', 'info', '🔄');
      }
    } catch (error) {
      showToast('Chic Genie styling engine is temporarily unavailable. Please try again.', 'error', '⚠️');
      const fallback = getRecommendedOutfits(preferences, 3, nextSeed, currentlyDisplayedIds);
      setRecommendations(fallback);
    }
  };

  // Save / Unsave outfits
  const saveOutfit = (outfit) => {
    if (isOutfitSaved(outfit.id)) {
      unsaveOutfit(outfit.id);
      return;
    }
    const newSaved = {
      ...outfit,
      savedAt: 'Just now',
      dateSaved: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
    setSavedLooks(prev => [newSaved, ...prev]);
    showToast(`Saved "${outfit.name}" to your collection`, 'success', '💖');
  };

  const unsaveOutfit = (outfitId) => {
    const target = savedLooks.find(o => o.id === outfitId);
    setSavedLooks(prev => prev.filter(o => o.id !== outfitId));
    showToast(`Removed "${target ? target.name : 'Outfit'}" from saved collection`, 'info', '🗑️');
  };

  const isOutfitSaved = (outfitId) => {
    return savedLooks.some(o => o.id === outfitId);
  };

  // Save customized look
  const saveCustomizedOutfit = (customOutfit) => {
    const timestamp = Date.now();
    const created = {
      ...customOutfit,
      id: `custom-${timestamp}`,
      name: `${customOutfit.name} (Customized)`,
      isCustom: true,
      savedAt: 'Just now',
      dateSaved: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
    setSavedLooks(prev => [created, ...prev]);
    // Also update in recommendations if present
    setRecommendations(prev => prev.map(o => o.id === customOutfit.id ? created : o));
    showToast(`Saved custom look "${created.name}"`, 'success', '✨');
    setActiveCustomizeOutfit(null);
  };

  return (
    <AppContext.Provider
      value={{
        currentRoute,
        navigateTo,
        bodyShape,
        setBodyShape,
        preferences,
        setPreferences,
        recommendations,
        generateRecommendationsFromPreferences,
        regenerateRecommendations,
        savedLooks,
        saveOutfit,
        unsaveOutfit,
        isOutfitSaved,
        activeWhyLook,
        setActiveWhyLook,
        activeCustomizeOutfit,
        setActiveCustomizeOutfit,
        saveCustomizedOutfit,
        toasts,
        showToast,
        removeToast,
        userProfile,
        setUserProfile
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  OCCASIONS, 
  STYLES, 
  WEATHERS, 
  OUTFIT_TYPES,
  OUTFIT_CATEGORIES,
  COLOR_SWATCHES, 
  COLOR_FAMILIES,
  PALETTE_PREFERENCES, 
  FIT_PREFERENCES, 
  COMFORT_OPTIONS, 
  FOOTWEAR_OPTIONS, 
  ACCESSORY_OPTIONS, 
  AVOID_OPTIONS 
} from '../data/preferenceOptions';
import { 
  ChevronLeft, 
  ChevronRight,
  ChevronDown,
  Sparkles, 
  Check, 
  Edit3, 
  SlidersHorizontal,
  ArrowRight
} from 'lucide-react';

const TOTAL_STEPS = 10;

export default function PreferencesWizard() {
  const { preferences, setPreferences, generateRecommendationsFromPreferences, navigateTo } = useApp();
  const [currentStep, setCurrentStep] = useState(1); // 1 to 10 for wizard, 11 for Summary, 12 for Loading
  const [isLoading, setIsLoading] = useState(false);
  const [loadingPhaseIndex, setLoadingPhaseIndex] = useState(0);

  const loadingPhrases = [
    'Understanding your style...',
    'Matching colors & silhouettes...',
    'Creating your coordinated look...',
    'Adding the finishing touches...'
  ];

  // Loading animation sequencer
  useEffect(() => {
    let interval;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingPhaseIndex(prev => {
          if (prev < loadingPhrases.length - 1) {
            return prev + 1;
          }
          return prev;
        });
      }, 600);

      return () => {
        clearInterval(interval);
      };
    }
  }, [isLoading]);

  const [activeColorFamily, setActiveColorFamily] = useState('all');
  const [expandedCategory, setExpandedCategory] = useState(null);

  const toggleCategory = (catId) => {
    setExpandedCategory(prev => prev === catId ? null : catId);
  };

  // Helper for multi-select toggle
  const toggleMultiSelect = (field, itemId) => {
    setPreferences(prev => {
      const currentList = prev[field] || [];
      
      if (field === 'colors') {
        if (itemId === 'any') {
          return { ...prev, colors: ['any'] };
        }
        const filtered = currentList.filter(id => id !== 'any');
        const exists = filtered.includes(itemId);
        const updated = exists ? filtered.filter(id => id !== itemId) : [...filtered, itemId];
        return { ...prev, colors: updated.length === 0 ? ['any'] : updated };
      }

      if (field === 'avoid') {
        if (itemId === 'nothing_to_avoid') {
          return { ...prev, avoid: ['nothing_to_avoid'] };
        }
        const filtered = currentList.filter(id => id !== 'nothing_to_avoid');
        const exists = filtered.includes(itemId);
        const updated = exists ? filtered.filter(id => id !== itemId) : [...filtered, itemId];
        return { ...prev, avoid: updated.length === 0 ? ['nothing_to_avoid'] : updated };
      }

      if (field === 'outfitTypes') {
        const exists = currentList.includes(itemId);
        const updated = exists ? currentList.filter(id => id !== itemId) : [...currentList, itemId];
        const primary = updated.length > 0 ? updated[0] : '';
        return { 
          ...prev, 
          outfitTypes: updated,
          outfitType: primary
        };
      }

      const exists = currentList.includes(itemId);
      const updated = exists ? currentList.filter(id => id !== itemId) : [...currentList, itemId];
      return { ...prev, [field]: updated };
    });
  };

  // Helper for single select
  const setSingleSelect = (field, itemId) => {
    setPreferences(prev => ({
      ...prev,
      [field]: itemId
    }));
  };

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (currentStep === TOTAL_STEPS) {
      // Move to Summary Screen
      setCurrentStep(11);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleJumpToStep = (stepNumber) => {
    setCurrentStep(stepNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFinalGenerate = async () => {
    setIsLoading(true);
    setLoadingPhaseIndex(0);
    try {
      await generateRecommendationsFromPreferences(preferences);
    } catch (err) {
      console.error('[PreferencesWizard] Generation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Loading Screen Render
  if (isLoading) {
    const progressPercent = Math.min(100, Math.round(((loadingPhaseIndex + 1) / loadingPhrases.length) * 100));
    return (
      <div className="loading-experience-overlay animate-fade-in" role="status" aria-live="polite">
        <div className="loading-spinner-ring"></div>
        <div className="editorial-tag editorial-tag-gold" style={{ fontSize: '0.85rem' }}>
          <Sparkles size={16} />
          <span>CHIC GENIE AI STYLIST ENGINE</span>
        </div>
        <h2 className="loading-phrase">
          "{loadingPhrases[loadingPhaseIndex]}"
        </h2>
        <div className="loading-progress-track">
          <div className="loading-progress-fill" style={{ width: `${progressPercent}%` }}></div>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
          Curating faceless digital fashion avatars and tailored color pairings...
        </p>
      </div>
    );
  }

  // Summary & Style Recipe Screen (Step 11)
  if (currentStep === 11) {
    const occasionObj = OCCASIONS.find(o => o.id === preferences.occasion);
    const outfitTypeObj = OUTFIT_TYPES.find(t => t.id === preferences.outfitType);
    const weatherObj = WEATHERS.find(w => w.id === preferences.weather);
    const comfortObj = COMFORT_OPTIONS.find(c => c.id === preferences.comfort);
    const footwearObj = FOOTWEAR_OPTIONS.find(f => f.id === preferences.footwear);

    const styleLabels = (preferences.styles || []).map(s => {
      const found = STYLES.find(item => item.id === s);
      return found ? found.label : s;
    }).join(' · ');

    const colorLabels = (preferences.colors || []).map(c => {
      const found = COLOR_SWATCHES.find(item => item.id === c);
      return found ? found.label : c;
    }).join(', ');

    const accessoryLabels = (preferences.accessories || []).map(a => {
      const found = ACCESSORY_OPTIONS.find(item => item.id === a);
      return found ? found.label : a;
    }).join(', ');

    return (
      <div className="preferences-wizard animate-fade-in">
        <div className="wizard-header-section">
          <div className="editorial-tag editorial-tag-gold" style={{ marginBottom: '0.5rem' }}>
            <Sparkles size={15} />
            <span>Ready for Curation</span>
          </div>
          <h1 className="wizard-title font-serif">
            Your Style Recipe is Ready
          </h1>
          <p className="wizard-subtitle">
            Review your styling coordinates below. Tap any section to adjust before we reveal your recommendations.
          </p>
        </div>

        {/* Recipe Summary Cards Grid */}
        <div className="summary-recipe-grid">
          {/* Occasion */}
          <div className="summary-card-item">
            <div className="summary-card-label">
              <span>01. Occasion</span>
              <button className="summary-edit-btn" onClick={() => handleJumpToStep(1)}>Edit</button>
            </div>
            <div className="summary-card-value">
              {occasionObj ? `${occasionObj.icon} ${occasionObj.label}` : 'College'}
            </div>
          </div>

          {/* Style / Vibe */}
          <div className="summary-card-item">
            <div className="summary-card-label">
              <span>02. Vibe</span>
              <button className="summary-edit-btn" onClick={() => handleJumpToStep(2)}>Edit</button>
            </div>
            <div className="summary-card-value" style={{ fontSize: '0.92rem' }}>
              {styleLabels || 'Cute · Casual'}
            </div>
          </div>

          {/* Weather */}
          <div className="summary-card-item">
            <div className="summary-card-label">
              <span>03. Weather</span>
              <button className="summary-edit-btn" onClick={() => handleJumpToStep(3)}>Edit</button>
            </div>
            <div className="summary-card-value">
              {weatherObj ? `${weatherObj.icon} ${weatherObj.label}` : 'Warm'}
            </div>
          </div>

          {/* Outfit Type */}
          <div className="summary-card-item">
            <div className="summary-card-label">
              <span>04. Outfit Type</span>
              <button className="summary-edit-btn" onClick={() => handleJumpToStep(4)}>Edit</button>
            </div>
            <div className="summary-card-value" style={{ fontSize: '0.92rem' }}>
              {(preferences.outfitTypes && preferences.outfitTypes.length > 0 
                ? preferences.outfitTypes 
                : (preferences.outfitType ? [preferences.outfitType] : [])
              ).map(t => {
                const found = OUTFIT_TYPES.find(item => item.id === t);
                return found ? `${found.icon} ${found.label}` : t;
              }).join(' · ') || '✨ Any Silhouette'}
            </div>
          </div>

          {/* Colors */}
          <div className="summary-card-item">
            <div className="summary-card-label">
              <span>05. Color Palette</span>
              <button className="summary-edit-btn" onClick={() => handleJumpToStep(5)}>Edit</button>
            </div>
            <div className="summary-card-value" style={{ fontSize: '0.92rem' }}>
              {colorLabels || 'Pastel, Blue, Pink'}
            </div>
          </div>

          {/* Fit */}
          <div className="summary-card-item">
            <div className="summary-card-label">
              <span>06. Fit</span>
              <button className="summary-edit-btn" onClick={() => handleJumpToStep(6)}>Edit</button>
            </div>
            <div className="summary-card-value" style={{ textTransform: 'capitalize' }}>
              {preferences.fit || 'Relaxed'}
            </div>
          </div>

          {/* Comfort */}
          <div className="summary-card-item">
            <div className="summary-card-label">
              <span>07. Priority</span>
              <button className="summary-edit-btn" onClick={() => handleJumpToStep(7)}>Edit</button>
            </div>
            <div className="summary-card-value">
              {comfortObj ? `${comfortObj.icon} ${comfortObj.label}` : 'Comfort First'}
            </div>
          </div>

          {/* Footwear */}
          <div className="summary-card-item">
            <div className="summary-card-label">
              <span>08. Footwear</span>
              <button className="summary-edit-btn" onClick={() => handleJumpToStep(8)}>Edit</button>
            </div>
            <div className="summary-card-value">
              {footwearObj ? `${footwearObj.icon} ${footwearObj.label}` : 'Sneakers'}
            </div>
          </div>

          {/* Accessories */}
          <div className="summary-card-item" style={{ gridColumn: 'span 2' }}>
            <div className="summary-card-label">
              <span>09. Finishing Touches</span>
              <button className="summary-edit-btn" onClick={() => handleJumpToStep(9)}>Edit</button>
            </div>
            <div className="summary-card-value" style={{ fontSize: '0.92rem' }}>
              {accessoryLabels || 'Minimal, Handbag'}
            </div>
          </div>
        </div>

        {/* Primary CTA */}
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button 
            id="generate-looks-final-button"
            className="btn-primary"
            style={{ fontSize: '1.15rem', padding: '1.1rem 3.5rem', boxShadow: 'var(--shadow-luxury)' }}
            onClick={handleFinalGenerate}
          >
            <Sparkles size={20} className="editorial-tag-gold" />
            <span>✨ Create My Looks</span>
          </button>
          <div style={{ marginTop: '0.75rem' }}>
            <button 
              className="btn-ghost"
              onClick={() => setCurrentStep(10)}
            >
              <ChevronLeft size={16} /> Back to Preferences
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Wizard Steps 1 to 10
  return (
    <div className="preferences-wizard animate-fade-in" id="preferences-wizard-page">
      {/* Wizard Header */}
      <div className="wizard-header-section">
        <span className="editorial-tag editorial-tag-gold" style={{ marginBottom: '0.4rem' }}>
          Step {currentStep} of {TOTAL_STEPS}
        </span>
        <h1 className="wizard-title font-serif">
          Let's create your perfect look.
        </h1>
        <p className="wizard-subtitle">
          Tell Chic Genie what you're feeling, where you're going, and how you want to look.
        </p>
      </div>

      {/* Progress Indicator: 01 ━━━ 02 ━━━ 03 ... */}
      <div className="progress-stepper" aria-label="Preference steps progress">
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => {
          const stepNum = i + 1;
          const isActive = currentStep === stepNum;
          const isCompleted = currentStep > stepNum;
          return (
            <React.Fragment key={stepNum}>
              <div 
                className={`step-node ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                onClick={() => handleJumpToStep(stepNum)}
                title={`Go to step ${stepNum}`}
              >
                <div className="step-number">
                  {isCompleted ? <Check size={14} /> : `0${stepNum}`}
                </div>
              </div>
              {stepNum < TOTAL_STEPS && (
                <div className={`step-divider ${isCompleted ? 'filled' : ''}`}></div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Step Content Card */}
      <div className="step-container-card">

        {/* STEP 1: OCCASION */}
        {currentStep === 1 && (
          <div>
            <div className="step-heading-group">
              <h2 className="step-title font-serif">Where are you going?</h2>
              <p className="step-desc">Let's start with the occasion. Select one destination.</p>
            </div>
            <div className="cards-grid">
              {OCCASIONS.map((occ) => {
                const isSelected = preferences.occasion === occ.id;
                return (
                  <div
                    key={occ.id}
                    id={`occasion-${occ.id}`}
                    className={`select-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => setSingleSelect('occasion', occ.id)}
                    role="button"
                    tabIndex={0}
                    aria-pressed={isSelected}
                  >
                    <span className="select-card-icon">{occ.icon}</span>
                    <span className="select-card-title">{occ.label}</span>
                    <span className="select-card-desc">{occ.desc}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 2: STYLE / VIBE */}
        {currentStep === 2 && (
          <div>
            <div className="step-heading-group">
              <h2 className="step-title font-serif">What's your vibe?</h2>
              <p className="step-desc">Choose one or more styles that feel like you today.</p>
            </div>
            <div className="cards-grid">
              {STYLES.map((st) => {
                const isSelected = (preferences.styles || []).includes(st.id);
                return (
                  <div
                    key={st.id}
                    id={`style-${st.id}`}
                    className={`select-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => toggleMultiSelect('styles', st.id)}
                    role="button"
                    tabIndex={0}
                    aria-pressed={isSelected}
                  >
                    <span className="select-card-icon">{st.icon}</span>
                    <span className="select-card-title">{st.label}</span>
                    <span className="select-card-desc">{st.desc}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 3: WEATHER */}
        {currentStep === 3 && (
          <div>
            <div className="step-heading-group">
              <h2 className="step-title font-serif">What's the weather like?</h2>
              <p className="step-desc">We will recommend fabrics and layers tailored to the climate.</p>
            </div>
            <div className="cards-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
              {WEATHERS.map((w) => {
                const isSelected = preferences.weather === w.id;
                return (
                  <div
                    key={w.id}
                    id={`weather-${w.id}`}
                    className={`select-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => setSingleSelect('weather', w.id)}
                    role="button"
                    tabIndex={0}
                    aria-pressed={isSelected}
                  >
                    <span className="select-card-icon">{w.icon}</span>
                    <span className="select-card-title">{w.label}</span>
                    <span style={{ fontSize: '0.75rem', color: isSelected ? 'rgba(255,255,255,0.9)' : 'var(--color-champagne-gold)', fontWeight: 600 }}>
                      {w.temp}
                    </span>
                    <span className="select-card-desc">{w.desc}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 4: OUTFIT TYPE (Grouped by Category) */}
        {currentStep === 4 && (
          <div>
            <div className="step-heading-group">
              <h2 className="step-title font-serif">What do you feel like wearing?</h2>
              <p className="step-desc">Choose an outfit category, then select your preferred silhouette formats.</p>
            </div>

            {/* Parent Category Cards Grid */}
            <div className="outfit-categories-grid">
              {OUTFIT_CATEGORIES.map((cat) => {
                const currentSelectedTypes = preferences.outfitTypes && preferences.outfitTypes.length > 0
                  ? preferences.outfitTypes
                  : (preferences.outfitType ? [preferences.outfitType] : []);
                const selectedCount = cat.items.filter(item => currentSelectedTypes.includes(item.id)).length;
                const isExpanded = expandedCategory === cat.id;

                return (
                  <div
                    key={cat.id}
                    id={`outfit-category-${cat.id}`}
                    className={`category-parent-card ${isExpanded ? 'expanded' : ''} ${selectedCount > 0 ? 'has-selection' : ''}`}
                    onClick={() => toggleCategory(cat.id)}
                    role="button"
                    tabIndex={0}
                    aria-expanded={isExpanded}
                  >
                    <div className="category-parent-header">
                      <div className="category-parent-title-group">
                        <span className="category-parent-icon">{cat.icon}</span>
                        <div>
                          <h3 className="category-parent-title">{cat.label}</h3>
                          <span className="category-parent-count-hint">{cat.items.length} options</span>
                        </div>
                      </div>
                      <div className="category-parent-action">
                        {selectedCount > 0 && (
                          <span className="category-selected-badge">
                            <Check size={13} />
                            <span>{selectedCount} selected</span>
                          </span>
                        )}
                        <span className={`category-expand-indicator ${isExpanded ? 'rotated' : ''}`}>
                          <ChevronDown size={18} />
                        </span>
                      </div>
                    </div>
                    <p className="category-parent-desc">{cat.desc}</p>
                  </div>
                );
              })}
            </div>

            {/* Active Category Expanded Child Options Panel */}
            {expandedCategory && (() => {
              const activeCat = OUTFIT_CATEGORIES.find(c => c.id === expandedCategory);
              if (!activeCat) return null;

              const currentSelectedTypes = preferences.outfitTypes && preferences.outfitTypes.length > 0
                ? preferences.outfitTypes
                : (preferences.outfitType ? [preferences.outfitType] : []);

              return (
                <div className="category-child-panel animate-fade-in" id={`child-panel-${activeCat.id}`}>
                  <div className="child-panel-header">
                    <div className="child-panel-title-wrap">
                      <span className="child-panel-icon">{activeCat.icon}</span>
                      <div>
                        <h4 className="child-panel-title font-serif">{activeCat.label} Silhouettes</h4>
                        <p className="child-panel-subtitle">Select one or more specific {activeCat.label.toLowerCase()} cuts:</p>
                      </div>
                    </div>
                    <button 
                      type="button"
                      className="child-panel-close-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedCategory(null);
                      }}
                    >
                      Collapse
                    </button>
                  </div>

                  <div className="cards-grid">
                    {activeCat.items.map((ot) => {
                      const isSelected = currentSelectedTypes.includes(ot.id);
                      return (
                        <div
                          key={ot.id}
                          id={`outfit-type-${ot.id}`}
                          className={`select-card ${isSelected ? 'selected' : ''}`}
                          onClick={() => toggleMultiSelect('outfitTypes', ot.id)}
                          role="button"
                          tabIndex={0}
                          aria-pressed={isSelected}
                        >
                          <span className="select-card-icon">{ot.icon}</span>
                          <span className="select-card-title">{ot.label}</span>
                          <span className="select-card-desc">{ot.desc}</span>
                          {isSelected && (
                            <span className="select-card-check">
                              <Check size={14} />
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

          </div>
        )}

        {/* STEP 5: COLOR & PALETTE */}
        {currentStep === 5 && (
          <div>
            <div className="step-heading-group">
              <h2 className="step-title font-serif">What colors are you feeling?</h2>
              <p className="step-desc">Choose one or more color hues, plus your preferred palette mood.</p>
            </div>

            <div className="color-swatches-container">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
                  <h4 style={{ fontSize: '0.9rem', color: 'var(--color-primary)', margin: 0 }}>
                    Color Swatches (Select multiple):
                  </h4>
                  
                  {/* Color Family Filter Chips */}
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    {COLOR_FAMILIES.map((fam) => {
                      const isActive = activeColorFamily === fam.id;
                      return (
                        <button
                          key={fam.id}
                          className="btn-ghost"
                          style={{
                            fontSize: '0.75rem',
                            padding: '0.32rem 0.75rem',
                            borderRadius: 'var(--radius-pill)',
                            backgroundColor: isActive ? 'var(--color-primary)' : 'rgba(50, 16, 68, 0.05)',
                            color: isActive ? '#FFFFFF' : 'var(--color-text-muted)',
                            fontWeight: isActive ? 600 : 500,
                            transition: 'all var(--transition-fast)'
                          }}
                          onClick={() => setActiveColorFamily(fam.id)}
                        >
                          {fam.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="swatches-grid">
                  {COLOR_SWATCHES.filter(s => activeColorFamily === 'all' || s.family === activeColorFamily || s.id === 'any').map((swatch) => {
                    const isSelected = (preferences.colors || []).includes(swatch.id);
                    return (
                      <div
                        key={swatch.id}
                        id={`swatch-${swatch.id}`}
                        className={`color-swatch-item ${isSelected ? 'selected' : ''}`}
                        onClick={() => toggleMultiSelect('colors', swatch.id)}
                        role="button"
                        tabIndex={0}
                        aria-pressed={isSelected}
                      >
                        <div 
                          className="color-circle" 
                          style={{ 
                            background: swatch.hex, 
                            border: `1.5px solid ${swatch.border}` 
                          }}
                        >
                          {isSelected && <Check size={16} color={swatch.id === 'white' || swatch.id === 'off_white' || swatch.id === 'cream' || swatch.id === 'butter_yellow' ? '#321044' : '#FFFFFF'} />}
                        </div>
                        <span className="color-swatch-label">{swatch.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: '0.9rem', marginBottom: '0.75rem', color: 'var(--color-primary)' }}>
                  Palette Mood:
                </h4>
                <div className="cards-grid-sm" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))' }}>
                  {PALETTE_PREFERENCES.map((pal) => {
                    const isSelected = preferences.palette === pal.id;
                    return (
                      <div
                        key={pal.id}
                        className={`select-card ${isSelected ? 'selected' : ''}`}
                        onClick={() => setSingleSelect('palette', pal.id)}
                        role="button"
                        tabIndex={0}
                      >
                        <span className="select-card-title">{pal.label}</span>
                        <span className="select-card-desc">{pal.desc}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: FIT PREFERENCES */}
        {currentStep === 6 && (
          <div>
            <div className="step-heading-group">
              <h2 className="step-title font-serif">How do you like your clothes to fit?</h2>
              <p className="step-desc">Purely a clothing drape preference — no body shapes or measurements.</p>
            </div>
            <div className="cards-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
              {FIT_PREFERENCES.map((fit) => {
                const isSelected = preferences.fit === fit.id;
                return (
                  <div
                    key={fit.id}
                    id={`fit-${fit.id}`}
                    className={`select-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => setSingleSelect('fit', fit.id)}
                    role="button"
                    tabIndex={0}
                    aria-pressed={isSelected}
                  >
                    <span className="select-card-title" style={{ fontSize: '1.1rem' }}>{fit.label}</span>
                    <span className="select-card-desc">{fit.desc}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 7: COMFORT VS STYLE */}
        {currentStep === 7 && (
          <div>
            <div className="step-heading-group">
              <h2 className="step-title font-serif">What matters most today?</h2>
              <p className="step-desc">Choose your aesthetic priority balance for this look.</p>
            </div>
            <div className="cards-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
              {COMFORT_OPTIONS.map((com) => {
                const isSelected = preferences.comfort === com.id;
                return (
                  <div
                    key={com.id}
                    id={`comfort-${com.id}`}
                    className={`select-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => setSingleSelect('comfort', com.id)}
                    role="button"
                    tabIndex={0}
                    aria-pressed={isSelected}
                    style={{ padding: '2rem 1.5rem' }}
                  >
                    <span className="select-card-icon" style={{ fontSize: '2.5rem' }}>{com.icon}</span>
                    <span className="select-card-title" style={{ fontSize: '1.2rem', margin: '0.4rem 0' }}>{com.label}</span>
                    <span className="select-card-desc">{com.desc}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 8: FOOTWEAR */}
        {currentStep === 8 && (
          <div>
            <div className="step-heading-group">
              <h2 className="step-title font-serif">Complete the look.</h2>
              <p className="step-desc">What would you like to wear on your feet?</p>
            </div>
            <div className="cards-grid">
              {FOOTWEAR_OPTIONS.map((fw) => {
                const isSelected = preferences.footwear === fw.id;
                return (
                  <div
                    key={fw.id}
                    id={`footwear-${fw.id}`}
                    className={`select-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => setSingleSelect('footwear', fw.id)}
                    role="button"
                    tabIndex={0}
                    aria-pressed={isSelected}
                  >
                    <span className="select-card-icon">{fw.icon}</span>
                    <span className="select-card-title">{fw.label}</span>
                    <span className="select-card-desc">{fw.desc}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 9: ACCESSORIES */}
        {currentStep === 9 && (
          <div>
            <div className="step-heading-group">
              <h2 className="step-title font-serif">Add your finishing touches.</h2>
              <p className="step-desc">Select one or more accessories to elevate your outfit.</p>
            </div>
            <div className="cards-grid">
              {ACCESSORY_OPTIONS.map((acc) => {
                const isSelected = (preferences.accessories || []).includes(acc.id);
                return (
                  <div
                    key={acc.id}
                    id={`accessory-${acc.id}`}
                    className={`select-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => toggleMultiSelect('accessories', acc.id)}
                    role="button"
                    tabIndex={0}
                    aria-pressed={isSelected}
                  >
                    <span className="select-card-icon">{acc.icon}</span>
                    <span className="select-card-title">{acc.label}</span>
                    <span className="select-card-desc">{acc.desc}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 10: AVOID / EXCLUSIONS */}
        {currentStep === 10 && (
          <div>
            <div className="step-heading-group">
              <h2 className="step-title font-serif">Anything you don't want?</h2>
              <p className="step-desc">Tell us what to leave out. We'll filter recommendations accordingly.</p>
            </div>
            <div className="chips-flex-wrap">
              {AVOID_OPTIONS.map((av) => {
                const isSelected = (preferences.avoid || []).includes(av.id);
                return (
                  <button
                    key={av.id}
                    id={`avoid-${av.id}`}
                    className={`select-chip ${isSelected ? 'selected' : ''}`}
                    onClick={() => toggleMultiSelect('avoid', av.id)}
                    aria-pressed={isSelected}
                  >
                    <span>{av.icon}</span>
                    <span>{av.label}</span>
                    {isSelected && <Check size={14} />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

      </div>

      {/* Wizard Footer Nav */}
      <div className="wizard-footer-nav">
        {currentStep > 1 ? (
          <button 
            className="btn-secondary"
            onClick={handleBack}
            id="wizard-back-button"
          >
            <ChevronLeft size={16} />
            <span>Back</span>
          </button>
        ) : (
          <button 
            className="btn-secondary"
            onClick={() => navigateTo('bodyshape')}
            id="wizard-back-button"
          >
            <ChevronLeft size={16} />
            <span>Back</span>
          </button>
        )}

        <button 
          className="btn-primary"
          onClick={handleNext}
          id="wizard-next-button"
        >
          <span>{currentStep === TOTAL_STEPS ? 'Review Style Recipe' : 'Next Step'}</span>
          <ChevronRight size={16} />
        </button>
      </div>

    </div>
  );
}

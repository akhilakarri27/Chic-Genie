import React from 'react';
import { useApp } from '../context/AppContext';
import OutfitCard from '../components/OutfitCard';
import { 
  Sparkles, 
  RotateCcw, 
  SlidersHorizontal, 
  MessageSquare, 
  Heart,
  ChevronRight
} from 'lucide-react';

export default function Recommendations() {
  const { 
    recommendations, 
    regenerateRecommendations, 
    navigateTo, 
    preferences,
    savedLooks 
  } = useApp();

  return (
    <div className="recommendations-page-container animate-fade-in" id="recommendations-page">
      {/* Editorial Header */}
      <div className="recommendations-header">
        <div className="recs-header-left">
          <div className="editorial-tag editorial-tag-gold" style={{ marginBottom: '0.4rem' }}>
            <Sparkles size={16} />
            <span>Chic Genie Curation Engine</span>
          </div>
          <h1 className="font-serif" style={{ fontSize: '2.4rem', marginBottom: '0.45rem' }}>
            Looks Picked for You.
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem', lineHeight: '1.5' }}>
            Curated by Chic Genie for <strong style={{ color: 'var(--color-primary)', textTransform: 'capitalize' }}>{preferences.bodyShape ? `${preferences.bodyShape.replace('_', ' ')} Silhouette` : 'Your Silhouette'}</strong> · <strong style={{ color: 'var(--color-primary)' }}>{preferences.occasion || 'Everyday'}</strong> · <span style={{ textTransform: 'capitalize' }}>{preferences.comfort ? preferences.comfort.replace('_', ' ') : 'Balanced'}</span>.
          </p>
        </div>

        {/* Header Action Controls */}
        <div className="recs-header-actions">
          <button 
            id="btn-regenerate-looks"
            className="btn-secondary" 
            onClick={regenerateRecommendations}
            title="Generate 3 fresh looks respecting current preferences"
          >
            <RotateCcw size={16} />
            <span>🔄 Give Me Another Look</span>
          </button>

          <button 
            id="btn-edit-preferences"
            className="btn-secondary" 
            onClick={() => navigateTo('preferences')}
            title="Adjust your filters"
          >
            <SlidersHorizontal size={16} />
            <span>Refine Preferences</span>
          </button>

          <button 
            id="btn-ask-stylist"
            className="btn-primary"
            onClick={() => navigateTo('stylist')}
          >
            <MessageSquare size={16} />
            <span>Ask AI Stylist</span>
          </button>
        </div>
      </div>

      {/* 3 Editorial Outfit Recommendation Cards */}
      <div className="recommendations-grid" role="region" aria-label="Outfit Recommendations">
        {recommendations.map((outfit) => (
          <OutfitCard 
            key={outfit.id} 
            outfit={outfit} 
          />
        ))}
      </div>

      {/* Bottom Editorial Banner */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 'var(--radius-xl)',
        padding: '2.5rem',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.5rem',
        background: 'linear-gradient(135deg, #FFFFFF 0%, #FDF4F9 100%)'
      }}>
        <div>
          <span className="editorial-tag editorial-tag-gold" style={{ marginBottom: '0.35rem' }}>
            <Heart size={14} />
            <span>Your Personal Wardrobe Archive</span>
          </span>
          <h3 className="font-serif" style={{ fontSize: '1.5rem', margin: '0.2rem 0 0.35rem' }}>
            Love these silhouettes? Save them to your style collection.
          </h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem' }}>
            You currently have <strong>{savedLooks.length} looks saved</strong> in your personal style archive.
          </p>
        </div>

        <button 
          className="btn-primary"
          onClick={() => navigateTo('saved')}
        >
          <span>View Saved Looks</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

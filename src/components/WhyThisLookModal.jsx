import React from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, X, Check, Shirt, Heart, Sliders } from 'lucide-react';

export default function WhyThisLookModal() {
  const { activeWhyLook, setActiveWhyLook, navigateTo, saveOutfit, isOutfitSaved } = useApp();

  if (!activeWhyLook) return null;

  const isSaved = isOutfitSaved(activeWhyLook.id);

  return (
    <div 
      className="modal-backdrop-overlay" 
      onClick={() => setActiveWhyLook(null)}
      role="dialog"
      aria-modal="true"
      aria-labelledby="why-look-title"
    >
      <div 
        className="modal-content-window" 
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          className="modal-close-btn"
          onClick={() => setActiveWhyLook(null)}
          aria-label="Close why this look dialog"
        >
          <X size={18} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.5rem' }}>
          <Sparkles size={16} color="var(--color-champagne-gold)" />
          <span className="editorial-tag editorial-tag-gold">Fashion Intelligence Rationale</span>
        </div>

        <h2 id="why-look-title" className="font-serif" style={{ fontSize: '1.65rem', marginBottom: '0.35rem' }}>
          Why Chic Genie Picked This Look
        </h2>

        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          Curated specifically for: <strong style={{ color: 'var(--color-primary)' }}>{activeWhyLook.name}</strong>
        </p>

        {/* Visual Mini Avatar & Summary Banner */}
        <div style={{
          display: 'flex',
          gap: '1.25rem',
          backgroundColor: '#FAF5F8',
          padding: '1.25rem',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
          marginBottom: '1.5rem'
        }}>
          <img 
            src={activeWhyLook.avatarUrl} 
            alt={activeWhyLook.name}
            style={{ 
              width: '80px', 
              height: '110px', 
              objectFit: 'cover', 
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              backgroundColor: '#FFFFFF'
            }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--color-champagne-gold)', fontWeight: 600, letterSpacing: '0.05em' }}>
              {activeWhyLook.preferenceMatch}% PREFERENCE MATCH
            </span>
            <h4 style={{ fontSize: '1.1rem', margin: '0.2rem 0 0.4rem', color: 'var(--color-primary)' }}>
              {activeWhyLook.name}
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
              {activeWhyLook.tags.map((tag, idx) => (
                <span key={idx} style={{ fontSize: '0.72rem', background: '#FFFFFF', padding: '0.15rem 0.5rem', borderRadius: '4px', color: 'var(--color-text-muted)' }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* AI Rationale Paragraph */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderLeft: '3px solid var(--color-primary)',
          padding: '1rem 1.25rem',
          marginBottom: '1.5rem',
          borderRadius: '0 var(--radius-md) var(--radius-md) 0',
          background: 'linear-gradient(90deg, rgba(253, 244, 249, 0.6) 0%, #FFFFFF 100%)'
        }}>
          <p style={{ fontSize: '0.96rem', lineHeight: '1.65', color: 'var(--color-text-main)' }}>
            "{activeWhyLook.explanation}"
          </p>
        </div>

        {/* Key Aesthetic Harmonization Breakdown */}
        <div style={{ marginBottom: '1.75rem' }}>
          <h4 style={{ fontSize: '0.95rem', marginBottom: '0.75rem', color: 'var(--color-primary)' }}>
            Harmony & Styling Breakdown
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.86rem', color: 'var(--color-text-muted)' }}>
              <Check size={16} color="var(--color-primary)" />
              <span><strong>Color Interplay:</strong> Tonal harmony using curated pastel & neutral accents.</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.86rem', color: 'var(--color-text-muted)' }}>
              <Check size={16} color="var(--color-primary)" />
              <span><strong>Silhouette Balance:</strong> Structured upper layer counterbalanced by relaxed fluid lines.</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.86rem', color: 'var(--color-text-muted)' }}>
              <Check size={16} color="var(--color-primary)" />
              <span><strong>Comfort Ratio:</strong> Ergonomic footwear paired with breathable natural textiles.</span>
            </div>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', borderTop: '1px solid var(--color-border)', paddingTop: '1.25rem' }}>
          <button 
            className="btn-secondary" 
            onClick={() => {
              saveOutfit(activeWhyLook);
            }}
          >
            <Heart size={16} fill={isSaved ? "var(--color-primary)" : "none"} />
            <span>{isSaved ? 'Saved to Collection' : 'Save Look'}</span>
          </button>

          <button 
            className="btn-primary" 
            onClick={() => {
              const target = activeWhyLook;
              setActiveWhyLook(null);
              navigateTo('customize', { outfit: target });
            }}
          >
            <Sliders size={16} />
            <span>Customize This Look</span>
          </button>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, 
  TrendingUp, 
  Palette, 
  Footprints, 
  Layers, 
  Cpu, 
  Heart,
  Sliders,
  Check
} from 'lucide-react';

export default function MyStyle() {
  const { userProfile, savedLooks, navigateTo } = useApp();

  const styleDistribution = [
    { label: 'Casual Chic', percent: 45, color: '#321044' },
    { label: 'Cute & Coquette', percent: 25, color: '#D9A9BE' },
    { label: 'Minimalist & Quiet Luxury', percent: 15, color: '#C7A56A' },
    { label: 'Refined Elegance', percent: 10, color: '#DCCFE4' },
    { label: 'Runway Trendy', percent: 5, color: '#8E9F85' }
  ];

  const favoriteColors = [
    { label: 'Dusty Rose', hex: '#D9A9BE' },
    { label: 'Deep Plum', hex: '#321044' },
    { label: 'Soft Ivory', hex: '#FAF5F8' },
    { label: 'Pastel Lavender', hex: '#DCCFE4' },
    { label: 'Champagne Gold', hex: '#C7A56A' }
  ];

  return (
    <div className="my-style-page animate-fade-in" id="my-style-page">
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div className="editorial-tag editorial-tag-gold" style={{ marginBottom: '0.4rem' }}>
          <Sparkles size={15} />
          <span>Personal Fashion Identity</span>
        </div>
        <h1 className="font-serif" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
          Your Style
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem', maxWidth: '580px', margin: '0 auto' }}>
          Chic Genie learns what you love. A real-time reflection of your aesthetic preferences.
        </p>
      </div>

      {/* Style Archetype Hero Banner */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 'var(--radius-xl)',
        padding: '2.25rem 2.5rem',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-md)',
        marginBottom: '2.5rem',
        background: 'radial-gradient(circle at 90% 10%, #FAF0F6 0%, #FFFFFF 60%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        <div style={{ maxWidth: '640px' }}>
          <span className="editorial-tag" style={{ color: 'var(--color-champagne-gold)', marginBottom: '0.35rem' }}>
            Primary Style Archetype
          </span>
          <h2 className="font-serif" style={{ fontSize: '1.85rem', margin: '0.2rem 0 0.5rem' }}>
            {userProfile.archetype}
          </h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.94rem', lineHeight: '1.6' }}>
            Your choices reflect a natural inclination toward relaxed luxury, breathable linen-denim textures, and gentle blush tones elevated by structured tailoring.
          </p>
        </div>

        <button 
          className="btn-primary"
          onClick={() => navigateTo('preferences')}
        >
          <Sparkles size={16} />
          <span>Update Style Recipe</span>
        </button>
      </div>

      {/* Dashboard Analytics Grid */}
      <div className="style-dashboard-grid">
        
        {/* Left Card: Style Aesthetic Distribution Progress Bars */}
        <div className="style-stat-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <TrendingUp size={20} color="var(--color-primary)" />
            <h3 className="font-serif" style={{ fontSize: '1.35rem' }}>
              Style Preference Weights
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {styleDistribution.map((item, idx) => (
              <div key={idx} className="style-progress-row">
                <div className="style-progress-header">
                  <span style={{ color: 'var(--color-text-main)' }}>{item.label}</span>
                  <strong style={{ color: 'var(--color-primary)' }}>{item.percent}%</strong>
                </div>
                <div className="style-progress-bar-bg">
                  <div 
                    className="style-progress-bar-fill" 
                    style={{ 
                      width: `${item.percent}%`,
                      backgroundColor: item.color
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Preferences Matrix & Swatches */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Favorite Colors Card */}
          <div className="style-stat-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.15rem' }}>
              <Palette size={18} color="var(--color-primary)" />
              <h3 className="font-serif" style={{ fontSize: '1.2rem' }}>
                Favorite Color Harmonies
              </h3>
            </div>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem' }}>
              {favoriteColors.map((col, i) => (
                <div 
                  key={i} 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    backgroundColor: '#FAF5F8',
                    padding: '0.45rem 0.85rem',
                    borderRadius: 'var(--radius-pill)',
                    border: '1px solid var(--color-border)'
                  }}
                >
                  <div 
                    style={{ 
                      width: '16px', 
                      height: '16px', 
                      borderRadius: '50%', 
                      backgroundColor: col.hex,
                      border: '1px solid rgba(0,0,0,0.1)'
                    }} 
                  />
                  <span style={{ fontSize: '0.82rem', fontWeight: 500 }}>{col.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Silhouette & Comfort Metrics */}
          <div className="style-stat-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.15rem' }}>
              <Layers size={18} color="var(--color-primary)" />
              <h3 className="font-serif" style={{ fontSize: '1.2rem' }}>
                Core Styling Coordinates
              </h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.88rem' }}>
              <div style={{ backgroundColor: '#FAF5F8', padding: '0.85rem', borderRadius: 'var(--radius-md)' }}>
                <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', display: 'block' }}>
                  Preferred Fit
                </span>
                <strong style={{ color: 'var(--color-primary)' }}>Relaxed & Flowy</strong>
              </div>

              <div style={{ backgroundColor: '#FAF5F8', padding: '0.85rem', borderRadius: 'var(--radius-md)' }}>
                <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', display: 'block' }}>
                  Top Footwear
                </span>
                <strong style={{ color: 'var(--color-primary)' }}>Minimal Sneakers & Flats</strong>
              </div>

              <div style={{ backgroundColor: '#FAF5F8', padding: '0.85rem', borderRadius: 'var(--radius-md)' }}>
                <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', display: 'block' }}>
                  Comfort Ratio
                </span>
                <strong style={{ color: 'var(--color-primary)' }}>Comfort First (70%)</strong>
              </div>

              <div style={{ backgroundColor: '#FAF5F8', padding: '0.85rem', borderRadius: 'var(--radius-md)' }}>
                <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', display: 'block' }}>
                  Most Visited Occasion
                </span>
                <strong style={{ color: 'var(--color-primary)' }}>College & Casual Outings</strong>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* "Your Style is Evolving" Future AI/RAG Explanation Card */}
      <div style={{
        marginTop: '2.5rem',
        backgroundColor: '#FAF5F8',
        borderRadius: 'var(--radius-xl)',
        padding: '2rem 2.25rem',
        border: '1px solid var(--color-border)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '1.25rem'
      }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '50%',
          backgroundColor: 'var(--color-primary)',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <Cpu size={22} />
        </div>

        <div>
          <h4 className="font-serif" style={{ fontSize: '1.25rem', marginBottom: '0.35rem', color: 'var(--color-primary)' }}>
            Your Style is Evolving
          </h4>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem', lineHeight: '1.6' }}>
            In the complete Chic Genie ecosystem, our AI intelligence engine continuously refines its understanding of your aesthetic nuances through your saved looks, feedback signals, regenerations, and custom edits. As your tastes shift across seasons and milestones, Chic Genie adapts alongside you.
          </p>
        </div>
      </div>
    </div>
  );
}

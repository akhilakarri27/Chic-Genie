import React from 'react';
import { useApp } from '../context/AppContext';
import { MOCK_OUTFITS } from '../data/mockOutfits';
import { 
  Sparkles, 
  ArrowRight, 
  Heart, 
  Compass, 
  Sliders, 
  Coffee, 
  Briefcase, 
  Moon, 
  Sun,
  Flame
} from 'lucide-react';

const QUICK_PRESETS = [
  {
    title: 'Morning Coffee Date',
    icon: '☕',
    tag: 'Cute & Relaxed',
    desc: 'Linen shirt, vintage denim & clean white trainers',
    prefs: { occasion: 'casual', styles: ['cute', 'casual_vibe'], weather: 'warm', outfitType: 'jeans_top', colors: ['pink', 'blue'], comfort: 'comfort_first' }
  },
  {
    title: 'Monday Power Office',
    icon: '💼',
    tag: 'Tailored & Poised',
    desc: 'Deep plum double-breasted suit & leather loafers',
    prefs: { occasion: 'office', styles: ['professional', 'elegant'], weather: 'pleasant', outfitType: 'shirt_trousers', colors: ['purple', 'black'], comfort: 'balanced' }
  },
  {
    title: 'Golden Hour Cocktail',
    icon: '🥂',
    tag: 'Satin & Glamour',
    desc: 'Dusty rose bias slip dress & gold kitten heels',
    prefs: { occasion: 'party', styles: ['elegant', 'feminine'], weather: 'warm', outfitType: 'dress', colors: ['pink', 'beige'], comfort: 'style_first' }
  },
  {
    title: 'Festive Banarasi Glam',
    icon: '🪷',
    tag: 'Heritage Organza',
    desc: 'Lavender organza saree & antique gold jhumkas',
    prefs: { occasion: 'festival', styles: ['traditional', 'elegant'], weather: 'pleasant', outfitType: 'saree', colors: ['purple', 'pastel'], comfort: 'balanced' }
  }
];

export default function Home() {
  const { 
    navigateTo, 
    savedLooks, 
    setPreferences, 
    generateRecommendationsFromPreferences,
    setActiveWhyLook,
    setActiveCustomizeOutfit,
    userProfile 
  } = useApp();

  const handleLaunchPreset = (preset) => {
    setPreferences(prev => ({ ...prev, ...preset.prefs }));
    generateRecommendationsFromPreferences(preset.prefs);
  };

  return (
    <div className="home-page animate-fade-in" id="home-dashboard">
      
      {/* Editorial Welcome Banner */}
      <section style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 'var(--radius-xl)',
        padding: '3.5rem 3rem',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-md)',
        marginBottom: '3rem',
        position: 'relative',
        overflow: 'hidden',
        background: 'radial-gradient(circle at 80% 20%, #FAF0F6 0%, #FFFFFF 65%)'
      }}>
        <div style={{ maxWidth: '640px', position: 'relative', zIndex: 2 }}>
          <div className="editorial-tag editorial-tag-gold" style={{ marginBottom: '0.6rem' }}>
            <Sparkles size={16} />
            <span>Digital Fashion Intelligence</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
            <img 
              src="/chic-genie-logo.jpeg" 
              alt="Chic Genie" 
              style={{ 
                height: '52px', 
                width: 'auto', 
                objectFit: 'contain',
                flexShrink: 0,
                display: 'block'
              }} 
            />
            <h1 className="font-serif" style={{ fontSize: '2.8rem', lineHeight: '1.2', margin: 0 }}>
              Welcome back to Chic Genie.
            </h1>
          </div>

          <p style={{ fontSize: '1.15rem', color: 'var(--color-text-muted)', marginBottom: '2rem', lineHeight: '1.6' }}>
            Ready to discover your next look? Tell us where you are going, what you feel like wearing, and let our fashion intelligence curate your complete coordinated ensemble.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
            <button 
              id="home-create-look-btn"
              className="btn-primary" 
              style={{ padding: '1rem 2.25rem', fontSize: '1.02rem' }}
              onClick={() => navigateTo('preferences')}
            >
              <Sparkles size={18} />
              <span>✨ Create a Look</span>
            </button>

            <button 
              className="btn-secondary"
              style={{ padding: '1rem 2rem' }}
              onClick={() => navigateTo('stylist')}
            >
              <span>Ask AI Stylist</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* Quick Create Presets Grid */}
      <section style={{ marginBottom: '3.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <span className="editorial-tag" style={{ color: 'var(--color-primary)' }}>One-Tap Styling</span>
            <h2 className="font-serif" style={{ fontSize: '1.8rem', marginTop: '0.2rem' }}>
              Quick Styling Presets
            </h2>
          </div>
          <span style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)' }}>
            Instant curation based on trending occasions
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
          {QUICK_PRESETS.map((preset, idx) => (
            <div 
              key={idx}
              className="summary-card-item"
              style={{
                cursor: 'pointer',
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-lg)',
                padding: '1.5rem',
                border: '1px solid var(--color-border)',
                transition: 'all var(--transition-normal)'
              }}
              onClick={() => handleLaunchPreset(preset)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                <span style={{ fontSize: '2rem' }}>{preset.icon}</span>
                <span className="editorial-tag editorial-tag-gold" style={{ fontSize: '0.72rem' }}>
                  {preset.tag}
                </span>
              </div>

              <h3 style={{ fontSize: '1.15rem', color: 'var(--color-primary)', marginBottom: '0.35rem' }}>
                {preset.title}
              </h3>

              <p style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)', marginBottom: '1rem', lineHeight: '1.4' }}>
                {preset.desc}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-primary)', fontSize: '0.82rem', fontWeight: 600 }}>
                <span>Curate Look</span>
                <ArrowRight size={14} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Style Inspiration & Recent Looks Section */}
      <section style={{ marginBottom: '3.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <span className="editorial-tag editorial-tag-gold">Editorial Gallery</span>
            <h2 className="font-serif" style={{ fontSize: '1.8rem', marginTop: '0.2rem' }}>
              Style Inspiration & Avatars
            </h2>
          </div>

          <button 
            className="btn-ghost"
            onClick={() => navigateTo('saved')}
          >
            <span>View Saved Looks ({savedLooks.length})</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* Gallery Carousel Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '1.5rem' }}>
          {MOCK_OUTFITS.slice(0, 4).map((outfit) => (
            <div 
              key={outfit.id} 
              className="outfit-editorial-card"
              style={{ cursor: 'pointer' }}
              onClick={() => setActiveWhyLook(outfit)}
            >
              <div className="outfit-visual-container">
                <img 
                  src={outfit.avatarUrl} 
                  alt={outfit.name} 
                  className="outfit-avatar-img"
                />
                <span className="category-tag-pill">{outfit.category}</span>
                <div className="match-badge-pill">
                  <Sparkles size={11} color="var(--color-champagne-gold)" />
                  <span>{outfit.preferenceMatch}% match</span>
                </div>
              </div>

              <div style={{ padding: '1.25rem 1.25rem 1rem' }}>
                <h4 className="font-serif" style={{ fontSize: '1.2rem', color: 'var(--color-primary)', marginBottom: '0.25rem' }}>
                  {outfit.name}
                </h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                  {outfit.footwear} · {outfit.bag}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}

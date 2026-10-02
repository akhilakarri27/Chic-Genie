import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Heart, 
  Trash2, 
  Sliders, 
  Sparkles, 
  ExternalLink, 
  Calendar,
  Layers,
  Plus
} from 'lucide-react';

const CATEGORIES = ['All', 'College', 'Work', 'Party', 'Wedding', 'Date', 'Travel', 'Custom'];

export default function SavedLooks() {
  const { savedLooks, unsaveOutfit, setActiveWhyLook, setActiveCustomizeOutfit, navigateTo } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Filter saved looks by category
  const filteredLooks = savedLooks.filter(look => {
    if (selectedCategory === 'All') return true;
    if (selectedCategory === 'Custom') return look.isCustom;
    if (selectedCategory === 'Work') {
      return (look.occasions || []).includes('office') || (look.occasions || []).includes('interview') || (look.category || '').toLowerCase().includes('office');
    }
    const targetKey = selectedCategory.toLowerCase();
    return (look.occasions || []).includes(targetKey) || (look.category || '').toLowerCase().includes(targetKey);
  });

  return (
    <div className="saved-looks-page animate-fade-in" id="saved-looks-page">
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div className="editorial-tag editorial-tag-gold" style={{ marginBottom: '0.4rem' }}>
          <Heart size={15} />
          <span>Curated Wardrobe Collection</span>
        </div>
        <h1 className="font-serif" style={{ fontSize: '2.4rem', marginBottom: '0.5rem' }}>
          My Looks
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '1.02rem', maxWidth: '580px', margin: '0 auto' }}>
          Your saved style recipes, custom edits, and favorite seasonal silhouettes.
        </p>
      </div>

      {/* Category Tabs */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: '0.6rem',
        marginBottom: '2.5rem'
      }}>
        {CATEGORIES.map(cat => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              className={`select-chip ${isActive ? 'selected' : ''}`}
              onClick={() => setSelectedCategory(cat)}
              style={{ fontSize: '0.86rem', padding: '0.55rem 1.1rem' }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredLooks.length === 0 ? (
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-xl)',
          padding: '4rem 2rem',
          textAlign: 'center',
          maxWidth: '540px',
          margin: '0 auto',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: '#FAF2F6',
            color: 'var(--color-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem'
          }}>
            <Heart size={28} />
          </div>
          <h3 className="font-serif" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
            Your style collection is waiting for its first look.
          </h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.94rem', marginBottom: '1.75rem' }}>
            Generate outfits with Chic Genie and tap the heart icon to curate your personal style catalog.
          </p>
          <button 
            className="btn-primary"
            onClick={() => navigateTo('preferences')}
          >
            <Sparkles size={16} />
            <span>Create My First Look</span>
          </button>
        </div>
      ) : (
        /* Saved Looks Gallery Grid */
        <div className="recommendations-grid">
          {filteredLooks.map((look) => (
            <div 
              key={look.id}
              className="outfit-editorial-card"
              style={{ height: '100%' }}
            >
              {/* Visual Avatar */}
              <div className="outfit-visual-container">
                <img 
                  src={look.avatarUrl} 
                  alt={look.name}
                  className="outfit-avatar-img"
                />
                <span className="category-tag-pill">
                  {look.category || (look.isCustom ? 'Custom Creation' : 'Saved')}
                </span>
                <div className="match-badge-pill">
                  <Calendar size={12} color="var(--color-primary)" />
                  <span>{look.dateSaved || 'Saved Look'}</span>
                </div>
              </div>

              {/* Body */}
              <div className="outfit-card-body">
                <h3 className="outfit-title font-serif" style={{ fontSize: '1.35rem' }}>
                  {look.name}
                </h3>

                <div className="outfit-tags-list">
                  {look.tags.map((tag, i) => (
                    <span key={i} className="outfit-tag-item">{tag}</span>
                  ))}
                </div>

                {/* Quick breakdown preview */}
                <div style={{
                  fontSize: '0.84rem',
                  color: 'var(--color-text-muted)',
                  marginBottom: '1.25rem',
                  lineHeight: '1.5',
                  backgroundColor: '#FAF5F8',
                  padding: '0.85rem',
                  borderRadius: 'var(--radius-md)'
                }}>
                  {look.top && <div>• <strong>Top:</strong> {look.top}</div>}
                  {look.bottom && <div>• <strong>Bottom:</strong> {look.bottom}</div>}
                  {look.dress && <div>• <strong>Ensemble:</strong> {look.dress}</div>}
                  <div>• <strong>Footwear:</strong> {look.footwear}</div>
                </div>

                {/* Actions: Open, Customize, Remove */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '0.5rem', marginTop: 'auto' }}>
                  <button 
                    className="btn-secondary"
                    style={{ padding: '0.6rem 0.75rem', fontSize: '0.8rem' }}
                    onClick={() => setActiveWhyLook(look)}
                  >
                    <Sparkles size={14} />
                    <span>Open</span>
                  </button>

                  <button 
                    className="btn-secondary"
                    style={{ padding: '0.6rem 0.75rem', fontSize: '0.8rem' }}
                    onClick={() => setActiveCustomizeOutfit(look)}
                  >
                    <Sliders size={14} />
                    <span>Customize</span>
                  </button>

                  <button 
                    className="btn-ghost"
                    style={{ padding: '0.6rem', color: '#9B3B52' }}
                    onClick={() => unsaveOutfit(look.id)}
                    title="Remove from saved collection"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Heart, 
  Sparkles, 
  Sliders, 
  HelpCircle, 
  Share2, 
  Shirt, 
  Footprints, 
  ShoppingBag, 
  Gem, 
  Watch,
  Check
} from 'lucide-react';

export default function OutfitCard({ outfit, onCustomize, onWhyLook }) {
  const { saveOutfit, isOutfitSaved, showToast, setActiveWhyLook, setActiveCustomizeOutfit } = useApp();
  const [copied, setCopied] = useState(false);

  const isSaved = isOutfitSaved(outfit.id);

  const handleSaveToggle = (e) => {
    e.stopPropagation();
    saveOutfit(outfit);
  };

  const handleShare = (e) => {
    e.stopPropagation();
    const shareText = `✨ Chic Genie Outfit: ${outfit.name}\n` +
      `Breakdown:\n` +
      (outfit.top ? `• Top: ${outfit.top}\n` : '') +
      (outfit.bottom ? `• Bottom: ${outfit.bottom}\n` : '') +
      (outfit.dress ? `• Piece: ${outfit.dress}\n` : '') +
      `• Footwear: ${outfit.footwear}\n` +
      `• Bag: ${outfit.bag}\n` +
      `• Jewellery: ${outfit.jewellery}\n` +
      `Match: ${outfit.preferenceMatch}% preference match by Chic Genie`;

    navigator.clipboard?.writeText(shareText);
    setCopied(true);
    showToast('Outfit curation copied to clipboard!', 'success', '📋');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <article className="outfit-editorial-card" id={`outfit-card-${outfit.id}`}>
      {/* Visual Avatar / Digital Illustration Container */}
      <div className="outfit-visual-container">
        <img 
          src={outfit.avatarUrl} 
          alt={`Faceless fashion illustration avatar for ${outfit.name}`}
          className="outfit-avatar-img"
          loading="lazy"
        />

        {/* Category Pill on top left */}
        <span className="category-tag-pill">
          {outfit.category || 'Editorial Look'}
        </span>

        {/* Preference Match Badge on top right */}
        <div className="match-badge-pill">
          <Sparkles size={12} color="var(--color-champagne-gold)" />
          <span>{outfit.preferenceMatch}% preference match</span>
        </div>
      </div>

      {/* Card Body */}
      <div className="outfit-card-body">
        <h3 className="outfit-title font-serif">
          {outfit.name}
        </h3>

        {/* Tags */}
        <div className="outfit-tags-list">
          {outfit.tags.map((tag, idx) => (
            <span key={idx} className="outfit-tag-item">
              {tag}
            </span>
          ))}
        </div>

        {/* Complete Coordinated Clothing Breakdown */}
        <div className="garments-breakdown-list">
          {/* Top */}
          {outfit.top && (
            <div className="garment-line-item">
              <Shirt size={15} className="garment-line-icon" />
              <div>
                <span className="garment-line-label">Top:</span>
                <span className="garment-line-value">{outfit.top}</span>
              </div>
            </div>
          )}

          {/* Bottom */}
          {outfit.bottom && (
            <div className="garment-line-item">
              <Shirt size={15} className="garment-line-icon" />
              <div>
                <span className="garment-line-label">Bottom:</span>
                <span className="garment-line-value">{outfit.bottom}</span>
              </div>
            </div>
          )}

          {/* Dress / Saree / Jumpsuit */}
          {outfit.dress && (
            <div className="garment-line-item">
              <Sparkles size={15} className="garment-line-icon" />
              <div>
                <span className="garment-line-label">Ensemble:</span>
                <span className="garment-line-value">{outfit.dress}</span>
              </div>
            </div>
          )}

          {/* Footwear */}
          {outfit.footwear && (
            <div className="garment-line-item">
              <Footprints size={15} className="garment-line-icon" />
              <div>
                <span className="garment-line-label">Footwear:</span>
                <span className="garment-line-value">{outfit.footwear}</span>
              </div>
            </div>
          )}

          {/* Bag */}
          {outfit.bag && (
            <div className="garment-line-item">
              <ShoppingBag size={15} className="garment-line-icon" />
              <div>
                <span className="garment-line-label">Bag:</span>
                <span className="garment-line-value">{outfit.bag}</span>
              </div>
            </div>
          )}

          {/* Jewellery */}
          {outfit.jewellery && (
            <div className="garment-line-item">
              <Gem size={15} className="garment-line-icon" />
              <div>
                <span className="garment-line-label">Jewellery:</span>
                <span className="garment-line-value">{outfit.jewellery}</span>
              </div>
            </div>
          )}

          {/* Accessories */}
          {outfit.accessories && (
            <div className="garment-line-item">
              <Watch size={15} className="garment-line-icon" />
              <div>
                <span className="garment-line-label">Finishing:</span>
                <span className="garment-line-value">{outfit.accessories}</span>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons Grid */}
        <div className="outfit-card-actions">
          {/* Why This Look */}
          <button 
            className="btn-secondary" 
            style={{ fontSize: '0.82rem', padding: '0.65rem 0.85rem' }}
            onClick={() => {
              if (onWhyLook) onWhyLook(outfit);
              else setActiveWhyLook(outfit);
            }}
          >
            <HelpCircle size={15} />
            <span>Why this look?</span>
          </button>

          {/* Customize */}
          <button 
            className="btn-secondary" 
            style={{ fontSize: '0.82rem', padding: '0.65rem 0.85rem' }}
            onClick={() => {
              if (onCustomize) onCustomize(outfit);
              else setActiveCustomizeOutfit(outfit);
            }}
          >
            <Sliders size={15} />
            <span>Customize</span>
          </button>

          {/* Save & Share */}
          <button 
            className={`btn-primary btn-card-save`}
            style={{ 
              backgroundColor: isSaved ? '#5C246B' : 'var(--color-primary)',
              fontSize: '0.88rem',
              padding: '0.75rem 1.25rem'
            }}
            onClick={handleSaveToggle}
          >
            <Heart size={16} fill={isSaved ? "#FFFFFF" : "none"} />
            <span>{isSaved ? 'Saved to My Looks' : '💖 Save This Look'}</span>
          </button>
        </div>

      </div>
    </article>
  );
}

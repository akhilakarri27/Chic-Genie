import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Sparkles, 
  Heart, 
  Shirt, 
  Footprints, 
  ShoppingBag, 
  Gem, 
  Watch, 
  Palette, 
  RotateCcw, 
  Save,
  Check
} from 'lucide-react';

const GARMENT_OPTIONS = {
  tops: [
    'Blush pink oversized organic linen shirt',
    'Crisp white relaxed poplin button-down',
    'Ivory silk camisole with delicate lace trim',
    'Dusty lilac cropped fine-knit cardigan',
    'Tailored sleeveless vest waistcoat in oatmeal',
    'Black ribbed fine knit mockneck top',
    'Chanderi silk embroidered tunic kurti'
  ],
  bottoms: [
    'Classic light-wash straight-leg denim jeans',
    'High-waisted wide-leg pleated trousers in sand',
    'Deep plum tailored wide-leg trousers',
    'Muted olive utility cargo trousers with pleated pockets',
    'Flared ivory mulmul palazzos with scalloped hem',
    'Knife-pleated flowy midi skirt in soft cream',
    'Tailored dark indigo raw denim jeans'
  ],
  dresses: [
    'Dusty rose bias-cut fluid silk satin midi slip dress',
    'Pastel lavender Banarasi organza silk saree with gold zari',
    'Tailored deep plum velvet plunging cocktail jumpsuit',
    'Tiered linen resort maxi dress in warm ivory'
  ],
  footwear: [
    'Clean white minimalist leather sneakers',
    'Delicate metallic champagne gold strappy kitten heels',
    'Polished deep burgundy horsebit leather loafers',
    'Minimalistic tan Italian leather slide sandals',
    'Dainty blush pink patent ballet flats with bow',
    'Designer chunky multi-tone luxury running sneakers',
    'Champagne gold hand-embroidered pearl juttis',
    'Black leather pointed ankle boots with block heel'
  ],
  bags: [
    'Sand beige structured leather shoulder bag',
    'Rich cognac brown structured leather work tote',
    'Champagne silk mini clutch with fine gold chain',
    'Handwoven natural raffia basket tote with leather handles',
    'Pastel pink miniature structured crossbody bag',
    'Sleek black boxy leather crossbody bag with wide strap',
    'Handcrafted ivory pearl and sequin potli bag'
  ],
  jewellery: [
    'Delicate 18k gold pendant chain & small hoop earrings',
    'Triple-layered freshwater pearl and fine gold chain necklace',
    'Thick gold snake chain necklace & chunky hoop earrings',
    'Antique gold temple jhumkas & layered polki bangles',
    'Antique rose gold jhumkis with tiny pearl drops',
    'Cascading crystal chandelier statement drop earrings',
    'Minimalist sterling silver huggies & thin band ring'
  ],
  accessories: [
    'Stacked minimalist gold rings & fine leather belt',
    'Oversized tortoise-shell cat-eye sunglasses',
    'Champagne gold luxury link bracelet watch',
    'Deep black narrow cat-eye sunglasses & baseball cap',
    'Slender champagne gold metallic waist-cinch belt',
    'Sheer gossamer chiffon dupatta with fine scalloped zari',
    'Soft silk hair ribbon & sheer ankle socks'
  ]
};

export default function CustomizeModal() {
  const { activeCustomizeOutfit, setActiveCustomizeOutfit, saveCustomizedOutfit, showToast } = useApp();
  const [editedOutfit, setEditedOutfit] = useState(null);
  const [activeTab, setActiveTab] = useState('pieces'); // 'pieces' or 'transforms'

  useEffect(() => {
    if (activeCustomizeOutfit) {
      setEditedOutfit({ ...activeCustomizeOutfit });
    }
  }, [activeCustomizeOutfit]);

  if (!activeCustomizeOutfit || !editedOutfit) return null;

  // Handle single item replacement while preserving all other elements
  const handlePieceChange = (field, value) => {
    setEditedOutfit(prev => ({
      ...prev,
      [field]: value
    }));
    showToast(`Updated ${field}`, 'info', '✨');
  };

  // Quick Style Transformations
  const applyQuickTransform = (transformType, label) => {
    const transforms = editedOutfit.quickTransforms;
    if (transforms && transforms[transformType]) {
      const target = transforms[transformType];
      setEditedOutfit(prev => ({
        ...prev,
        ...target,
        tags: [label, ...prev.tags.slice(0, 2)]
      }));
      showToast(`Transformed look: ${label}`, 'success', '🪄');
    } else {
      // Fallback transformation logic
      showToast(`Applied ${label} styling cues`, 'success', '🪄');
    }
  };

  const handleSaveCustom = () => {
    saveCustomizedOutfit(editedOutfit);
  };

  const handleReset = () => {
    setEditedOutfit({ ...activeCustomizeOutfit });
    showToast('Reset to original curation', 'info', '🔄');
  };

  return (
    <div 
      className="modal-backdrop-overlay"
      onClick={() => setActiveCustomizeOutfit(null)}
      role="dialog"
      aria-modal="true"
      aria-labelledby="customize-title"
    >
      <div 
        className="modal-content-window customizer-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          className="modal-close-btn"
          onClick={() => setActiveCustomizeOutfit(null)}
          aria-label="Close outfit customizer"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.35rem' }}>
          <Sparkles size={16} color="var(--color-champagne-gold)" />
          <span className="editorial-tag editorial-tag-gold">Interactive Styling Studio</span>
        </div>

        <h2 id="customize-title" className="font-serif" style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>
          Customize Your Look
        </h2>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
          Fine-tune individual garments or apply instant high-fashion style transformations.
        </p>

        {/* Quick Style Transformation Bar */}
        <div style={{ margin: '1.25rem 0 0.5rem' }}>
          <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, color: 'var(--color-primary)' }}>
            🪄 Quick Style Transformations:
          </span>
          <div className="quick-transforms-row">
            <button 
              className="transform-chip-btn"
              onClick={() => applyQuickTransform('trendier', 'Trendier')}
            >
              ✨ Make it Trendier
            </button>
            <button 
              className="transform-chip-btn"
              onClick={() => applyQuickTransform('cuter', 'Cuter')}
            >
              🌸 Make it Cuter
            </button>
            <button 
              className="transform-chip-btn"
              onClick={() => applyQuickTransform('more_elegant', 'More Elegant')}
            >
              ✨ Make it More Elegant
            </button>
            <button 
              className="transform-chip-btn"
              onClick={() => applyQuickTransform('more_minimal', 'More Minimal')}
            >
              🌿 Make it More Minimal
            </button>
            <button 
              className="transform-chip-btn"
              onClick={() => applyQuickTransform('more_casual', 'More Casual')}
            >
              😎 Make it More Casual
            </button>
            <button 
              className="transform-chip-btn"
              onClick={() => applyQuickTransform('more_formal', 'More Formal')}
            >
              💼 Make it More Formal
            </button>
          </div>
        </div>

        {/* Layout: Avatar Preview on Left & Customizable Selectors on Right */}
        <div className="customizer-layout-grid">
          {/* Avatar & Current Selection Card */}
          <div style={{
            backgroundColor: '#FAF5F8',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem',
            border: '1px solid var(--color-border)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center'
          }}>
            <div style={{
              width: '100%',
              paddingTop: '125%',
              position: 'relative',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              backgroundColor: '#FFFFFF',
              marginBottom: '1rem',
              border: '1px solid var(--color-border)'
            }}>
              <img 
                src={editedOutfit.avatarUrl} 
                alt={editedOutfit.name}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </div>

            <h4 style={{ fontSize: '1.15rem', color: 'var(--color-primary)', marginBottom: '0.35rem' }}>
              {editedOutfit.name}
            </h4>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-champagne-gold)', fontWeight: 600 }}>
              {editedOutfit.preferenceMatch}% Harmonized Match
            </span>
          </div>

          {/* Selectors Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '420px', overflowY: 'auto', paddingRight: '0.5rem' }}>
            
            {/* Top / Upper Layer */}
            {editedOutfit.top && (
              <div className="garment-selector-group">
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-primary)', display: 'block', marginBottom: '0.3rem' }}>
                  👚 Top / Upper Garment:
                </label>
                <select 
                  value={editedOutfit.top}
                  onChange={(e) => handlePieceChange('top', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                    backgroundColor: '#FAF6F9',
                    fontSize: '0.85rem',
                    color: 'var(--color-text-main)'
                  }}
                >
                  <option value={editedOutfit.top}>{editedOutfit.top} (Current)</option>
                  {GARMENT_OPTIONS.tops.filter(t => t !== editedOutfit.top).map((top, idx) => (
                    <option key={idx} value={top}>{top}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Bottom */}
            {editedOutfit.bottom && (
              <div className="garment-selector-group">
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-primary)', display: 'block', marginBottom: '0.3rem' }}>
                  👖 Bottom / Trousers / Skirt:
                </label>
                <select 
                  value={editedOutfit.bottom}
                  onChange={(e) => handlePieceChange('bottom', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                    backgroundColor: '#FAF6F9',
                    fontSize: '0.85rem',
                    color: 'var(--color-text-main)'
                  }}
                >
                  <option value={editedOutfit.bottom}>{editedOutfit.bottom} (Current)</option>
                  {GARMENT_OPTIONS.bottoms.filter(b => b !== editedOutfit.bottom).map((bottom, idx) => (
                    <option key={idx} value={bottom}>{bottom}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Dress / Saree (if applicable) */}
            {editedOutfit.dress && (
              <div className="garment-selector-group">
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-primary)', display: 'block', marginBottom: '0.3rem' }}>
                  👗 Dress / Saree / Jumpsuit:
                </label>
                <select 
                  value={editedOutfit.dress}
                  onChange={(e) => handlePieceChange('dress', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                    backgroundColor: '#FAF6F9',
                    fontSize: '0.85rem',
                    color: 'var(--color-text-main)'
                  }}
                >
                  <option value={editedOutfit.dress}>{editedOutfit.dress} (Current)</option>
                  {GARMENT_OPTIONS.dresses.filter(d => d !== editedOutfit.dress).map((dress, idx) => (
                    <option key={idx} value={dress}>{dress}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Footwear */}
            <div className="garment-selector-group">
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-primary)', display: 'block', marginBottom: '0.3rem' }}>
                👟 Footwear:
              </label>
              <select 
                value={editedOutfit.footwear}
                onChange={(e) => handlePieceChange('footwear', e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  backgroundColor: '#FAF6F9',
                  fontSize: '0.85rem',
                  color: 'var(--color-text-main)'
                }}
              >
                <option value={editedOutfit.footwear}>{editedOutfit.footwear} (Current)</option>
                {GARMENT_OPTIONS.footwear.filter(f => f !== editedOutfit.footwear).map((shoe, idx) => (
                  <option key={idx} value={shoe}>{shoe}</option>
                ))}
              </select>
            </div>

            {/* Bag */}
            <div className="garment-selector-group">
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-primary)', display: 'block', marginBottom: '0.3rem' }}>
                👜 Handbag & Totes:
              </label>
              <select 
                value={editedOutfit.bag}
                onChange={(e) => handlePieceChange('bag', e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  backgroundColor: '#FAF6F9',
                  fontSize: '0.85rem',
                  color: 'var(--color-text-main)'
                }}
              >
                <option value={editedOutfit.bag}>{editedOutfit.bag} (Current)</option>
                {GARMENT_OPTIONS.bags.filter(b => b !== editedOutfit.bag).map((bag, idx) => (
                  <option key={idx} value={bag}>{bag}</option>
                ))}
              </select>
            </div>

            {/* Jewellery */}
            <div className="garment-selector-group">
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-primary)', display: 'block', marginBottom: '0.3rem' }}>
                💍 Jewellery & Neckpieces:
              </label>
              <select 
                value={editedOutfit.jewellery}
                onChange={(e) => handlePieceChange('jewellery', e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  backgroundColor: '#FAF6F9',
                  fontSize: '0.85rem',
                  color: 'var(--color-text-main)'
                }}
              >
                <option value={editedOutfit.jewellery}>{editedOutfit.jewellery} (Current)</option>
                {GARMENT_OPTIONS.jewellery.filter(j => j !== editedOutfit.jewellery).map((jewel, idx) => (
                  <option key={idx} value={jewel}>{jewel}</option>
                ))}
              </select>
            </div>

            {/* Accessories */}
            <div className="garment-selector-group">
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-primary)', display: 'block', marginBottom: '0.3rem' }}>
                🕶️ Finishing Accessories:
              </label>
              <select 
                value={editedOutfit.accessories}
                onChange={(e) => handlePieceChange('accessories', e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  backgroundColor: '#FAF6F9',
                  fontSize: '0.85rem',
                  color: 'var(--color-text-main)'
                }}
              >
                <option value={editedOutfit.accessories}>{editedOutfit.accessories} (Current)</option>
                {GARMENT_OPTIONS.accessories.filter(a => a !== editedOutfit.accessories).map((acc, idx) => (
                  <option key={idx} value={acc}>{acc}</option>
                ))}
              </select>
            </div>

          </div>
        </div>

        {/* Action Footer */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '1px solid var(--color-border)',
          paddingTop: '1.25rem',
          marginTop: '0.5rem'
        }}>
          <button 
            className="btn-ghost"
            onClick={handleReset}
          >
            <RotateCcw size={15} />
            <span>Reset Look</span>
          </button>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button 
              className="btn-secondary"
              onClick={() => setActiveCustomizeOutfit(null)}
            >
              Cancel
            </button>
            <button 
              className="btn-primary"
              onClick={handleSaveCustom}
            >
              <Save size={16} />
              <span>Save Customized Look</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

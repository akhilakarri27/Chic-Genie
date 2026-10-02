import React from 'react';
import BrandLogo from './BrandLogo';
import { useApp } from '../context/AppContext';
import { Sparkles } from 'lucide-react';

export default function OpeningScreen() {
  const { navigateTo } = useApp();

  const handleBeginStyling = () => {
    // Navigates to the body shape selection experience
    navigateTo('bodyshape');
  };

  return (
    <main className="opening-hero-screen" id="opening-screen" role="main">
      <div className="opening-hero-content">
        {/* Large Centered Brand Logo with Subtle Entrance Animation */}
        <div className="opening-logo-wrapper">
          <BrandLogo variant="hero" />
        </div>

        {/* Subtle Brand Tagline */}
        <p className="opening-tagline">
          Your personal fashion genie.
        </p>

        {/* Primary Action Button & Subtext */}
        <div className="opening-action-wrapper">
          <button 
            id="begin-styling-button"
            className="btn-begin-styling"
            onClick={handleBeginStyling}
            aria-label="Begin personal styling journey"
          >
            <Sparkles size={18} className="editorial-tag-gold" />
            <span>✨ Begin Styling</span>
          </button>
          
          <span className="opening-subtext">
            Discover looks made for you.
          </span>
        </div>
      </div>

      <div className="opening-badge">
        Fashion Intelligence · Since 2026
      </div>
    </main>
  );
}

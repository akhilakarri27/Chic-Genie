import React from 'react';

/**
 * Official Chic Genie Brand Logo Component
 * Preserves the official brand asset, proportions, typography and illustration
 */
export default function BrandLogo({ variant = 'nav', onClick, className = '' }) {
  const logoSrc = '/chic-genie-logo.jpeg';

  let sizeClass = 'brand-logo-nav';
  if (variant === 'hero') {
    sizeClass = 'brand-logo-hero';
  } else if (variant === 'small') {
    sizeClass = 'brand-logo-sm';
  }

  return (
    <div 
      className={`brand-logo-container ${className}`} 
      onClick={onClick}
      role={onClick ? "button" : undefined}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      title="Chic Genie — Since 2026"
    >
      <img
        src={logoSrc}
        alt="Chic Genie — Since 2026 Official Logo"
        className={`brand-logo-img ${sizeClass}`}
        loading="eager"
      />
    </div>
  );
}

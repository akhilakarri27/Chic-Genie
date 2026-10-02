import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, ArrowRight, Check, Sparkles, ShieldCheck } from 'lucide-react';

/**
 * Clean, stylized, faceless haute-couture fashion silhouettes
 */
function FashionSilhouette({ type, isSelected }) {
  const primaryPlum = '#321044';
  const dustyRose = '#D9A9BE';
  const champagneGold = '#C7A56A';
  const softFill = isSelected ? '#F6EBF3' : '#FDF7FB';
  const strokeColor = isSelected ? primaryPlum : '#5A3D66';
  const accentColor = isSelected ? champagneGold : '#C9A0B8';

  const renderSilhouettePath = () => {
    switch (type) {
      case 'hourglass':
        // Balanced shoulders & hips, clearly defined cinched waist
        return (
          <>
            {/* Torso & Body */}
            <path
              d="
                M 33 36 
                C 33 46, 35 52, 42 66 
                C 35 80, 29 86, 30 102 
                C 31 118, 36 142, 40 162 
                C 43 162, 47 162, 47 162 
                C 46 138, 48 112, 50 96 
                C 52 112, 54 138, 53 162 
                C 53 162, 57 162, 60 162 
                C 64 142, 69 118, 70 102 
                C 71 86, 65 80, 58 66 
                C 65 52, 67 46, 67 36 
                Z
              "
              fill={softFill}
              stroke={strokeColor}
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            {/* Subtle high-fashion waist definition accent */}
            <path
              d="M 40 66 Q 50 70 60 66"
              stroke={accentColor}
              strokeWidth="1.4"
              strokeDasharray="2 2"
              fill="none"
            />
            {/* Subtle shoulder & hip balance guide */}
            <path
              d="M 33 36 L 67 36"
              stroke={accentColor}
              strokeWidth="0.8"
              opacity="0.4"
            />
            <path
              d="M 30 100 L 70 100"
              stroke={accentColor}
              strokeWidth="0.8"
              opacity="0.4"
            />
          </>
        );

      case 'pear':
        // Slender shoulders/bust widening to gracefully fuller hips
        return (
          <>
            <path
              d="
                M 38 36 
                C 38 46, 39 54, 43 66 
                C 38 78, 25 86, 26 102 
                C 27 118, 33 142, 38 162 
                C 41 162, 46 162, 46 162 
                C 45 138, 48 112, 50 96 
                C 52 112, 55 138, 54 162 
                C 54 162, 59 162, 62 162 
                C 67 142, 73 118, 74 102 
                C 75 86, 62 78, 57 66 
                C 61 54, 62 46, 62 36 
                Z
              "
              fill={softFill}
              stroke={strokeColor}
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            {/* Subtle pear silhouette accent curves */}
            <path
              d="M 38 36 L 62 36"
              stroke={accentColor}
              strokeWidth="0.8"
              opacity="0.4"
            />
            <path
              d="M 26 100 L 74 100"
              stroke={accentColor}
              strokeWidth="0.8"
              opacity="0.4"
            />
          </>
        );

      case 'rectangle':
        // Balanced shoulders, waist, and hips in clean sleek proportion
        return (
          <>
            <path
              d="
                M 34 36 
                C 34 46, 35 54, 36 66 
                C 36 78, 34 86, 35 102 
                C 36 118, 38 142, 41 162 
                C 44 162, 48 162, 48 162 
                C 47 138, 49 112, 50 96 
                C 51 112, 53 138, 52 162 
                C 52 162, 56 162, 59 162 
                C 62 142, 64 118, 65 102 
                C 66 86, 64 78, 64 66 
                C 65 54, 66 46, 66 36 
                Z
              "
              fill={softFill}
              stroke={strokeColor}
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            {/* Subtle column proportion guide */}
            <path
              d="M 34 36 L 66 36"
              stroke={accentColor}
              strokeWidth="0.8"
              opacity="0.4"
            />
            <path
              d="M 36 66 L 64 66"
              stroke={accentColor}
              strokeWidth="0.8"
              opacity="0.4"
            />
            <path
              d="M 35 100 L 65 100"
              stroke={accentColor}
              strokeWidth="0.8"
              opacity="0.4"
            />
          </>
        );

      case 'inverted_triangle':
        // Broader structured shoulders tapering elegantly towards narrower hips
        return (
          <>
            <path
              d="
                M 29 36 
                C 31 46, 34 54, 38 66 
                C 38 78, 37 86, 38 102 
                C 39 118, 40 142, 42 162 
                C 45 162, 48 162, 48 162 
                C 47 138, 49 112, 50 96 
                C 51 112, 53 138, 52 162 
                C 52 162, 55 162, 58 162 
                C 60 142, 61 118, 62 102 
                C 63 86, 62 78, 62 66 
                C 66 54, 69 46, 71 36 
                Z
              "
              fill={softFill}
              stroke={strokeColor}
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            {/* Subtle structured shoulder guide */}
            <path
              d="M 29 36 L 71 36"
              stroke={accentColor}
              strokeWidth="0.8"
              opacity="0.4"
            />
            <path
              d="M 38 100 L 62 100"
              stroke={accentColor}
              strokeWidth="0.8"
              opacity="0.4"
            />
          </>
        );

      case 'oval':
        // Soft rounded curves with gracefully fuller midsection and balanced limbs
        return (
          <>
            <path
              d="
                M 35 36 
                C 33 46, 28 54, 28 68 
                C 28 82, 33 88, 34 102 
                C 35 118, 38 142, 41 162 
                C 44 162, 48 162, 48 162 
                C 47 138, 49 112, 50 96 
                C 51 112, 53 138, 52 162 
                C 52 162, 56 162, 59 162 
                C 62 142, 65 118, 66 102 
                C 67 88, 72 82, 72 68 
                C 72 54, 67 46, 65 36 
                Z
              "
              fill={softFill}
              stroke={strokeColor}
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            {/* Soft oval contour accent */}
            <path
              d="M 35 36 L 65 36"
              stroke={accentColor}
              strokeWidth="0.8"
              opacity="0.4"
            />
            <path
              d="M 28 68 Q 50 74 72 68"
              stroke={accentColor}
              strokeWidth="1.2"
              strokeDasharray="2 2"
              fill="none"
            />
          </>
        );

      default:
        return null;
    }
  };

  return (
    <svg
      viewBox="0 0 100 176"
      width="100%"
      height="145"
      style={{ overflow: 'visible' }}
      aria-hidden="true"
    >
      <defs>
        <filter id={`shadow-${type}`} x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#321044" floodOpacity="0.08" />
        </filter>
      </defs>

      {/* Head & Neck (Faceless Minimalist Fashion Mannequin) */}
      <g id="head-neck">
        {/* Head */}
        <ellipse
          cx="50"
          cy="18"
          rx="6.5"
          ry="9"
          fill={softFill}
          stroke={strokeColor}
          strokeWidth="1.5"
        />
        {/* Neck */}
        <path
          d="M 47.5 26.5 L 47.5 32 M 52.5 26.5 L 52.5 32"
          stroke={strokeColor}
          strokeWidth="1.4"
        />
        {/* Subtle Collarbone */}
        <path
          d="M 44 34 Q 50 36 56 34"
          stroke={accentColor}
          strokeWidth="1.2"
          fill="none"
        />
      </g>

      {/* Body Silhouette */}
      <g id="silhouette-torso" filter={`url(#shadow-${type})`}>
        {renderSilhouettePath()}
      </g>
    </svg>
  );
}

const BODY_SHAPES = [
  {
    id: 'hourglass',
    name: 'Hourglass',
    description: 'Balanced shoulders and hips with a more defined waist.',
    type: 'hourglass'
  },
  {
    id: 'pear',
    name: 'Pear / Triangle',
    description: 'Hips appear proportionally wider than the shoulders.',
    type: 'pear'
  },
  {
    id: 'rectangle',
    name: 'Rectangle',
    description: 'Shoulders, waist and hips appear relatively similar in proportion.',
    type: 'rectangle'
  },
  {
    id: 'inverted_triangle',
    name: 'Inverted Triangle',
    description: 'Shoulders appear proportionally wider than the hips.',
    type: 'inverted_triangle'
  },
  {
    id: 'oval',
    name: 'Oval / Round',
    description: 'The midsection appears fuller relative to the shoulders and hips.',
    type: 'oval'
  }
];

export default function BodyShapeSelection() {
  const { bodyShape, setBodyShape, navigateTo } = useApp();
  const [selectedShape, setSelectedShape] = useState(bodyShape || '');

  const handleSelect = (shapeId) => {
    setSelectedShape(shapeId);
    setBodyShape(shapeId);
  };

  const handleContinue = () => {
    if (selectedShape) {
      setBodyShape(selectedShape);
      navigateTo('preferences');
    }
  };

  const handleBack = () => {
    navigateTo('opening');
  };

  return (
    <div className="bodyshape-selection-page animate-fade-in" id="body-shape-selection-page">
      {/* Subtle Progress Indicator */}
      <div className="bodyshape-stepper-container" aria-label="Styling Progress">
        <div className="bodyshape-step active">
          <span className="bodyshape-step-badge">01</span>
          <span className="bodyshape-step-label">Body Shape</span>
        </div>
        <div className="bodyshape-step-line" />
        <div className="bodyshape-step">
          <span className="bodyshape-step-badge">02</span>
          <span className="bodyshape-step-label">Preferences</span>
        </div>
        <div className="bodyshape-step-line" />
        <div className="bodyshape-step">
          <span className="bodyshape-step-badge">03</span>
          <span className="bodyshape-step-label">Your Look</span>
        </div>
      </div>

      {/* Main Heading & Editorial Copy */}
      <div className="bodyshape-header-section">
        <div className="editorial-tag editorial-tag-gold" style={{ marginBottom: '0.5rem' }}>
          <Sparkles size={14} />
          <span>Personal Silhouette</span>
        </div>

        <h1 className="font-serif bodyshape-title">
          Let's find your fit.
        </h1>

        <p className="bodyshape-subtitle">
          Everyone has a unique shape. Choose the silhouette that feels most like you so Chic Genie can personalize your outfit suggestions.
        </p>

        {/* Small Supporting Note */}
        <div className="bodyshape-optional-note">
          <ShieldCheck size={14} color="var(--color-champagne-gold)" />
          <span>This is completely optional and based on your own selection. Chic Genie does not analyze or judge your body.</span>
        </div>
      </div>

      {/* Five Body Shape Cards */}
      <div className="bodyshape-grid" role="radiogroup" aria-label="Body Shape Options">
        {BODY_SHAPES.map((shape) => {
          const isSelected = selectedShape === shape.id;
          return (
            <div
              key={shape.id}
              id={`shape-card-${shape.id}`}
              className={`bodyshape-card ${isSelected ? 'selected' : ''}`}
              onClick={() => handleSelect(shape.id)}
              role="radio"
              aria-checked={isSelected}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleSelect(shape.id);
                }
              }}
            >
              {/* Faceless Fashion Avatar / Silhouette */}
              <div className="bodyshape-avatar-container">
                <FashionSilhouette type={shape.type} isSelected={isSelected} />
              </div>

              {/* Body Shape Name */}
              <h3 className="bodyshape-card-title font-serif">
                {shape.name}
              </h3>

              {/* Short Description */}
              <p className="bodyshape-card-desc">
                {shape.description}
              </p>

              {/* Selection Indicator */}
              <div className="bodyshape-radio-indicator" aria-hidden="true">
                {isSelected ? (
                  <Check size={14} strokeWidth={3} />
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Navigation Buttons */}
      <div className="bodyshape-footer-nav">
        <button
          id="bodyshape-back-button"
          className="btn-secondary"
          onClick={handleBack}
          aria-label="Back to opening screen"
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>

        <button
          id="bodyshape-continue-button"
          className="btn-primary"
          onClick={handleContinue}
          disabled={!selectedShape}
          style={{
            opacity: selectedShape ? 1 : 0.45,
            cursor: selectedShape ? 'pointer' : 'not-allowed',
            padding: '0.95rem 2.5rem'
          }}
          aria-label="Continue to preferences"
        >
          <span>Continue</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}

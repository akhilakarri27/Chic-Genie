import React from 'react';
import { useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import OpeningScreen from './components/OpeningScreen';
import BodyShapeSelection from './pages/BodyShapeSelection';
import Home from './pages/Home';
import PreferencesWizard from './pages/PreferencesWizard';
import Recommendations from './pages/Recommendations';
import SavedLooks from './pages/SavedLooks';
import MyStyle from './pages/MyStyle';
import AIStylist from './pages/AIStylist';
import Profile from './pages/Profile';
import WhyThisLookModal from './components/WhyThisLookModal';
import CustomizeModal from './components/CustomizeModal';
import Toast from './components/Toast';

export default function App() {
  const { currentRoute } = useApp();

  return (
    <div className="app-container">
      {/* Global Toast System */}
      <Toast />

      {/* Global Modals */}
      <WhyThisLookModal />
      <CustomizeModal />

      {/* Main Navigation (Visible on all pages except the opening screen) */}
      <Navbar />

      {/* Content Area */}
      {currentRoute === 'opening' ? (
        <OpeningScreen />
      ) : (
        <main className="main-content">
          {currentRoute === 'bodyshape' && <BodyShapeSelection />}
          {currentRoute === 'home' && <Home />}
          {currentRoute === 'preferences' && <PreferencesWizard />}
          {currentRoute === 'recommendations' && <Recommendations />}
          {currentRoute === 'saved' && <SavedLooks />}
          {currentRoute === 'style' && <MyStyle />}
          {currentRoute === 'stylist' && <AIStylist />}
          {currentRoute === 'profile' && <Profile />}
        </main>
      )}

      {/* Editorial Footer (Visible on inner pages) */}
      {currentRoute !== 'opening' && (
        <footer style={{
          borderTop: '1px solid var(--color-border)',
          backgroundColor: '#FFFFFF',
          padding: '2.5rem 1.5rem',
          textAlign: 'center',
          color: 'var(--color-text-muted)',
          fontSize: '0.85rem'
        }}>
          <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
            <span className="editorial-tag editorial-tag-gold" style={{ fontSize: '0.75rem' }}>
              CHIC GENIE · SINCE 2026
            </span>
            <p style={{ maxWidth: '520px' }}>
              Faceless Fashion Intelligence & Bespoke Wardrobe Curation. Designed with quiet luxury aesthetics.
            </p>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-light)' }}>
              © 2026 Chic Genie. All rights reserved.
            </span>
          </div>
        </footer>
      )}
    </div>
  );
}

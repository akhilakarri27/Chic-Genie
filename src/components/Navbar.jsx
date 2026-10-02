import React, { useState } from 'react';
import BrandLogo from './BrandLogo';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, 
  Heart, 
  Compass, 
  User, 
  MessageSquare, 
  Menu, 
  X, 
  SlidersHorizontal, 
  Home as HomeIcon 
} from 'lucide-react';

export default function Navbar() {
  const { currentRoute, navigateTo, savedLooks, userProfile } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // If we are on opening screen, navbar is hidden
  if (currentRoute === 'opening') {
    return null;
  }

  const handleNav = (route) => {
    navigateTo(route);
    setMobileMenuOpen(false);
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: <HomeIcon size={16} /> },
    { id: 'preferences', label: 'Create Look', icon: <Sparkles size={16} /> },
    { id: 'saved', label: 'Saved Looks', icon: <Heart size={16} />, badge: savedLooks.length },
    { id: 'style', label: 'My Style', icon: <SlidersHorizontal size={16} /> },
    { id: 'stylist', label: 'AI Stylist', icon: <MessageSquare size={16} /> },
  ];

  return (
    <header className="navbar-header" id="main-navigation">
      <nav className="navbar-container" aria-label="Main Navigation">
        {/* Left: Official Brand Logo */}
        <div className="nav-left">
          <BrandLogo 
            variant="nav" 
            onClick={() => handleNav('home')} 
          />
        </div>

        {/* Center: Desktop Navigation Links */}
        <div className="nav-links-center">
          {navItems.map((item) => {
            const isActive = currentRoute === item.id || 
              (item.id === 'preferences' && currentRoute === 'recommendations');
            return (
              <button
                key={item.id}
                id={`nav-link-${item.id}`}
                className={`nav-link-item ${isActive ? 'active' : ''}`}
                onClick={() => handleNav(item.id)}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="saved-count-pill">{item.badge}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right: Quick Action & Profile */}
        <div className="nav-right">
          <button 
            id="nav-profile-button"
            className="nav-profile-btn" 
            onClick={() => handleNav('profile')}
            title={`${userProfile.name}'s Profile`}
            aria-label="User Profile"
          >
            {userProfile.avatarText || 'CG'}
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            id="mobile-menu-toggle"
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-nav-drawer" role="dialog" aria-label="Mobile Navigation Drawer">
          {navItems.map((item) => {
            const isActive = currentRoute === item.id;
            return (
              <button
                key={item.id}
                className={`mobile-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => handleNav(item.id)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="saved-count-pill">{item.badge}</span>
                )}
              </button>
            );
          })}
          
          <button
            className={`mobile-nav-item ${currentRoute === 'profile' ? 'active' : ''}`}
            onClick={() => handleNav('profile')}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <User size={16} />
              <span>Profile & Settings</span>
            </div>
          </button>
        </div>
      )}
    </header>
  );
}

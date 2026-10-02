import React from 'react';
import { useApp } from '../context/AppContext';
import {
  User,
  Mail,
  Heart,
  Sparkles,
  Sliders,
  Bell,
  Eye,
  Shield,
  Info,
  Edit2,
  CheckCircle2
} from 'lucide-react';

export default function Profile() {
  const { userProfile, setUserProfile, savedLooks, navigateTo, showToast } = useApp();

  const handleToggleNotification = () => {
    setUserProfile(prev => ({
      ...prev,
      notificationsEnabled: !prev.notificationsEnabled
    }));
    showToast('Updated notification preferences', 'info', '🔔');
  };

  return (
    <div className="profile-page animate-fade-in" id="user-profile-page" style={{ maxWidth: '820px', margin: '0 auto' }}>

      {/* Profile Header Card */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 'var(--radius-xl)',
        padding: '2.5rem',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-md)',
        marginBottom: '2rem',
        display: 'flex',
        alignItems: 'center',
        gap: '2rem',
        flexWrap: 'wrap'
      }}>
        {/* Avatar Placeholder */}
        <div style={{
          width: '90px',
          height: '90px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))',
          color: '#FFFFFF',
          fontSize: '2rem',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '3px solid #FFFFFF',
          boxShadow: 'var(--shadow-sm)',
          flexShrink: 0
        }}>
          {userProfile.avatarText || 'TG'}
        </div>

        {/* User Info */}
        <div style={{ flex: 1, minWidth: '220px' }}>
          <div className="editorial-tag editorial-tag-gold" style={{ marginBottom: '0.2rem' }}>
            <span>Chic Genie Member · Since {userProfile.memberSince}</span>
          </div>
          <h1 className="font-serif" style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>
            {userProfile.name}
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Mail size={14} />
            <span>{userProfile.email}</span>
          </p>
        </div>

        {/* Saved Count Badge */}
        <button
          className="btn-secondary"
          onClick={() => navigateTo('saved')}
        >
          <Heart size={16} color="var(--color-primary)" fill="var(--color-dusty-rose)" />
          <span><strong>{savedLooks.length}</strong> Looks Saved</span>
        </button>
      </div>

      {/* Style Identity Summary Card */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 'var(--radius-xl)',
        padding: '2rem 2.25rem',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-sm)',
        marginBottom: '2rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <h3 className="font-serif" style={{ fontSize: '1.35rem' }}>
            Style Identity & Preferences
          </h3>
          <button className="btn-ghost" onClick={() => navigateTo('preferences')}>
            <Edit2 size={14} />
            <span>Edit Recipe</span>
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
          <div style={{ backgroundColor: '#FAF5F8', padding: '1.15rem', borderRadius: 'var(--radius-md)' }}>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.2rem' }}>
              Favorite Aesthetic
            </span>
            <strong style={{ color: 'var(--color-primary)', fontSize: '0.98rem' }}>
              {userProfile.favoriteStyle}
            </strong>
          </div>

          <div style={{ backgroundColor: '#FAF5F8', padding: '1.15rem', borderRadius: 'var(--radius-md)' }}>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.2rem' }}>
              Style Archetype
            </span>
            <strong style={{ color: 'var(--color-primary)', fontSize: '0.92rem' }}>
              {userProfile.archetype}
            </strong>
          </div>

          <div style={{ backgroundColor: '#FAF5F8', padding: '1.15rem', borderRadius: 'var(--radius-md)', gridColumn: 'span 2' }}>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.4rem' }}>
              Curated Color Preferences
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {userProfile.favoriteColors.map((color, i) => (
                <span key={i} style={{ background: '#FFFFFF', padding: '0.25rem 0.65rem', borderRadius: 'var(--radius-pill)', fontSize: '0.8rem', border: '1px solid var(--color-border)' }}>
                  {color}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Settings Section */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 'var(--radius-xl)',
        padding: '2rem 2.25rem',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-sm)',
        marginBottom: '2rem'
      }}>
        <h3 className="font-serif" style={{ fontSize: '1.35rem', marginBottom: '1.25rem' }}>
          Application Settings & Preferences
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          {/* Notifications Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--color-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Bell size={18} color="var(--color-primary)" />
              <div>
                <span style={{ fontSize: '0.95rem', fontWeight: 600, display: 'block' }}>Style Notifications</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Daily outfit inspirations and seasonal drops</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={userProfile.notificationsEnabled}
              onChange={handleToggleNotification}
              style={{ accentColor: 'var(--color-primary)', width: '18px', height: '18px', cursor: 'pointer' }}
            />
          </div>

          {/* Appearance */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--color-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Eye size={18} color="var(--color-primary)" />
              <div>
                <span style={{ fontSize: '0.95rem', fontWeight: 600, display: 'block' }}>Appearance Theme</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Editorial Light Blush (#FDF4F9)</span>
              </div>
            </div>
            <span className="editorial-tag editorial-tag-gold">Active</span>
          </div>

          {/* Privacy & Avatars */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Shield size={18} color="var(--color-primary)" />
              <div>
                <span style={{ fontSize: '0.95rem', fontWeight: 600, display: 'block' }}>Faceless Fashion Avatars</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Zero face / body image uploads required</span>
              </div>
            </div>
            <CheckCircle2 size={20} color="#2E7D32" />
          </div>

        </div>
      </div>

      {/* About Chic Genie */}
      <div style={{
        backgroundColor: '#FAF5F8',
        borderRadius: 'var(--radius-xl)',
        padding: '2rem 2.25rem',
        border: '1px solid var(--color-border)',
        textAlign: 'center'
      }}>
        <h4 className="font-serif" style={{ fontSize: '1.4rem', marginBottom: '0.5rem', color: 'var(--color-primary)' }}>
          CHIC GENIE
        </h4>
        <p className="editorial-tag editorial-tag-gold" style={{ marginBottom: '0.75rem' }}>
          SINCE 2026 · PERSONAL DIGITAL FASHION STYLIST
        </p>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem', lineHeight: '1.6', maxWidth: '600px', margin: '0 auto' }}>
          Chic Genie empowers personal aesthetic expression through intelligent fashion curation, respectful faceless fashion avatars, and bespoke wardrobe recommendations.
        </p>
      </div>

    </div>
  );
}

import React from 'react';
import { 
  Building2, MapPin, Compass, Layers, Accessibility, 
  AlertTriangle, Sun, Moon, Sparkles, ChevronDown 
} from 'lucide-react';
import { getMergedMapLocations } from '../utils/locationStore';

export default function HeaderNavbar({
  currentLocation,
  setCurrentLocation,
  activeFloor,
  setActiveFloor,
  theme,
  setTheme,
  onOpenAccessibility,
  onOpenEmergency,
  onOpenEditLocation,
  onStartPinningMode,
  onOpenManagePins,
  onOpenAdmin360,
  onOpenSBMIndoor
}) {
  const activeLocations = getMergedMapLocations();
  return (
    <header style={{
      zIndex: 100,
      padding: '0 20px',
      height: '56px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '12px',
      backgroundColor: 'var(--colors-canvas)',
      borderBottom: '1px solid var(--colors-hairline)',
      boxShadow: 'none'
    }}>
      {/* Brand & Emblem */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <img
          src="/csjm_logo.png"
          alt="CSJMU Logo"
          style={{
            height: '36px',
            width: '36px',
            objectFit: 'contain',
            flexShrink: 0
          }}
        />
        <div>
          <h1 className="navbar-title-desktop" style={{
            fontSize: '15px',
            fontWeight: 600,
            color: 'var(--colors-ink)',
            fontFamily: 'var(--font-heading)',
            lineHeight: 1.2
          }}>
            Chhatrapati Shahuji Maharaj University Welcomes You !!
          </h1>
          <h1 className="navbar-title-mobile" style={{
            fontSize: '15px',
            fontWeight: 600,
            color: 'var(--colors-ink)',
            fontFamily: 'var(--font-heading)',
            lineHeight: 1.2
          }}>
            CSJMU Kanpur
          </h1>
          <p style={{
            fontSize: '12px',
            color: 'var(--colors-body)',
            fontFamily: 'var(--font-main)',
            fontWeight: 500
          }}>
            Smart Navigation
          </p>
        </div>
      </div>

      {/* Right Actions Header Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* SBM Building Indoor & Watercoolers Button */}
          {onOpenSBMIndoor && (
            <button
              onClick={onOpenSBMIndoor}
              title="Open SBM Building Rooms, Classrooms, Watercoolers & Corridors Blueprint"
              className="ollama-btn-secondary"
              style={{
                padding: '6px 14px',
                borderRadius: '9999px',
                color: 'var(--colors-ink)',
                fontWeight: 500,
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                border: '1px solid var(--colors-hairline-strong)',
                background: 'var(--colors-surface-soft)',
                cursor: 'pointer',
                height: '32px'
              }}
            >
              🏢 <span className="btn-label-desktop">SBM Indoor & Watercoolers</span>
            </button>
          )}

          {/* Upload 360 Admin Dashboard Button */}
          {onOpenAdmin360 && (
            <button
              onClick={onOpenAdmin360}
              title="Upload custom 360 panoramas & manage hotspots"
              className="ollama-btn-secondary"
              style={{
                padding: '6px 14px',
                borderRadius: '9999px',
                color: 'var(--colors-ink)',
                fontWeight: 500,
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                border: '1px solid var(--colors-hairline-strong)',
                background: 'var(--colors-surface-soft)',
                cursor: 'pointer',
                height: '32px'
              }}
            >
              📷 <span className="btn-label-desktop">Upload 360</span>
            </button>
          )}

          {/* Accessibility Button */}
          <button
            onClick={onOpenAccessibility}
            title="Accessibility & Wheelchair Options"
            className="ollama-btn-secondary"
            style={{
              padding: '6px 12px',
              borderRadius: '9999px',
              border: '1px solid var(--colors-hairline)',
              background: 'var(--colors-canvas)',
              color: 'var(--colors-ink)',
              height: '32px',
              cursor: 'pointer'
            }}
          >
            <Accessibility size={16} />
          </button>

          {/* Emergency SOS Button */}
          <button
            onClick={onOpenEmergency}
            style={{
              background: 'var(--colors-surface-dark)',
              border: '1px solid var(--colors-hairline-strong)',
              color: 'var(--colors-on-dark)',
              padding: '6px 14px',
              borderRadius: '9999px',
              fontWeight: 500,
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              height: '32px'
            }}
          >
            <AlertTriangle size={14} color="#EF4444" /> <span>SOS<span className="btn-label-desktop"> Help</span></span>
          </button>

          {/* Dark/Light Switch */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="ollama-btn-secondary"
            style={{
              padding: '6px 12px',
              borderRadius: '9999px',
              border: '1px solid var(--colors-hairline)',
              background: 'var(--colors-canvas)',
              color: 'var(--colors-ink)',
              height: '32px',
              cursor: 'pointer'
            }}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
    </header>
  );
}

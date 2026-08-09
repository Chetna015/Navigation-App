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
  onOpenAdmin360
}) {
  const activeLocations = getMergedMapLocations();
  return (
    <header className="glass-panel" style={{
      zIndex: 100,
      padding: '12px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '16px',
      borderBottom: '1px solid var(--border-glass)'
    }}>
      {/* Brand & Emblem */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <img
          src="/csjm_logo.png"
          alt="CSJMU Logo"
          style={{
            height: '75px',
            width: '75px',
            objectFit: 'contain',
            flexShrink: 0
          }}
        />
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 style={{ fontSize: '18px', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '0.2px' }}>
              CSJMU AI SUMMIT 2026
            </h1>
            <span style={{
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              color: '#FFF',
              fontSize: '10px',
              fontWeight: 800,
              padding: '2px 8px',
              borderRadius: '12px',
              textTransform: 'uppercase',
              boxShadow: '0 0 10px rgba(16, 185, 129, 0.4)'
            }}>
              LIVE DIGITAL TWIN
            </span>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>
            Smart Campus & Grand Auditorium • Kanpur, UP
          </p>
        </div>
      </div>

      {/* Center Location Selector */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        background: 'var(--bg-glass-card)',
        padding: '6px 14px',
        borderRadius: 'var(--radius-full)',
        border: '1px solid var(--border-glass)'
      }}>
        <MapPin size={16} color="var(--color-cyan)" className="animate-pulse-glow" />
        <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500 }}>
          📍 Location:
        </span>
        <select
          value={currentLocation?.id || ''}
          onChange={(e) => {
            const selected = activeLocations.find(loc => loc.id === e.target.value);
            if (selected) {
              setCurrentLocation(selected);
              if (selected.floor && selected.floor !== activeFloor) {
                setActiveFloor(selected.floor);
              }
            }
          }}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-main)',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            outline: 'none'
          }}
        >
          {activeLocations.length === 0 ? (
            <option value="" style={{ background: '#0F172A', color: '#FFF' }}>
              You Are Here 📍
            </option>
          ) : (
            activeLocations.map(loc => (
              <option key={loc.id} value={loc.id} style={{ background: '#0F172A', color: '#FFF' }}>
                {loc.name}
              </option>
            ))
          )}
        </select>
      </div>

      {/* Right Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Indoor / Outdoor Map Floor Switcher */}
        <div style={{
          display: 'flex',
          background: 'rgba(0,0,0,0.2)',
          padding: '3px',
          borderRadius: 'var(--radius-full)',
          border: '1px solid var(--border-glass)'
        }}>
          <button
            onClick={() => setActiveFloor('outdoor')}
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              border: 'none',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              background: activeFloor === 'outdoor' ? 'var(--color-primary)' : 'transparent',
              color: activeFloor === 'outdoor' ? '#FFF' : 'var(--text-muted)',
              transition: 'all 0.2s ease'
            }}
          >
            Outdoor Campus
          </button>
          <button
            onClick={() => setActiveFloor('indoor')}
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              border: 'none',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              background: activeFloor === 'indoor' ? 'linear-gradient(135deg, #0066FF 0%, #00F0FF 100%)' : 'transparent',
              color: activeFloor === 'indoor' ? '#FFF' : 'var(--text-muted)',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Sparkles size={12} /> Indoor Twin
          </button>
        </div>

        {/* Pin Location Button */}
        {onStartPinningMode && (
          <button
            onClick={onStartPinningMode}
            title="Click to drop a pin on the map"
            style={{
              padding: '8px 14px',
              borderRadius: 'var(--radius-md)',
              color: '#FFF',
              fontWeight: 800,
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              border: 'none',
              background: 'linear-gradient(135deg, #EF4444 0%, #FF6B81 100%)',
              cursor: 'pointer',
              boxShadow: '0 0 12px rgba(239, 68, 68, 0.4)'
            }}
          >
            <MapPin size={15} color="#FFF" /> 📍 Pin Location
          </button>
        )}

        {/* Manage Pins Button */}
        {onOpenManagePins && (
          <button
            onClick={onOpenManagePins}
            title="Manage, view, and remove location pins"
            className="btn-glass"
            style={{
              padding: '8px 14px',
              borderRadius: 'var(--radius-md)',
              color: '#00F0FF',
              fontWeight: 700,
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              border: '1px solid rgba(0, 240, 255, 0.4)',
              background: 'rgba(0, 240, 255, 0.1)'
            }}
          >
            📍 Manage Pins
          </button>
        )}

        {/* Upload 360 Admin Dashboard Button */}
        {onOpenAdmin360 && (
          <button
            onClick={onOpenAdmin360}
            title="Upload custom 360 panoramas & manage hotspots"
            className="btn-glass"
            style={{
              padding: '8px 14px',
              borderRadius: 'var(--radius-md)',
              color: '#FFF',
              fontWeight: 800,
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              border: '1px solid rgba(0, 102, 255, 0.5)',
              background: 'linear-gradient(135deg, rgba(0, 102, 255, 0.3) 0%, rgba(0, 240, 255, 0.3) 100%)',
              boxShadow: '0 0 12px rgba(0, 240, 255, 0.25)'
            }}
          >
            📷 Upload 360
          </button>
        )}

        {/* Accessibility Button */}
        <button
          onClick={onOpenAccessibility}
          title="Accessibility & Wheelchair Options"
          className="btn-glass"
          style={{ padding: '8px 12px', borderRadius: 'var(--radius-md)' }}
        >
          <Accessibility size={18} color="var(--color-cyan)" />
        </button>

        {/* Emergency SOS Button */}
        <button
          onClick={onOpenEmergency}
          style={{
            background: 'rgba(244, 63, 94, 0.15)',
            border: '1px solid rgba(244, 63, 94, 0.4)',
            color: '#F43F5E',
            padding: '8px 14px',
            borderRadius: 'var(--radius-md)',
            fontWeight: 700,
            fontSize: '12px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <AlertTriangle size={15} /> SOS Help
        </button>

        {/* Dark/Light Switch */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="btn-glass"
          style={{ padding: '8px 12px', borderRadius: 'var(--radius-md)' }}
        >
          {theme === 'dark' ? <Sun size={18} color="#F59E0B" /> : <Moon size={18} color="#0066FF" />}
        </button>
      </div>
    </header>
  );
}

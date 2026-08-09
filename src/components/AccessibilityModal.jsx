import React from 'react';
import { 
  Accessibility, AlertTriangle, Eye, Volume2, Type, 
  X, Check, ShieldAlert, HeartPulse 
} from 'lucide-react';
import { MAP_LOCATIONS } from '../data/auditoriumData';

export default function AccessibilityModal({
  isOpen,
  onClose,
  accessibilityOptions,
  setAccessibilityOptions,
  onTriggerSOS
}) {
  if (!isOpen) return null;

  const toggleOption = (key) => {
    setAccessibilityOptions(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      background: 'rgba(5, 8, 16, 0.85)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '520px',
        borderRadius: 'var(--radius-xl)',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        border: '1px solid var(--border-glass-light)',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6)'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'rgba(0, 240, 255, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Accessibility size={22} color="var(--color-cyan)" />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#FFF' }}>
                Accessibility & Inclusivity Suite
              </h2>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                CSJMU Auditorium Inclusive Navigation Settings
              </p>
            </div>
          </div>

          <button onClick={onClose} className="btn-glass" style={{ padding: '6px', borderRadius: '50%' }}>
            <X size={18} color="var(--text-muted)" />
          </button>
        </div>

        {/* Options List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Wheelchair Route */}
          <div
            onClick={() => toggleOption('wheelchairRoute')}
            className="glass-card"
            style={{
              padding: '14px 18px',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Accessibility size={20} color="var(--color-cyan)" />
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#FFF' }}>
                  Wheelchair Accessible Routing
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Prioritize ramps and elevators, bypass all staircases
                </div>
              </div>
            </div>

            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '6px',
              background: accessibilityOptions.wheelchairRoute ? '#00F0FF' : 'rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {accessibilityOptions.wheelchairRoute && <Check size={16} color="#000" />}
            </div>
          </div>

          {/* High Contrast Mode */}
          <div
            onClick={() => toggleOption('highContrast')}
            className="glass-card"
            style={{
              padding: '14px 18px',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Eye size={20} color="#F59E0B" />
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#FFF' }}>
                  High Contrast Theme
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Maximum color contrast for visual clarity
                </div>
              </div>
            </div>

            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '6px',
              background: accessibilityOptions.highContrast ? '#F59E0B' : 'rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {accessibilityOptions.highContrast && <Check size={16} color="#000" />}
            </div>
          </div>

          {/* Large Font Mode */}
          <div
            onClick={() => toggleOption('largeFont')}
            className="glass-card"
            style={{
              padding: '14px 18px',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Type size={20} color="#10B981" />
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#FFF' }}>
                  Large Typography
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Increase UI font scale for easy reading
                </div>
              </div>
            </div>

            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '6px',
              background: accessibilityOptions.largeFont ? '#10B981' : 'rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {accessibilityOptions.largeFont && <Check size={16} color="#000" />}
            </div>
          </div>
        </div>

        {/* SOS Emergency Help Launcher */}
        <div style={{
          borderTop: '1px solid var(--border-glass)',
          paddingTop: '16px'
        }}>
          <button
            onClick={() => {
              onTriggerSOS();
              onClose();
            }}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #EF4444 0%, #F43F5E 100%)',
              color: '#FFF',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              padding: '12px',
              fontWeight: 800,
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: 'pointer',
              boxShadow: '0 0 20px rgba(244, 63, 94, 0.4)'
            }}
          >
            <HeartPulse size={18} /> Trigger SOS Emergency Medical Help
          </button>
        </div>
      </div>
    </div>
  );
}

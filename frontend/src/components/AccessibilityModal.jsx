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
      background: 'rgba(0, 0, 0, 0.65)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '520px',
        borderRadius: '12px',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        border: '1px solid var(--colors-hairline-strong)',
        boxShadow: 'var(--shadow-md)',
        background: 'var(--colors-surface-card)'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '9999px',
              background: 'var(--colors-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Accessibility size={18} color="var(--colors-on-primary)" />
            </div>
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--colors-ink)', fontFamily: 'var(--font-heading)' }}>
                Accessibility & Inclusivity Suite
              </h2>
              <p style={{ fontSize: '12px', color: 'var(--colors-body)', fontFamily: 'var(--font-main)' }}>
                CSJMU Auditorium Inclusive Navigation Settings
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            title="Close Modal"
            style={{
              width: '32px',
              height: '32px',
              minWidth: '32px',
              minHeight: '32px',
              borderRadius: '50%',
              background: '#000000',
              color: '#ffffff',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '16px',
              lineHeight: 1
            }}
          >
            ✕
          </button>
        </div>

        {/* Options List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Wheelchair Route */}
          <div
            onClick={() => toggleOption('wheelchairRoute')}
            style={{
              padding: '14px 18px',
              borderRadius: '12px',
              background: 'var(--colors-surface-soft)',
              border: '1px solid var(--colors-hairline)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Accessibility size={20} color="var(--colors-ink)" />
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--colors-ink)', fontFamily: 'var(--font-heading)' }}>
                  Wheelchair Accessible Routing
                </div>
                <div style={{ fontSize: '12px', color: 'var(--colors-body)', fontFamily: 'var(--font-main)' }}>
                  Prioritize ramps and elevators, bypass all staircases
                </div>
              </div>
            </div>

            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '9999px',
              background: accessibilityOptions.wheelchairRoute ? 'var(--colors-primary)' : 'var(--colors-hairline)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {accessibilityOptions.wheelchairRoute && <Check size={14} color="var(--colors-on-primary)" />}
            </div>
          </div>

          {/* High Contrast Mode */}
          <div
            onClick={() => toggleOption('highContrast')}
            style={{
              padding: '14px 18px',
              borderRadius: '12px',
              background: 'var(--colors-surface-soft)',
              border: '1px solid var(--colors-hairline)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Eye size={20} color="var(--colors-ink)" />
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--colors-ink)', fontFamily: 'var(--font-heading)' }}>
                  High Contrast Theme
                </div>
                <div style={{ fontSize: '12px', color: 'var(--colors-body)', fontFamily: 'var(--font-main)' }}>
                  Maximum color contrast for visual clarity
                </div>
              </div>
            </div>

            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '9999px',
              background: accessibilityOptions.highContrast ? 'var(--colors-primary)' : 'var(--colors-hairline)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {accessibilityOptions.highContrast && <Check size={14} color="var(--colors-on-primary)" />}
            </div>
          </div>

          {/* Large Font Mode */}
          <div
            onClick={() => toggleOption('largeFont')}
            style={{
              padding: '14px 18px',
              borderRadius: '12px',
              background: 'var(--colors-surface-soft)',
              border: '1px solid var(--colors-hairline)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Type size={20} color="var(--colors-ink)" />
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--colors-ink)', fontFamily: 'var(--font-heading)' }}>
                  Large Typography
                </div>
                <div style={{ fontSize: '12px', color: 'var(--colors-body)', fontFamily: 'var(--font-main)' }}>
                  Increase UI font scale for easy reading
                </div>
              </div>
            </div>

            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '9999px',
              background: accessibilityOptions.largeFont ? 'var(--colors-primary)' : 'var(--colors-hairline)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {accessibilityOptions.largeFont && <Check size={14} color="var(--colors-on-primary)" />}
            </div>
          </div>
        </div>

        {/* SOS Emergency Help Launcher */}
        <div style={{
          borderTop: '1px solid var(--colors-hairline)',
          paddingTop: '16px'
        }}>
          <button
            onClick={() => {
              onTriggerSOS();
              onClose();
            }}
            style={{
              width: '100%',
              background: 'var(--colors-surface-dark)',
              color: 'var(--colors-on-dark)',
              border: '1px solid var(--colors-hairline-strong)',
              borderRadius: '9999px',
              padding: '12px',
              fontWeight: 600,
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: 'pointer'
            }}
          >
            <HeartPulse size={18} color="#EF4444" /> Trigger SOS Emergency Medical Help
          </button>
        </div>
      </div>
    </div>
  );
}

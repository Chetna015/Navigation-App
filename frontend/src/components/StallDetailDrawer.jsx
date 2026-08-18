import React from 'react';
import { 
  Rocket, X, Navigation, ExternalLink, Bookmark, 
  User, Clock, Globe, ShieldCheck, HeartPulse, Sprout 
} from 'lucide-react';

export default function StallDetailDrawer({
  stall,
  onClose,
  onNavigate,
  isBookmarked,
  onToggleBookmark
}) {
  if (!stall) return null;

  return (
    <div className="glass-panel" style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      width: '360px',
      maxWidth: 'calc(100vw - 32px)',
      borderRadius: 'var(--radius-lg)',
      padding: '20px',
      zIndex: 800,
      border: '1px solid var(--border-glass-light)',
      boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
      display: 'flex',
      flexDirection: 'column',
      gap: '14px'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            background: 'rgba(16, 185, 129, 0.2)',
            color: '#10B981',
            fontSize: '11px',
            fontWeight: 800,
            padding: '3px 10px',
            borderRadius: '6px'
          }}>
            STALL {stall.id}
          </span>
          <span style={{ fontSize: '11px', color: 'var(--color-cyan)', fontWeight: 700 }}>
            {stall.domain}
          </span>
        </div>

        <button onClick={onClose} className="modal-close-btn" title="Close Drawer">
          <X size={16} color="var(--colors-ink)" />
        </button>
      </div>

      {/* Startup Info */}
      <div>
        <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#FFF', marginBottom: '4px' }}>
          {stall.name}
        </h3>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.4 }}>
          {stall.description}
        </p>
      </div>

      {/* Details */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.04)',
        borderRadius: 'var(--radius-sm)',
        padding: '10px 14px',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        fontSize: '12px',
        color: 'var(--text-muted)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <User size={14} color="var(--color-cyan)" /> Founder: <strong style={{ color: '#FFF' }}>{stall.founder}</strong>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Clock size={14} color="var(--color-cyan)" /> Live Demo: <strong style={{ color: '#FFF' }}>{stall.demoTiming}</strong>
        </div>
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={() => {
            onNavigate(stall);
            onClose();
          }}
          className="btn-primary"
          style={{ flex: 1, justifyContent: 'center', fontSize: '13px', padding: '10px' }}
        >
          <Navigation size={15} /> Take Me To Stall
        </button>

        <button
          onClick={() => onToggleBookmark(stall.id)}
          className="btn-glass"
          style={{ padding: '10px', borderRadius: 'var(--radius-md)' }}
        >
          <Bookmark size={16} color={isBookmarked ? '#F59E0B' : 'var(--text-muted)'} fill={isBookmarked ? '#F59E0B' : 'none'} />
        </button>
      </div>
    </div>
  );
}

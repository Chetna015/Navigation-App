import React, { useState } from 'react';
import { 
  Calendar, Clock, User, MapPin, Navigation, Bookmark, 
  Sparkles, X, Radio, Search, Filter 
} from 'lucide-react';
import { SESSIONS_DATA, MAP_LOCATIONS } from '../data/auditoriumData';

export default function EventSessionsModal({
  isOpen,
  onClose,
  onNavigateToVenue,
  bookmarks,
  onToggleBookmark
}) {
  const [selectedTrack, setSelectedTrack] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const tracks = ['All', 'Keynote', 'Generative AI', 'Healthcare AI', 'DeepTech', 'Cyber Security'];

  const filteredSessions = SESSIONS_DATA.filter(session => {
    const matchesTrack = selectedTrack === 'All' || session.track === selectedTrack;
    const matchesSearch = session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          session.speaker.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          session.tags.some(tag => tag.includes(searchQuery.toLowerCase()));
    return matchesTrack && matchesSearch;
  });

  const liveSession = SESSIONS_DATA.find(s => s.isLive);

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
        maxWidth: '960px',
        maxHeight: '90vh',
        borderRadius: '12px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        border: '1px solid var(--colors-hairline-strong)',
        boxShadow: 'var(--shadow-md)',
        background: 'var(--colors-surface-card)'
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '16px 24px',
          background: 'var(--colors-surface-soft)',
          borderBottom: '1px solid var(--colors-hairline)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
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
              <Calendar size={18} color="var(--colors-on-primary)" />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--colors-ink)', fontFamily: 'var(--font-heading)' }}>
                AI Summit 2026 Session Schedule
              </h2>
              <p style={{ fontSize: '12px', color: 'var(--colors-body)', fontFamily: 'var(--font-main)' }}>
                CSJMU Auditorium Keynotes, Technical Panels & VC Debates
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="modal-close-btn"
            title="Close Modal"
          >
            <X size={16} color="var(--colors-ink)" />
          </button>
        </div>

        {/* Live Session Alert Banner */}
        {liveSession && (
          <div style={{
            background: 'linear-gradient(90deg, rgba(244, 63, 94, 0.2) 0%, rgba(0, 102, 255, 0.2) 100%)',
            borderBottom: '1px solid rgba(244, 63, 94, 0.4)',
            padding: '12px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Radio size={18} color="#F43F5E" className="animate-pulse" />
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#F43F5E', textTransform: 'uppercase' }}>
                LIVE NOW
              </span>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#FFF' }}>
                {liveSession.title}
              </span>
            </div>

            <button
              onClick={() => {
                const loc = MAP_LOCATIONS.find(l => l.id === liveSession.venueId);
                if (loc) {
                  onNavigateToVenue(loc);
                  onClose();
                }
              }}
              className="btn-primary"
              style={{ fontSize: '11px', padding: '6px 14px', borderRadius: '12px' }}
            >
              <Navigation size={12} /> Direct to Stage
            </button>
          </div>
        )}

        {/* Filter Controls Bar */}
        <div style={{
          padding: '16px 24px',
          background: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border-glass)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <div className="glass-card" style={{
            display: 'flex',
            alignItems: 'center',
            padding: '6px 14px',
            borderRadius: 'var(--radius-full)'
          }}>
            <Search size={18} color="var(--text-muted)" style={{ marginRight: '8px' }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by topic, speaker, or track..."
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                color: '#FFF',
                fontSize: '13px',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
            {tracks.map(track => (
              <button
                key={track}
                onClick={() => setSelectedTrack(track)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '20px',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  background: selectedTrack === track ? 'var(--color-primary)' : 'rgba(255, 255, 255, 0.05)',
                  color: selectedTrack === track ? '#FFF' : 'var(--text-muted)',
                  whiteSpace: 'nowrap'
                }}
              >
                {track}
              </button>
            ))}
          </div>
        </div>

        {/* Sessions List View */}
        <div style={{
          flex: 1,
          padding: '24px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          {filteredSessions.map((sess) => {
            const isBookmarked = bookmarks.includes(sess.id);

            return (
              <div
                key={sess.id}
                className="glass-card"
                style={{
                  borderRadius: 'var(--radius-lg)',
                  padding: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '20px',
                  borderLeft: sess.isLive ? '4px solid #F43F5E' : '4px solid var(--color-primary)'
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <span style={{
                      background: 'rgba(0, 102, 255, 0.2)',
                      color: 'var(--color-cyan)',
                      fontSize: '11px',
                      fontWeight: 800,
                      padding: '2px 10px',
                      borderRadius: '12px'
                    }}>
                      {sess.track}
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={13} /> {sess.time}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#FFF', marginBottom: '6px' }}>
                    {sess.title}
                  </h3>

                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '10px' }}>
                    {sess.description}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px', color: 'var(--text-main)' }}>
                    <div>
                      <User size={14} color="var(--color-cyan)" style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                      <strong>{sess.speaker}</strong> ({sess.designation})
                    </div>
                    <div>
                      <MapPin size={14} color="var(--color-cyan)" style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                      Venue: <strong>{sess.venue}</strong>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-end' }}>
                  <button
                    onClick={() => {
                      const loc = MAP_LOCATIONS.find(l => l.id === sess.venueId);
                      if (loc) {
                        onNavigateToVenue(loc);
                        onClose();
                      }
                    }}
                    className="btn-primary"
                    style={{ fontSize: '12px', padding: '8px 16px' }}
                  >
                    <Navigation size={14} /> Navigate to Venue
                  </button>

                  <button
                    onClick={() => onToggleBookmark(sess.id)}
                    className="btn-glass"
                    style={{ fontSize: '12px', padding: '6px 12px' }}
                  >
                    <Bookmark size={14} color={isBookmarked ? '#F59E0B' : 'var(--text-muted)'} fill={isBookmarked ? '#F59E0B' : 'none'} />
                    {isBookmarked ? 'Saved' : 'Add Bookmark'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

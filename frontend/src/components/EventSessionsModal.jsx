import React, { useState } from 'react';
import { 
  Calendar, Clock, User, MapPin, Navigation, Bookmark, 
  Sparkles, X, Radio, Search, Filter, Building2, Check, 
  Download, Users, ArrowRight, Star, Tag
} from 'lucide-react';
import { SESSIONS_DATA, MAP_LOCATIONS } from '../data/auditoriumData';

export default function EventSessionsModal({
  isOpen,
  onClose,
  onNavigateToVenue,
  onOpenIndoorModal,
  bookmarks = [],
  onToggleBookmark
}) {
  const [selectedDay, setSelectedDay] = useState('day1'); // 'day1' | 'day2'
  const [selectedTrack, setSelectedTrack] = useState('All');
  const [selectedView, setSelectedView] = useState('all'); // 'all' | 'live' | 'bookmarked'
  const [searchQuery, setSearchQuery] = useState('');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const tracks = [
    'All',
    'Plenary',
    'General Track',
    'Agriculture Track',
    'Medical Track',
    'AI Products & Transformation',
    'Policy & Governance',
    'Best Practices',
    'Valedictory',
    'Inaugural & Tea'
  ];

  // Track accent colors
  const getTrackColor = (track) => {
    switch (track) {
      case 'Plenary': return { bg: 'rgba(234, 88, 12, 0.12)', border: '#EA580C', text: '#C2410C' };
      case 'General Track': return { bg: 'rgba(59, 130, 246, 0.12)', border: '#3B82F6', text: '#2563EB' };
      case 'Agriculture Track': return { bg: 'rgba(16, 185, 129, 0.12)', border: '#10B981', text: '#059669' };
      case 'Medical Track': return { bg: 'rgba(236, 72, 153, 0.12)', border: '#EC4899', text: '#DB2777' };
      case 'AI Products & Transformation': return { bg: 'rgba(139, 92, 246, 0.12)', border: '#8B5CF6', text: '#7C3AED' };
      case 'Policy & Governance': return { bg: 'rgba(245, 158, 11, 0.12)', border: '#F59E0B', text: '#D97706' };
      case 'Best Practices': return { bg: 'rgba(6, 182, 212, 0.12)', border: '#06B6D4', text: '#0891B2' };
      case 'Valedictory': return { bg: 'rgba(239, 68, 68, 0.12)', border: '#EF4444', text: '#DC2626' };
      case 'Inaugural & Tea': return { bg: 'rgba(100, 116, 139, 0.12)', border: '#64748B', text: '#475569' };
      default: return { bg: 'rgba(59, 130, 246, 0.12)', border: '#3B82F6', text: '#2563EB' };
    }
  };

  // Filtered sessions
  const filteredSessions = SESSIONS_DATA.filter(session => {
    const matchesDay = selectedDay === 'all' || session.dayId === selectedDay;
    const matchesTrack = selectedTrack === 'All' || session.track === selectedTrack;
    const matchesView = 
      selectedView === 'all' ? true :
      selectedView === 'live' ? session.isLive :
      selectedView === 'bookmarked' ? bookmarks.includes(session.id) : true;
    
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      session.title.toLowerCase().includes(q) ||
      session.speaker.toLowerCase().includes(q) ||
      session.designation.toLowerCase().includes(q) ||
      session.venue.toLowerCase().includes(q) ||
      session.room.toLowerCase().includes(q) ||
      session.track.toLowerCase().includes(q) ||
      (session.tags && session.tags.some(tag => tag.toLowerCase().includes(q)));

    return matchesDay && matchesTrack && matchesView && matchesSearch;
  });

  const liveSession = SESSIONS_DATA.find(s => s.isLive);
  const bookmarkedCount = bookmarks.filter(bId => SESSIONS_DATA.some(s => s.id === bId)).length;
  const day1Count = SESSIONS_DATA.filter(s => s.dayId === 'day1').length;
  const day2Count = SESSIONS_DATA.filter(s => s.dayId === 'day2').length;

  const handleNavigate = (session) => {
    let loc = MAP_LOCATIONS.find(l => l.id === session.venueId);
    if (!loc) {
      if (session.buildingId === 'sbm') {
        loc = MAP_LOCATIONS.find(l => l.id === 'loc_sbm');
      } else {
        loc = MAP_LOCATIONS.find(l => l.id === 'loc_auditorium') || MAP_LOCATIONS[0];
      }
    }
    if (loc && onNavigateToVenue) {
      onNavigateToVenue(loc);
      onClose();
    }
  };

  const handleOpenIndoor = (session) => {
    if (onOpenIndoorModal) {
      onOpenIndoorModal(session.buildingId || 'sbm');
      onClose();
    }
  };

  // Generate .ics calendar download for a session
  const downloadICS = (session) => {
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//CSJMU AI Summit 2026//EN',
      'BEGIN:VEVENT',
      `SUMMARY:CSJMU AI Summit 2026: ${session.title}`,
      `DESCRIPTION:${session.description}\\nSpeaker: ${session.speaker} (${session.designation})`,
      `LOCATION:${session.venue}, CSJMU Kanpur`,
      `STATUS:CONFIRMED`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${session.id}_ai_summit_session.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  return (
    <div 
      className="mobile-modal-overlay" 
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '12px'
      }}
    >
      <div 
        className="mobile-modal-content animate-slide-up"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '1000px',
          maxHeight: '92vh',
          borderRadius: '16px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          border: '1px solid var(--colors-hairline-strong)',
          boxShadow: 'var(--shadow-md)',
          background: 'var(--colors-surface-card)',
          color: 'var(--colors-ink)'
        }}
      >
        {/* 1. Modal Header Bar */}
        <div style={{
          padding: '16px 20px',
          background: 'var(--colors-surface-soft)',
          borderBottom: '1px solid var(--colors-hairline)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              flexShrink: 0,
              boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)'
            }}>
              <Calendar size={22} color="#FFFFFF" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <h2 style={{ 
                  fontSize: '17px', 
                  fontWeight: 700, 
                  color: 'var(--colors-ink)', 
                  fontFamily: 'var(--font-heading)',
                  margin: 0,
                  lineHeight: 1.2
                }}>
                  National AI Manthan 2.0 — Summit Schedule
                </h2>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  background: 'rgba(59, 130, 246, 0.15)',
                  color: '#2563EB',
                  padding: '2px 8px',
                  borderRadius: '9999px'
                }}>
                  27 Sessions • 2 Days
                </span>
              </div>
              <p style={{ 
                fontSize: '12px', 
                color: 'var(--colors-body)', 
                fontFamily: 'var(--font-main)',
                margin: '2px 0 0 0'
              }}>
                Jan Bhavan, UP & CSJM University, Kanpur Presents • 12–13 Sept 2026
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {downloadSuccess && (
              <span style={{ fontSize: '11px', color: '#10B981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Check size={14} /> Added to Calendar
              </span>
            )}
            <button
              onClick={onClose}
              className="modal-close-btn"
              title="Close Schedule"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                border: '1px solid var(--colors-hairline)',
                background: 'var(--colors-canvas)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--colors-ink)'
              }}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Day Tabs & Search & Filter Controls */}
        <div style={{
          padding: '12px 20px',
          background: 'var(--colors-surface-card)',
          borderBottom: '1px solid var(--colors-hairline)',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          {/* Top Row: Day Selector Tabs & View Filters */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px',
            flexWrap: 'wrap'
          }}>
            {/* Day Selector Segmented Bar */}
            <div style={{
              display: 'flex',
              background: 'var(--colors-surface-soft)',
              padding: '3px',
              borderRadius: '10px',
              border: '1px solid var(--colors-hairline)'
            }}>
              {[
                { id: 'day1', label: `Day 1 • Sat, 12 Sept (${day1Count})` },
                { id: 'day2', label: `Day 2 • Sun, 13 Sept (${day2Count})` }
              ].map(day => (
                <button
                  key={day.id}
                  onClick={() => setSelectedDay(day.id)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '12px',
                    fontWeight: selectedDay === day.id ? 700 : 500,
                    cursor: 'pointer',
                    background: selectedDay === day.id ? 'var(--colors-canvas)' : 'transparent',
                    color: selectedDay === day.id ? 'var(--colors-ink)' : 'var(--colors-body)',
                    boxShadow: selectedDay === day.id ? 'var(--shadow-sm)' : 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {day.label}
                </button>
              ))}
            </div>

            {/* Quick Status View Pills (All, Live, Bookmarks) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                onClick={() => setSelectedView('all')}
                style={{
                  padding: '5px 10px',
                  borderRadius: '9999px',
                  border: '1px solid var(--colors-hairline)',
                  fontSize: '11px',
                  fontWeight: selectedView === 'all' ? 700 : 500,
                  cursor: 'pointer',
                  background: selectedView === 'all' ? 'var(--colors-ink)' : 'var(--colors-canvas)',
                  color: selectedView === 'all' ? 'var(--colors-on-primary)' : 'var(--colors-ink)'
                }}
              >
                All
              </button>
              <button
                onClick={() => setSelectedView('live')}
                style={{
                  padding: '5px 10px',
                  borderRadius: '9999px',
                  border: selectedView === 'live' ? '1px solid #EF4444' : '1px solid var(--colors-hairline)',
                  fontSize: '11px',
                  fontWeight: selectedView === 'live' ? 700 : 500,
                  cursor: 'pointer',
                  background: selectedView === 'live' ? '#EF4444' : 'var(--colors-canvas)',
                  color: selectedView === 'live' ? '#FFFFFF' : '#DC2626'
                }}
              >
                🔴 Live Now
              </button>
              <button
                onClick={() => setSelectedView('bookmarked')}
                style={{
                  padding: '5px 10px',
                  borderRadius: '9999px',
                  border: selectedView === 'bookmarked' ? '1px solid #F59E0B' : '1px solid var(--colors-hairline)',
                  fontSize: '11px',
                  fontWeight: selectedView === 'bookmarked' ? 700 : 500,
                  cursor: 'pointer',
                  background: selectedView === 'bookmarked' ? '#F59E0B' : 'var(--colors-canvas)',
                  color: selectedView === 'bookmarked' ? '#FFFFFF' : 'var(--colors-ink)'
                }}
              >
                ⭐ My Schedule ({bookmarkedCount})
              </button>
            </div>
          </div>

          {/* Search Bar Input */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            padding: '8px 14px',
            borderRadius: '10px',
            background: 'var(--colors-surface-soft)',
            border: '1px solid var(--colors-hairline)'
          }}>
            <Search size={16} color="var(--colors-body)" style={{ marginRight: '8px', flexShrink: 0 }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by topic, speaker, room, company (e.g. LLMs, DeepMind, SBM-02)..."
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                color: 'var(--colors-ink)',
                fontSize: '13px',
                outline: 'none',
                fontFamily: 'var(--font-main)'
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--colors-body)', padding: '2px' }}
                title="Clear Search"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Track Filter Pills Carousel */}
          <div style={{
            display: 'flex',
            gap: '6px',
            overflowX: 'auto',
            paddingBottom: '2px',
            scrollbarWidth: 'none'
          }}>
            {tracks.map(track => {
              const isSelected = selectedTrack === track;
              return (
                <button
                  key={track}
                  onClick={() => setSelectedTrack(track)}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '9999px',
                    border: isSelected ? '1px solid var(--colors-ink)' : '1px solid var(--colors-hairline)',
                    fontSize: '11px',
                    fontWeight: isSelected ? 700 : 500,
                    cursor: 'pointer',
                    background: isSelected ? 'var(--colors-surface-dark)' : 'var(--colors-surface-soft)',
                    color: isSelected ? 'var(--colors-on-dark)' : 'var(--colors-body)',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {track}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Sessions Scrollable List */}
        <div style={{
          flex: 1,
          padding: '16px 20px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px'
        }}>
          {filteredSessions.length > 0 ? (
            filteredSessions.map((sess) => {
              const isBookmarked = bookmarks.includes(sess.id);
              const trackStyle = getTrackColor(sess.track);

              return (
                <div
                  key={sess.id}
                  style={{
                    borderRadius: '12px',
                    padding: '16px',
                    border: '1px solid var(--colors-hairline)',
                    borderLeft: `4px solid ${sess.isLive ? '#EF4444' : trackStyle.border}`,
                    background: sess.isLive ? 'var(--colors-surface-soft)' : 'var(--colors-canvas)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    transition: 'border-color 0.2s ease',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  {/* Top Meta Row */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '8px',
                    flexWrap: 'wrap'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      {/* Track Pill */}
                      <span style={{
                        background: trackStyle.bg,
                        color: trackStyle.text,
                        border: `1px solid ${trackStyle.border}33`,
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '3px 10px',
                        borderRadius: '9999px'
                      }}>
                        {sess.track}
                      </span>

                      {/* Day Badge */}
                      <span style={{
                        fontSize: '11px',
                        fontWeight: 600,
                        color: 'var(--colors-body)',
                        background: 'var(--colors-surface-soft)',
                        border: '1px solid var(--colors-hairline)',
                        padding: '3px 8px',
                        borderRadius: '6px'
                      }}>
                        {sess.day}
                      </span>

                      {/* Time with Clock */}
                      <span style={{
                        fontSize: '12px',
                        fontWeight: 600,
                        color: 'var(--colors-charcoal)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <Clock size={13} color="var(--colors-body)" /> {sess.time}
                      </span>

                      {/* Live Badge */}
                      {sess.isLive && (
                        <span style={{
                          background: '#EF4444',
                          color: '#FFFFFF',
                          fontSize: '10px',
                          fontWeight: 800,
                          padding: '2px 8px',
                          borderRadius: '9999px',
                          letterSpacing: '0.5px'
                        }}>
                          LIVE NOW
                        </span>
                      )}

                      {sess.completed && (
                        <span style={{
                          background: 'var(--colors-surface-soft)',
                          color: 'var(--colors-mute)',
                          fontSize: '10px',
                          fontWeight: 600,
                          padding: '2px 6px',
                          borderRadius: '4px'
                        }}>
                          Completed
                        </span>
                      )}
                    </div>

                    {/* Quick Bookmark Toggle Icon */}
                    <button
                      onClick={() => onToggleBookmark(sess.id)}
                      title={isBookmarked ? "Remove from My Schedule" : "Add to My Schedule"}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: isBookmarked ? '#F59E0B' : 'var(--colors-mute)',
                        padding: '4px'
                      }}
                    >
                      <Star size={18} fill={isBookmarked ? '#F59E0B' : 'none'} />
                    </button>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: 700,
                      color: 'var(--colors-ink)',
                      margin: '0 0 6px 0',
                      lineHeight: 1.3,
                      fontFamily: 'var(--font-heading)'
                    }}>
                      {sess.title}
                    </h3>
                    <p style={{
                      fontSize: '13px',
                      color: 'var(--colors-body)',
                      lineHeight: 1.5,
                      margin: 0
                    }}>
                      {sess.description}
                    </p>
                  </div>

                  {/* Speaker & Venue Row */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    flexWrap: 'wrap',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: 'var(--colors-surface-soft)',
                    fontSize: '12px'
                  }}>
                    {/* Speaker */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: 'var(--colors-canvas)',
                        border: '1px solid var(--colors-hairline)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--colors-ink)'
                      }}>
                        <User size={13} />
                      </div>
                      <div>
                        <strong style={{ color: 'var(--colors-ink)' }}>{sess.speaker}</strong>
                        <span style={{ color: 'var(--colors-body)', marginLeft: '4px' }}>
                          ({sess.designation})
                        </span>
                      </div>
                    </div>

                    {/* Venue & Capacity */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--colors-charcoal)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={13} color="var(--colors-body)" />
                        <strong>{sess.venue}</strong>
                      </span>
                      {sess.capacity && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--colors-body)' }}>
                          <Users size={12} /> {sess.capacity}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Tags */}
                  {sess.tags && sess.tags.length > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                      {sess.tags.slice(0, 5).map(tag => (
                        <span 
                          key={tag}
                          onClick={() => setSearchQuery(tag)}
                          style={{
                            fontSize: '11px',
                            color: 'var(--colors-body)',
                            background: 'var(--colors-canvas)',
                            border: '1px solid var(--colors-hairline)',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Actions Row */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '10px',
                    flexWrap: 'wrap',
                    paddingTop: '6px',
                    borderTop: '1px solid var(--colors-hairline)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      {/* SBM Indoor Blueprint Button */}
                      {sess.buildingId === 'sbm' && (
                        <button
                          type="button"
                          onClick={() => handleOpenIndoor(sess)}
                          style={{
                            fontSize: '12px',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            border: '1px solid var(--colors-hairline-strong)',
                            background: 'var(--colors-canvas)',
                            color: 'var(--colors-ink)',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          🏢 SBM Indoor Blueprint ({sess.room})
                        </button>
                      )}

                      {/* Add to Calendar Button */}
                      <button
                        type="button"
                        onClick={() => downloadICS(sess)}
                        title="Add to Google/Apple Calendar"
                        style={{
                          fontSize: '12px',
                          padding: '6px 12px',
                          borderRadius: '8px',
                          border: '1px solid var(--colors-hairline)',
                          background: 'var(--colors-surface-soft)',
                          color: 'var(--colors-charcoal)',
                          fontWeight: 500,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <Calendar size={13} /> Add to Calendar (.ics)
                      </button>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {/* Bookmark Toggle Button */}
                      <button
                        type="button"
                        onClick={() => onToggleBookmark(sess.id)}
                        style={{
                          fontSize: '12px',
                          padding: '6px 12px',
                          borderRadius: '8px',
                          border: '1px solid var(--colors-hairline)',
                          background: isBookmarked ? 'rgba(245, 158, 11, 0.1)' : 'var(--colors-canvas)',
                          color: isBookmarked ? '#D97706' : 'var(--colors-charcoal)',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <Star size={13} fill={isBookmarked ? '#F59E0B' : 'none'} color={isBookmarked ? '#F59E0B' : 'var(--colors-body)'} />
                        {isBookmarked ? 'Bookmarked' : 'Bookmark'}
                      </button>

                      {/* Navigate to Venue Primary Button */}
                      <button
                        type="button"
                        onClick={() => handleNavigate(sess)}
                        style={{
                          fontSize: '12px',
                          padding: '7px 16px',
                          borderRadius: '8px',
                          border: 'none',
                          background: 'var(--colors-surface-dark)',
                          color: 'var(--colors-on-dark)',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          boxShadow: 'var(--shadow-sm)'
                        }}
                      >
                        <Navigation size={13} /> Direct to Venue ➔
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            /* Empty State */
            <div style={{
              padding: '40px 20px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'var(--colors-surface-soft)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--colors-body)'
              }}>
                <Calendar size={24} />
              </div>
              <h4 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--colors-ink)', margin: 0 }}>
                {selectedView === 'bookmarked' ? 'No Bookmarked Sessions' : 'No Matching Sessions Found'}
              </h4>
              <p style={{ fontSize: '13px', color: 'var(--colors-body)', maxWidth: '400px', margin: 0 }}>
                {selectedView === 'bookmarked'
                  ? 'Tap the star icon ⭐ on any session in the schedule to create your personalized AI Summit itinerary.'
                  : `No sessions found matching "${searchQuery}". Try selecting "All Days" or choosing a different track filter.`}
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedDay('all');
                  setSelectedTrack('All');
                  setSelectedView('all');
                  setSearchQuery('');
                }}
                style={{
                  marginTop: '6px',
                  padding: '6px 16px',
                  borderRadius: '8px',
                  border: '1px solid var(--colors-hairline-strong)',
                  background: 'var(--colors-canvas)',
                  color: 'var(--colors-ink)',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>

        {/* 5. Footer Summary Bar */}
        <div style={{
          padding: '12px 20px',
          background: 'var(--colors-surface-soft)',
          borderTop: '1px solid var(--colors-hairline)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '12px',
          color: 'var(--colors-body)',
          flexWrap: 'wrap',
          gap: '8px'
        }}>
          <div>
            Showing <strong>{filteredSessions.length}</strong> of <strong>{SESSIONS_DATA.length}</strong> sessions across CSJMU campus
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span>📍 Venues: Grand Auditorium, SBM Classrooms & Labs, UIET, OAT</span>
          </div>
        </div>
      </div>
    </div>
  );
}

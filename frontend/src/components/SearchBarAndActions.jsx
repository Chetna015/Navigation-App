import React, { useState } from 'react';
import { 
  Search, Mic, Bot, MapPin, Navigation, ArrowUpDown, X, Volume2, VolumeX, AlertTriangle, ChevronRight, Compass
} from 'lucide-react';
import { getMergedMapLocations } from '../utils/locationStore';

export default function SearchBarAndActions({
  currentLocation,
  destination,
  searchQuery,
  setSearchQuery,
  onSelectLocation,
  onOpenStalls,
  onOpenSessions,
  onOpenAIAssistant,
  onOpenShuttle,
  onOpenCampusLife,
  onOpenParking,
  onOpenSBMIndoor,
  isListening,
  startVoiceSearch,
  onStartPinningMode,
  onOpenManagePins,
  distanceMeters,
  stepsCount,
  isOffTrack,
  voiceEnabled,
  setVoiceEnabled
}) {
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Dropdown list of user-pinned locations for the "TO" input bar
  const getSuggestions = () => {
    const activeLocations = getMergedMapLocations();
    if (!searchQuery.trim()) {
      return activeLocations.map(item => ({ ...item, type: 'location' }));
    }
    const query = searchQuery.toLowerCase();

    const matchedLocations = activeLocations.filter(loc => 
      loc.name.toLowerCase().includes(query) || 
      (loc.tags && loc.tags.some(tag => tag.includes(query)))
    ).map(item => ({ ...item, type: 'location' }));

    return matchedLocations;
  };

  const suggestions = getSuggestions();

  return (
    <div className="search-bar-floating-container" style={{
      padding: '12px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      background: 'transparent',
      borderBottom: 'none'
    }}>
      {/* OFF-TRACK DISTRACTION WARNING TOAST */}
      {isOffTrack && (
        <div style={{
          background: 'var(--colors-surface-dark)',
          border: '1px solid var(--colors-hairline-strong)',
          color: '#EF4444',
          padding: '10px 16px',
          borderRadius: '9999px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '13px',
          fontWeight: 600,
          fontFamily: 'var(--font-main)'
        }}>
          <AlertTriangle size={16} color="#EF4444" />
          <span>⚠️ OFF-TRACK DISTRACTION WARNING: You have drifted away from your destination! Turn around to reconnect.</span>
        </div>
      )}

      {/* RECTANGLE FORM NAVIGATION SEARCH CARD */}
      <div className="search-bar-inner-card" style={{
        background: 'var(--colors-surface-card)',
        border: '1px solid var(--colors-hairline)',
        borderRadius: '12px',
        padding: '14px 18px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        position: 'relative'
      }}>
        {/* ROW 1: FROM (Auto-Filled with Live Location) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          background: 'var(--colors-surface-soft)',
          border: '1px solid var(--colors-hairline)',
          borderRadius: '9999px',
          padding: '6px 14px',
          gap: '10px'
        }}>
          <div style={{ background: 'var(--colors-primary)', borderRadius: '50%', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MapPin size={12} color="var(--colors-on-primary)" />
          </div>
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--colors-ink)', fontFamily: 'var(--font-heading)', minWidth: '45px' }}>FROM:</span>
          <input
            type="text"
            readOnly
            value={currentLocation?.name || 'You Are Here 📍'}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              color: 'var(--colors-ink)',
              fontSize: '13px',
              fontWeight: 500,
              fontFamily: 'var(--font-main)',
              outline: 'none'
            }}
          />
        </div>

        {/* ROW 2: TO (Blank Input Field in Rectangle Form) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          background: 'var(--colors-surface-soft)',
          border: '1px solid var(--colors-hairline-strong)',
          borderRadius: '9999px',
          padding: '6px 14px',
          gap: '10px',
          position: 'relative'
        }}>
          <div style={{ background: 'var(--colors-primary)', borderRadius: '50%', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Navigation size={12} color="var(--colors-on-primary)" />
          </div>
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--colors-ink)', fontFamily: 'var(--font-heading)', minWidth: '45px' }}>TO:</span>
          <input
            type="text"
            placeholder="Where to? (e.g. Senate Hall, UIET, Auditorium)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              color: 'var(--colors-ink)',
              fontSize: '13px',
              fontWeight: 500,
              fontFamily: 'var(--font-main)',
              outline: 'none'
            }}
          />
          {searchQuery && (
            <X
              size={16}
              color="var(--colors-body)"
              style={{ cursor: 'pointer' }}
              onClick={() => setSearchQuery('')}
            />
          )}

          {/* Voice Search Mic Symbol Button */}
          <button
            onClick={startVoiceSearch}
            title="Search by Voice"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: isListening ? '#EF4444' : 'var(--colors-primary)',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
              padding: 0
            }}
          >
            <Mic size={15} color="var(--colors-on-primary)" />
          </button>
        </div>

        {/* ROW 2.5: CUSTOM PINS ACTIONS (LOCAL DEV / LOCALHOST ONLY) */}
        {(import.meta.env.DEV || (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'))) && (
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '2px' }}>
            {onStartPinningMode && (
              <button
                onClick={onStartPinningMode}
                title="Click to drop a pin on the map"
                className="ollama-btn-primary"
                style={{
                  padding: '4px 12px',
                  fontSize: '12px',
                  height: '28px',
                  whiteSpace: 'nowrap'
                }}
              >
                📍 Pin Location
              </button>
            )}

            {onOpenManagePins && (
              <button
                onClick={onOpenManagePins}
                title="Manage location pins"
                className="ollama-btn-secondary"
                style={{
                  padding: '4px 12px',
                  fontSize: '12px',
                  height: '28px',
                  whiteSpace: 'nowrap'
                }}
              >
                📍 Manage Pins
              </button>
            )}
          </div>
        )}

        {/* ROW 3: SMART CAMPUS LIFE & MOBILITY QUICK ACTIONS */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '2px' }}>
          {onOpenSBMIndoor && (
            <button
              onClick={onOpenSBMIndoor}
              className="ollama-btn-secondary"
              style={{ height: '30px', padding: '0 12px', fontSize: '11px', borderRadius: '9999px' }}
            >
              🏢 SBM Rooms & Watercoolers
            </button>
          )}

          {onOpenShuttle && (
            <button
              onClick={onOpenShuttle}
              className="ollama-btn-secondary"
              style={{ height: '30px', padding: '0 12px', fontSize: '11px', borderRadius: '9999px' }}
            >
              🚌 E-Rickshaw Tracker
            </button>
          )}

          {onOpenCampusLife && (
            <button
              onClick={onOpenCampusLife}
              className="ollama-btn-secondary"
              style={{ height: '30px', padding: '0 12px', fontSize: '11px', borderRadius: '9999px' }}
            >
              🍔 Canteen & Library Meter
            </button>
          )}

          {onOpenParking && (
            <button
              onClick={onOpenParking}
              className="ollama-btn-secondary"
              style={{ height: '30px', padding: '0 12px', fontSize: '11px', borderRadius: '9999px' }}
            >
              🅿️ Parking Availability
            </button>
          )}
        </div>

        {/* SUGGESTIONS DROPDOWN */}
        {showSuggestions && (
          <div style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            left: 0,
            right: 0,
            zIndex: 999,
            background: 'var(--colors-surface-card)',
            border: '1px solid var(--colors-hairline-strong)',
            borderRadius: '12px',
            boxShadow: 'var(--shadow-md)',
            maxHeight: '260px',
            overflowY: 'auto',
            padding: '8px'
          }}>
            {suggestions.length === 0 ? (
              <div style={{ padding: '14px', textAlign: 'center', color: 'var(--colors-body)', fontSize: '13px', fontFamily: 'var(--font-main)' }}>
                No results found.
              </div>
            ) : (
              suggestions.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectLocation(item);
                    setSearchQuery(item.name);
                    setShowSuggestions(false);
                  }}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '4px',
                    background: 'var(--colors-surface-soft)',
                    transition: 'background-color 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <MapPin size={14} color="var(--colors-ink)" />
                    <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--colors-ink)', fontFamily: 'var(--font-main)' }}>{item.name}</div>
                  </div>
                  <ChevronRight size={16} color="var(--colors-mute)" />
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

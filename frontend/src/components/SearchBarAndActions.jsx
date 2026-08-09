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
    <div style={{
      padding: '14px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      background: 'var(--bg-surface)',
      borderBottom: '1px solid var(--border-glass)'
    }}>
      {/* OFF-TRACK DISTRACTION WARNING TOAST */}
      {isOffTrack && (
        <div className="animate-pulse" style={{
          background: 'linear-gradient(135deg, #7F1D1D 0%, #991B1B 100%)',
          border: '1.5px solid #EF4444',
          color: '#FFF',
          padding: '10px 16px',
          borderRadius: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          boxShadow: '0 0 25px rgba(239, 68, 68, 0.6)',
          fontSize: '13px',
          fontWeight: 800
        }}>
          <AlertTriangle size={18} color="#FFD1D1" />
          <span>⚠️ OFF-TRACK DISTRACTION WARNING: You have drifted away from your destination! Turn around to reconnect.</span>
        </div>
      )}

      {/* RECTANGLE FORM NAVIGATION SEARCH CARD */}
      <div style={{
        background: 'rgba(10, 20, 38, 0.95)',
        border: '1.5px solid rgba(0, 240, 255, 0.35)',
        borderRadius: '20px',
        padding: '14px 18px',
        boxShadow: '0 0 30px rgba(0, 240, 255, 0.15)',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        position: 'relative'
      }}>
        {/* ROW 1: FROM (Auto-Filled with Live Location) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '12px',
          padding: '8px 14px',
          gap: '10px'
        }}>
          <div style={{ background: '#10B981', borderRadius: '50%', padding: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MapPin size={14} color="#FFF" />
          </div>
          <span style={{ fontSize: '11px', fontWeight: 900, color: '#10B981', minWidth: '45px' }}>FROM:</span>
          <input
            type="text"
            readOnly
            value={currentLocation ? `${currentLocation.name} (Lat: ${currentLocation.lat ? currentLocation.lat.toFixed(4) : '26.4970'}° N, Lng: ${currentLocation.lng ? currentLocation.lng.toFixed(4) : '80.2666'}° E)` : 'You Are Here 📍 (Lat: 26.4970° N, Lng: 80.2666° E)'}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              color: '#FFF',
              fontSize: '13px',
              fontWeight: 700,
              outline: 'none'
            }}
          />
          <span style={{
            background: 'rgba(16, 185, 129, 0.2)',
            border: '1px solid #10B981',
            color: '#10B981',
            fontSize: '10px',
            fontWeight: 900,
            padding: '3px 8px',
            borderRadius: '10px',
            whiteSpace: 'nowrap'
          }}>
            YOU ARE HERE 📍
          </span>
        </div>

        {/* ROW 2: TO (Blank Input Field in Rectangle Form) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          background: 'rgba(0, 240, 255, 0.06)',
          border: '1.5px solid rgba(0, 240, 255, 0.4)',
          borderRadius: '12px',
          padding: '8px 14px',
          gap: '10px',
          position: 'relative'
        }}>
          <div style={{ background: '#EF4444', borderRadius: '50%', padding: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Navigation size={14} color="#FFF" />
          </div>
          <span style={{ fontSize: '11px', fontWeight: 900, color: '#EF4444', minWidth: '45px' }}>TO:</span>
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
              color: '#FFF',
              fontSize: '13px',
              fontWeight: 700,
              outline: 'none'
            }}
          />
          {searchQuery && (
            <X
              size={16}
              color="var(--text-muted)"
              style={{ cursor: 'pointer' }}
              onClick={() => setSearchQuery('')}
            />
          )}

          {/* Voice Search Mic Button */}
          <button
            onClick={startVoiceSearch}
            title="Voice Search"
            style={{
              background: isListening ? 'var(--color-rose)' : 'rgba(0, 102, 255, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <Mic size={15} color={isListening ? '#FFF' : 'var(--color-cyan)'} />
          </button>

          {/* AI Guide Button */}
          <button
            onClick={onOpenAIAssistant}
            style={{
              background: 'linear-gradient(135deg, #0066FF 0%, #00F0FF 100%)',
              border: 'none',
              borderRadius: '12px',
              padding: '6px 12px',
              color: '#FFF',
              fontSize: '12px',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            <Bot size={14} /> AI Guide
          </button>

          {/* Pin Location & Manage Pins Buttons (ONLY Visible in Local Development Mode) */}
          {(import.meta.env.DEV || (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'))) && (
            <>
              {onStartPinningMode && (
                <button
                  onClick={onStartPinningMode}
                  title="Click to drop a pin on the map"
                  style={{
                    background: 'linear-gradient(135deg, #EF4444 0%, #FF6B81 100%)',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '6px 12px',
                    color: '#FFF',
                    fontSize: '12px',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    cursor: 'pointer',
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
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '12px',
                    padding: '6px 12px',
                    color: '#00F0FF',
                    fontSize: '12px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  📍 Manage Pins
                </button>
              )}
            </>
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
              background: 'rgba(10, 20, 38, 0.98)',
              backdropFilter: 'blur(20px)',
              border: '1.5px solid #00F0FF',
              borderRadius: '16px',
              boxShadow: '0 10px 40px rgba(0,0,0,0.8), 0 0 25px rgba(0, 240, 255, 0.3)',
              maxHeight: '260px',
              overflowY: 'auto',
              padding: '8px'
            }}>
              {suggestions.length === 0 ? (
                <div style={{ padding: '14px', textAlign: 'center', color: '#EF4444', fontSize: '12px', fontWeight: 800 }}>
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
                      padding: '10px 12px',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '4px',
                      background: 'rgba(255, 255, 255, 0.03)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <MapPin size={14} color="#00F0FF" />
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#FFF' }}>{item.name}</div>
                    </div>
                    <ChevronRight size={16} color="var(--text-muted)" />
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
  );
}

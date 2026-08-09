import React, { useState, useEffect } from 'react';
import { 
  MapPin, X, Trash2, Plus, RotateCcw, Search, Eye, Sparkles, Building2
} from 'lucide-react';
import { getMergedCampusBuildings, getDeletedLocationIds, hideOrDeleteLocation, restoreAllDeletedLocations, getLocationOverrides } from '../utils/locationStore';
import { getStoredPlottedBuildings, deleteCustomPlottedBuilding } from '../utils/pathfinding';

export default function ManagePinsModal({
  isOpen,
  onClose,
  onStartPinningMode,
  onSelectLocationOnMap
}) {
  if (!isOpen) return null;

  const [searchQuery, setSearchQuery] = useState('');
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const handleUpdate = () => setTick(t => t + 1);
    window.addEventListener('csjmu_locations_updated', handleUpdate);
    return () => window.removeEventListener('csjmu_locations_updated', handleUpdate);
  }, []);

  const allBuildings = { ...getMergedCampusBuildings(), ...getStoredPlottedBuildings() };
  const deletedIds = getDeletedLocationIds();
  const overrides = getLocationOverrides();

  const locationsList = Object.values(allBuildings).filter(loc => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return loc.name.toLowerCase().includes(q) || 
           (loc.category && loc.category.toLowerCase().includes(q)) ||
           (loc.code && loc.code.toLowerCase().includes(q));
  });

  const handleDelete = (loc) => {
    if (confirm(`Are you sure you want to remove pin "${loc.name}" from the map?`)) {
      hideOrDeleteLocation(loc.id);
      deleteCustomPlottedBuilding(loc.id);
      setTick(t => t + 1);
    }
  };

  const handleClearAllCustomPins = () => {
    if (confirm("Are you sure you want to delete all saved location pins permanently?")) {
      try {
        localStorage.removeItem('csjmu_custom_plotted_buildings');
        localStorage.removeItem('csjmu_location_latlng_overrides');
        localStorage.removeItem('csjmu_deleted_location_ids');
        window.dispatchEvent(new CustomEvent('csjmu_locations_updated', { detail: {} }));
        setTick(t => t + 1);
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 1100,
      background: 'rgba(7, 11, 20, 0.85)',
      backdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="glass-panel animate-scale-up" style={{
        width: '100%',
        maxWidth: '620px',
        maxHeight: '85vh',
        borderRadius: '24px',
        border: '1px solid var(--border-glass-light)',
        boxShadow: 'var(--shadow-glow)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Modal Header */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(0, 102, 255, 0.2) 100%)',
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-glass)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #EF4444 0%, #0066FF 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(239, 68, 68, 0.5)'
            }}>
              <MapPin size={22} color="#FFF" />
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#FFF' }}>
                Manage Location Pins & Custom Plotting
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--color-cyan)' }}>
                Drop new custom pins on the map — saved permanently in LocalStorage
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="btn-glass"
            style={{ width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <X size={18} color="var(--text-muted)" />
          </button>
        </div>

        {/* Actions Toolbar */}
        <div style={{
          padding: '16px 24px',
          borderBottom: '1px solid var(--border-glass)',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '10px',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(255, 255, 255, 0.02)'
        }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search custom location pins..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px 8px 36px',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-glass)',
                color: '#FFF',
                fontSize: '13px',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => {
                onClose();
                if (onStartPinningMode) onStartPinningMode();
              }}
              style={{
                background: 'linear-gradient(135deg, #EF4444 0%, #FF6B81 100%)',
                border: 'none',
                color: '#FFF',
                padding: '8px 14px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 0 12px rgba(239, 68, 68, 0.4)'
              }}
            >
              <Plus size={16} /> Pin New Location on Map
            </button>

            <button
              onClick={() => {
                const exportData = JSON.stringify(Object.values(allBuildings), null, 2);
                navigator.clipboard.writeText(exportData);
                alert("📋 Copied your exact pinned locations JSON to your clipboard!\n\nPaste this text into the chat so we can push your exact coordinates permanently to Vercel.");
              }}
              style={{
                background: 'rgba(0, 240, 255, 0.15)',
                border: '1px solid #00F0FF',
                color: '#00F0FF',
                padding: '8px 14px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
              title="Copy your exact custom pinned locations JSON to clipboard"
            >
              📋 Copy Pinned Locations Code
            </button>

            {locationsList.length > 0 && (
              <button
                onClick={handleClearAllCustomPins}
                style={{
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  color: '#FF6B81',
                  padding: '8px 12px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
                title="Clear all saved custom pins"
              >
                <Trash2 size={14} /> Clear All Pins
              </button>
            )}
          </div>
        </div>

        {/* Location Pins List */}
        <div style={{
          padding: '16px 24px',
          overflowY: 'auto',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          {locationsList.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MapPin size={26} color="#EF4444" />
              </div>
              <h4 style={{ color: '#FFF', fontSize: '16px', fontWeight: 800 }}>No Location Pins Yet</h4>
              <p style={{ fontSize: '13px', maxWidth: '380px', lineHeight: '1.5', color: 'var(--text-muted)' }}>
                All location pins have been cleared. Click <strong>"Pin New Location on Map"</strong> or click anywhere directly on the map to drop custom pins. Your pins will be saved permanently in browser LocalStorage.
              </p>
              <button
                onClick={() => {
                  onClose();
                  if (onStartPinningMode) onStartPinningMode();
                }}
                style={{
                  marginTop: '8px',
                  background: 'linear-gradient(135deg, #EF4444 0%, #FF6B81 100%)',
                  border: 'none',
                  color: '#FFF',
                  padding: '10px 18px',
                  borderRadius: '12px',
                  fontSize: '13px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 0 16px rgba(239, 68, 68, 0.4)'
                }}
              >
                <Plus size={16} /> Drop Your First Pin Now
              </button>
            </div>
          ) : (
            locationsList.map(loc => {
              const isMainGate = loc.id === 'loc_main_gate' || loc.name.toLowerCase().includes('main gate');
              return (
                <div
                  key={loc.id}
                  style={{
                    background: isMainGate ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255, 255, 255, 0.03)',
                    border: isMainGate ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid var(--border-glass)',
                    borderRadius: '16px',
                    padding: '14px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      background: isMainGate ? '#EF4444' : '#0066FF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFF',
                      fontSize: '16px',
                      boxShadow: isMainGate ? '0 0 12px rgba(239, 68, 68, 0.6)' : '0 0 10px rgba(0, 102, 255, 0.4)'
                    }}>
                      {isMainGate ? '📍' : '🏢'}
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '14px', fontWeight: 800, color: '#FFF' }}>
                          {loc.name}
                        </span>
                      </div>
                      <div style={{ fontSize: '12px', color: '#00F0FF', marginTop: '2px', fontFamily: 'monospace', fontWeight: 700 }}>
                        📍 Lat: {loc.lat ? loc.lat.toFixed(6) : '26.49830'}° N | Lng: {loc.lng ? loc.lng.toFixed(6) : '80.26580'}° E
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      onClick={() => {
                        if (onSelectLocationOnMap) onSelectLocationOnMap(loc);
                        onClose();
                      }}
                      style={{
                        background: 'rgba(0, 240, 255, 0.15)',
                        border: '1px solid rgba(0, 240, 255, 0.3)',
                        color: '#00F0FF',
                        padding: '6px 12px',
                        borderRadius: '10px',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <Eye size={14} /> Fly To
                    </button>

                    <button
                      onClick={() => handleDelete(loc)}
                      style={{
                        background: 'rgba(244, 63, 94, 0.15)',
                        border: '1px solid rgba(244, 63, 94, 0.3)',
                        color: '#F43F5E',
                        padding: '6px 10px',
                        borderRadius: '10px',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                      title="Remove this location pin"
                    >
                      <Trash2 size={14} /> Remove
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

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
      background: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '620px',
        maxHeight: '85vh',
        borderRadius: '24px',
        background: '#F1F5F9',
        border: '2px solid #EA580C',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Modal Header */}
        <div style={{
          background: 'linear-gradient(135deg, #EA580C 0%, #C2410C 100%)',
          padding: '20px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: '#9A3412',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)'
            }}>
              <MapPin size={22} color="#FFF" />
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#FFF' }}>
                Manage Location Pins & Custom Plotting
              </h3>
              <p style={{ fontSize: '12px', color: '#FFEDD5', fontWeight: 600 }}>
                Drop new custom pins on the map — saved permanently in LocalStorage
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={18} color="#FFF" />
          </button>
        </div>

        {/* Actions Toolbar */}
        <div style={{
          padding: '16px 24px',
          borderBottom: '1px solid #CBD5E1',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '10px',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#F8FAFC'
        }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
            <Search size={16} color="#EA580C" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search custom location pins..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px 10px 36px',
                borderRadius: '12px',
                background: '#FFFFFF',
                border: '1.5px solid #CBD5E1',
                color: '#0F172A',
                fontSize: '13px',
                fontWeight: 700,
                outline: 'none'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={() => {
                onClose();
                if (onStartPinningMode) onStartPinningMode();
              }}
              style={{
                background: '#EA580C',
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
                boxShadow: '0 4px 12px rgba(234, 88, 12, 0.35)'
              }}
            >
              <Plus size={16} color="#FFF" /> Pin New Location on Map
            </button>

            <button
              onClick={() => {
                const exportData = JSON.stringify(Object.values(allBuildings), null, 2);
                navigator.clipboard.writeText(exportData);
                alert("📋 Copied your exact pinned locations JSON to your clipboard!\n\nPaste this text into the chat so we can push your exact coordinates permanently to Vercel.");
              }}
              style={{
                background: '#FFF7ED',
                border: '1.5px solid #EA580C',
                color: '#C2410C',
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
                  background: '#FEF2F2',
                  border: '1.5px solid #EF4444',
                  color: '#DC2626',
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
                <Trash2 size={14} color="#DC2626" /> Clear All Pins
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
          gap: '10px',
          background: '#F1F5F9'
        }}>
          {locationsList.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#334155', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: '#FFEDD5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MapPin size={26} color="#EA580C" />
              </div>
              <h4 style={{ color: '#0F172A', fontSize: '16px', fontWeight: 800 }}>No Location Pins Yet</h4>
              <p style={{ fontSize: '13px', maxWidth: '380px', lineHeight: '1.5', color: '#334155' }}>
                All location pins have been cleared. Click <strong>"Pin New Location on Map"</strong> or click anywhere directly on the map to drop custom pins. Your pins will be saved permanently in browser LocalStorage.
              </p>
              <button
                onClick={() => {
                  onClose();
                  if (onStartPinningMode) onStartPinningMode();
                }}
                style={{
                  marginTop: '8px',
                  background: '#EA580C',
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
                  boxShadow: '0 4px 12px rgba(234, 88, 12, 0.35)'
                }}
              >
                <Plus size={16} color="#FFF" /> Drop Your First Pin Now
              </button>
            </div>
          ) : (
            locationsList.map(loc => {
              const isMainGate = loc.id === 'loc_main_gate' || loc.name.toLowerCase().includes('main gate');
              return (
                <div
                  key={loc.id}
                  style={{
                    background: '#FFFFFF',
                    border: '1.5px solid #CBD5E1',
                    borderRadius: '16px',
                    padding: '14px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '10px',
                      background: '#FFEDD5',
                      border: '1px solid #FDBA74',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#EA580C',
                      fontSize: '18px'
                    }}>
                      <MapPin size={20} color="#EA580C" />
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A' }}>
                          {loc.name}
                        </span>
                      </div>
                      <div style={{ fontSize: '12px', color: '#C2410C', marginTop: '2px', fontFamily: 'monospace', fontWeight: 700 }}>
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
                        background: '#FFEDD5',
                        border: '1.5px solid #EA580C',
                        color: '#C2410C',
                        padding: '6px 14px',
                        borderRadius: '10px',
                        fontSize: '12px',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <Eye size={14} color="#EA580C" /> Fly To
                    </button>

                    <button
                      onClick={() => handleDelete(loc)}
                      style={{
                        background: '#FEF2F2',
                        border: '1.5px solid #EF4444',
                        color: '#DC2626',
                        padding: '6px 12px',
                        borderRadius: '10px',
                        fontSize: '12px',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <Trash2 size={14} color="#DC2626" /> Remove
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

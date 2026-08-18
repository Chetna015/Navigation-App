import React, { useState, useEffect } from 'react';
import { MapPin, X, Save, RotateCcw, CheckCircle2, AlertCircle, Edit3, Compass } from 'lucide-react';
import { 
  getLocationOverrides, 
  saveLocationOverride, 
  resetLocationOverride, 
  getMergedMapLocations 
} from '../utils/locationStore';
import { getStoredPlottedBuildings } from '../utils/pathfinding';

export default function EditLocationModal({
  isOpen,
  onClose,
  initialLocation,
  onLocationSaved
}) {
  // Build combined list of all locations (default + custom)
  const [allLocations, setAllLocations] = useState([]);
  const [selectedLocId, setSelectedLocId] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  // Load locations on mount/open
  useEffect(() => {
    const defaultLocs = getMergedMapLocations();
    const customLocsObj = getStoredPlottedBuildings();
    const customLocsList = Object.values(customLocsObj).map(bld => ({
      id: bld.id,
      name: bld.name,
      category: bld.category || 'Custom Building',
      floor: bld.floor || 'outdoor',
      lat: bld.lat,
      lng: bld.lng,
      x: bld.x,
      y: bld.y,
      description: bld.description,
      isCustom: true
    }));

    const combined = [...defaultLocs, ...customLocsList];
    setAllLocations(combined);

    // Initial selected location
    const initId = initialLocation ? initialLocation.id : (combined[0]?.id || 'loc_main_gate');
    setSelectedLocId(initId);
  }, [initialLocation, isOpen]);

  // Update form fields when selected location changes
  useEffect(() => {
    if (!selectedLocId || allLocations.length === 0) return;
    const locObj = allLocations.find(l => l.id === selectedLocId);
    if (locObj) {
      setLat(locObj.lat !== undefined ? String(locObj.lat) : '26.4983');
      setLng(locObj.lng !== undefined ? String(locObj.lng) : '80.2658');
      setName(locObj.name || '');
      setCategory(locObj.category || 'outdoor');
      setDescription(locObj.description || '');
    }
  }, [selectedLocId, allLocations]);

  const handleSave = (e) => {
    e.preventDefault();
    if (!selectedLocId) return;

    const parsedLat = parseFloat(lat);
    const parsedLng = parseFloat(lng);

    if (isNaN(parsedLat) || isNaN(parsedLng)) {
      showToast("Please enter valid numeric latitude and longitude values.", "error");
      return;
    }

    if (parsedLat < -90 || parsedLat > 90 || parsedLng < -180 || parsedLng > 180) {
      showToast("Latitude must be between -90 and 90, and Longitude between -180 and 180.", "error");
      return;
    }

    const updated = saveLocationOverride(selectedLocId, {
      lat: parsedLat,
      lng: parsedLng,
      name: name.trim(),
      category,
      description: description.trim()
    });

    showToast(`Successfully updated coordinates for "${name || selectedLocId}"!`, "success");

    if (onLocationSaved) {
      onLocationSaved({
        id: selectedLocId,
        ...updated
      });
    }

    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const handleReset = () => {
    if (!selectedLocId) return;
    resetLocationOverride(selectedLocId);
    showToast("Reset location back to original default coordinates.", "success");
    
    // Refresh local state
    const defaultLocs = getMergedMapLocations();
    setAllLocations(defaultLocs);
    const resetObj = defaultLocs.find(l => l.id === selectedLocId);
    if (resetObj) {
      setLat(String(resetObj.lat));
      setLng(String(resetObj.lng));
      setName(resetObj.name);
    }
  };

  const showToast = (msg, type = "success") => {
    setToastMessage({ text: msg, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleGetLiveGPS = () => {
    if (!navigator.geolocation) {
      showToast("Geolocation is not supported by your browser.", "error");
      return;
    }
    showToast("Requesting device GPS location...", "success");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude.toFixed(6));
        setLng(pos.coords.longitude.toFixed(6));
        showToast("📍 Live GPS coordinates captured successfully!", "success");
      },
      (err) => {
        showToast(`GPS Error: ${err.message}. Ensure location permissions are granted.`, "error");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  if (!isOpen) return null;

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
        maxWidth: '560px',
        borderRadius: '24px',
        border: '1px solid var(--border-glass-light)',
        boxShadow: 'var(--shadow-glow)',
        overflow: 'hidden',
        background: 'rgba(14, 23, 38, 0.96)'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(0, 102, 255, 0.25) 0%, rgba(0, 240, 255, 0.12) 100%)',
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-glass)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #0066FF 0%, #00F0FF 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(0, 240, 255, 0.5)'
            }}>
              <Edit3 size={22} color="#FFF" />
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#FFF' }}>
                Edit Location Coordinates
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--color-cyan)' }}>
                Manually Enter Latitude & Longitude or Capture Live GPS
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

        {/* Toast Notification */}
        {toastMessage && (
          <div style={{
            background: toastMessage.type === 'error' ? 'rgba(244, 63, 94, 0.9)' : 'rgba(16, 185, 129, 0.9)',
            color: '#FFF',
            padding: '12px 20px',
            fontSize: '13px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            {toastMessage.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
            {toastMessage.text}
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSave} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Location Picker Dropdown */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>
              Select Location to Edit *
            </label>
            <select
              value={selectedLocId}
              onChange={(e) => setSelectedLocId(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '12px',
                background: 'rgba(15, 23, 42, 0.9)',
                border: '1px solid var(--border-glass)',
                color: '#FFF',
                fontSize: '14px',
                fontWeight: 700,
                outline: 'none'
              }}
            >
              {allLocations.map(loc => (
                <option key={loc.id} value={loc.id} style={{ background: '#0F172A', color: '#FFF' }}>
                  {loc.name} {loc.isEdited ? ' (Custom Coordinates)' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Latitude and Longitude Editable Inputs */}
          <div style={{
            background: 'rgba(0, 240, 255, 0.04)',
            border: '1px solid rgba(0, 240, 255, 0.2)',
            borderRadius: '16px',
            padding: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--color-cyan)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Compass size={16} /> Enter Exact GPS Coordinates:
              </div>

              <button
                type="button"
                onClick={handleGetLiveGPS}
                style={{
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  color: '#10B981',
                  padding: '5px 10px',
                  borderRadius: '10px',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                📡 Capture Live Device GPS
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>
                  Latitude (°N) *
                </label>
                <input
                  type="number"
                  step="any"
                  required
                  placeholder="e.g. 26.498300"
                  value={lat}
                  onChange={(e) => setLat(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '12px',
                    background: 'rgba(0, 0, 0, 0.4)',
                    border: '1px solid var(--border-glass-light)',
                    color: '#00F0FF',
                    fontFamily: 'monospace',
                    fontSize: '15px',
                    fontWeight: 700,
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>
                  Longitude (°E) *
                </label>
                <input
                  type="number"
                  step="any"
                  required
                  placeholder="e.g. 80.265800"
                  value={lng}
                  onChange={(e) => setLng(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '12px',
                    background: 'rgba(0, 0, 0, 0.4)',
                    border: '1px solid var(--border-glass-light)',
                    color: '#00F0FF',
                    fontFamily: 'monospace',
                    fontSize: '15px',
                    fontWeight: 700,
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '10px' }}>
              💡 <em>CSJMU University Campus Reference Range:</em> Lat 26.4940 to 26.5030 N • Lng 80.2600 to 80.2720 E
            </div>
          </div>

          {/* Location Name */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>
              Location Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-glass)',
                color: '#FFF',
                fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>

          {/* Description */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>
              Description / Notes
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Facility details, landmark notes..."
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-glass)',
                color: '#FFF',
                fontSize: '13px',
                outline: 'none',
                resize: 'none'
              }}
            />
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px' }}>
            <button
              type="submit"
              style={{
                flex: 1,
                padding: '14px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #0066FF 0%, #00F0FF 100%)',
                color: '#FFF',
                border: 'none',
                fontSize: '14px',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 0 20px rgba(0, 240, 255, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <Save size={18} /> Save Location Coordinates
            </button>

            {selectedLocObj?.isEdited && (
              <button
                type="button"
                onClick={handleReset}
                title="Reset to Original Default Coordinates"
                style={{
                  padding: '14px 16px',
                  borderRadius: '14px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid var(--border-glass)',
                  color: 'var(--text-muted)',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <RotateCcw size={16} /> Reset
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

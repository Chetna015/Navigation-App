import React, { useState, useEffect } from 'react';
import { Building2, X, Plus } from 'lucide-react';
import { saveCustomPlottedBuilding } from '../utils/pathfinding';

export default function BuildingPlotterModal({
  isOpen,
  onClose,
  initialLatLng,
  onBuildingPlotted
}) {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [category, setCategory] = useState('Entrance');
  const [floors, setFloors] = useState(1);
  const [departmentsText, setDepartmentsText] = useState('');
  const [description, setDescription] = useState('');

  const [lat, setLat] = useState(initialLatLng ? initialLatLng.lat.toFixed(6) : '26.503020');
  const [lng, setLng] = useState(initialLatLng ? initialLatLng.lng.toFixed(6) : '80.267490');

  useEffect(() => {
    if (initialLatLng) {
      setLat(initialLatLng.lat.toFixed(6));
      setLng(initialLatLng.lng.toFixed(6));
    }
  }, [initialLatLng]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const depts = departmentsText.trim()
      ? departmentsText.split(',').map(s => s.trim())
      : ['General Dept', 'Faculty Offices'];

    const newBuilding = saveCustomPlottedBuilding({
      name: name.trim(),
      code: code.trim() || `BLD-${Math.floor(100 + Math.random() * 900)}`,
      category,
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      floors: parseInt(floors, 10),
      description: description.trim() || `Custom Plotted University Facility`,
      departments: depts
    });

    if (onBuildingPlotted) {
      onBuildingPlotted(newBuilding);
    }
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 1000,
      background: 'rgba(7, 11, 20, 0.82)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="glass-panel animate-scale-up" style={{
        width: '100%',
        maxWidth: '540px',
        borderRadius: '24px',
        border: '1px solid var(--border-glass-light)',
        boxShadow: 'var(--shadow-glow)',
        overflow: 'hidden'
      }}>
        {/* Modal Header */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(0, 102, 255, 0.2) 0%, rgba(0, 240, 255, 0.1) 100%)',
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
              background: 'linear-gradient(135deg, #0066FF 0%, #00F0FF 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Building2 size={22} color="#FFF" />
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#FFF' }}>
                📍 Pin & Tag Location on Map
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--color-cyan)' }}>
                Set exact coordinates, tag, pin color, and name for any campus location
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

        {/* Modal Form */}
        <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>
              Location Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. CSJMU Main Gate 1 (GT Road), UIET Block, Canteen"
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>
                Location Code / Tag
              </label>
              <input
                type="text"
                placeholder="e.g. GATE-01, BLD-UIET"
                value={code}
                onChange={(e) => setCode(e.target.value)}
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

            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>
                Pin Tag & Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  background: 'rgba(14, 23, 38, 0.9)',
                  border: '1px solid var(--border-glass)',
                  color: '#FFF',
                  fontSize: '14px',
                  outline: 'none'
                }}
              >
                <option value="Entrance">📍 Gate & Entrance (Red Pin)</option>
                <option value="Academic">🏢 Academic Wing (Blue Pin)</option>
                <option value="Administration">🏛️ Administration</option>
                <option value="Parking">🅿️ Parking Area</option>
                <option value="Dining">🍔 Cafeteria & Food</option>
                <option value="Hostel">🏨 Student Hostel</option>
                <option value="Sports">🏟️ Sports & SAC</option>
                <option value="Custom">🏷️ Custom Location Tag</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>
                Floors
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={floors}
                onChange={(e) => setFloors(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 12px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-glass)',
                  color: '#FFF',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>
                Latitude (°N) *
              </label>
              <input
                type="number"
                step="any"
                required
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 10px',
                  borderRadius: '12px',
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: '1px solid rgba(0, 240, 255, 0.3)',
                  color: '#00F0FF',
                  fontSize: '13px',
                  fontFamily: 'monospace',
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
                value={lng}
                onChange={(e) => setLng(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 10px',
                  borderRadius: '12px',
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: '1px solid rgba(0, 240, 255, 0.3)',
                  color: '#00F0FF',
                  fontSize: '13px',
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>
              Departments & Laboratories (Comma separated)
            </label>
            <input
              type="text"
              placeholder="e.g. AI Research Lab, Neural Net Lab, Dean Office"
              value={departmentsText}
              onChange={(e) => setDepartmentsText(e.target.value)}
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

          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>
              Building Description
            </label>
            <textarea
              rows="2"
              placeholder="Detailed description of facility..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-glass)',
                color: '#FFF',
                fontSize: '14px',
                outline: 'none',
                resize: 'none'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn-glass"
              style={{ flex: 1, padding: '12px', borderRadius: '12px', fontWeight: 700 }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #0066FF 0%, #00F0FF 100%)',
                color: '#FFF',
                fontWeight: 800,
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 0 20px rgba(0, 240, 255, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <Plus size={18} /> Plot Building on Map
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

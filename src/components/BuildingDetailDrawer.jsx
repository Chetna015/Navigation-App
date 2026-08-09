import React from 'react';
import { 
  Building2, X, Navigation, Layers, Trash2, MapPin
} from 'lucide-react';
import { deleteCustomPlottedBuilding } from '../utils/pathfinding';
import { hideOrDeleteLocation } from '../utils/locationStore';

export default function BuildingDetailDrawer({
  building,
  onClose,
  onNavigateToBuilding,
  onBuildingDeleted,
  onEditCoordinates,
  onOpen3DView
}) {
  if (!building) return null;

  const handleDelete = () => {
    if (confirm(`Are you sure you want to remove pin "${building.name}" from the map?`)) {
      hideOrDeleteLocation(building.id);
      deleteCustomPlottedBuilding(building.id);
      if (onBuildingDeleted) onBuildingDeleted(building.id);
      onClose();
    }
  };

  return (
    <div className="glass-card animate-slide-up" style={{
      position: 'absolute',
      top: '20px',
      right: '20px',
      width: '380px',
      maxHeight: 'calc(100% - 40px)',
      overflowY: 'auto',
      zIndex: 700,
      borderRadius: '24px',
      border: '1px solid var(--border-glass-light)',
      boxShadow: 'var(--shadow-glow)',
      background: 'rgba(14, 23, 38, 0.94)',
      backdropFilter: 'blur(20px)',
      padding: '24px'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #0066FF 0%, #00F0FF 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(0, 240, 255, 0.4)'
          }}>
            <Building2 size={22} color="#FFF" />
          </div>
          <div>
            <div style={{ fontSize: '13px', color: '#00F0FF', fontWeight: 800, fontFamily: 'monospace' }}>
              📍 Lat: {building.lat ? building.lat.toFixed(6) : '26.498300'}° N | Lng: {building.lng ? building.lng.toFixed(6) : '80.265800'}° E
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>
              CODE: {building.code || 'BLD-CSJMU'}
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="btn-glass"
          style={{ width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <X size={16} color="var(--text-muted)" />
        </button>
      </div>

      {/* Building Name */}
      <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#FFF', marginBottom: '8px' }}>
        {building.name}
      </h3>

      <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '18px', lineHeight: '1.5' }}>
        {building.description || 'Official University Infrastructure Facility'}
      </p>

      {/* Building Quick Metrics */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '10px',
        marginBottom: '20px'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid var(--border-glass)',
          borderRadius: '14px',
          padding: '12px'
        }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Layers size={13} color="var(--color-cyan)" /> Floors
          </div>
          <div style={{ fontSize: '16px', fontWeight: 800, color: '#FFF', marginTop: '2px' }}>
            {building.floors || 2} Storey Block
          </div>
        </div>

        <div style={{
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid var(--border-glass)',
          borderRadius: '14px',
          padding: '12px'
        }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <MapPin size={13} color="var(--color-emerald)" /> GPS Location
          </div>
          <div style={{ fontSize: '13px', fontWeight: 800, color: '#FFF', marginTop: '4px' }}>
            {building.lat ? `${building.lat.toFixed(4)}, ${building.lng.toFixed(4)}` : 'Campus Quad'}
          </div>
        </div>
      </div>

      {/* Department & Lab Directory */}
      <div style={{ marginBottom: '20px' }}>
        <h4 style={{ fontSize: '13px', fontWeight: 800, color: 'var(--color-cyan)', textTransform: 'uppercase', marginBottom: '10px' }}>
          🏢 Housed Departments & Labs
        </h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {(building.departments || ["Academic Wing", "Faculty Rooms"]).map((dept, idx) => (
            <span
              key={idx}
              style={{
                background: 'rgba(0, 102, 255, 0.12)',
                border: '1px solid rgba(0, 102, 255, 0.3)',
                color: '#FFF',
                padding: '6px 12px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 600
              }}
            >
              • {dept}
            </span>
          ))}
        </div>
      </div>

      {/* Floor Directory Breakdown */}
      <div style={{ marginBottom: '22px' }}>
        <h4 style={{ fontSize: '13px', fontWeight: 800, color: 'var(--color-cyan)', textTransform: 'uppercase', marginBottom: '10px' }}>
          📐 Floor Directory
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)', padding: '10px 14px', borderRadius: '12px', fontSize: '12px' }}>
            <strong style={{ color: '#00F0FF' }}>Ground Floor:</strong> Reception Foyer, Visitor Waiting Hall, Ramps
          </div>
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)', padding: '10px 14px', borderRadius: '12px', fontSize: '12px' }}>
            <strong style={{ color: '#10B981' }}>1st Floor:</strong> Primary Laboratories, Faculty Offices & Dean Chamber
          </div>
          {(building.floors || 2) > 2 && (
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)', padding: '10px 14px', borderRadius: '12px', fontSize: '12px' }}>
              <strong style={{ color: '#F59E0B' }}>2nd Floor+:</strong> Research Centers, Seminar Halls & Conference Suites
            </div>
          )}
        </div>
      </div>

      {/* Navigation Action Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {onOpen3DView && (
          <button
            onClick={() => onOpen3DView(building)}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #8B5CF6 0%, #D946EF 100%)',
              color: '#FFF',
              border: 'none',
              fontSize: '14px',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 0 20px rgba(217, 70, 239, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            🏢 View Building in 3D Model
          </button>
        )}

        <button
          onClick={() => onNavigateToBuilding(building)}
          style={{
            width: '100%',
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
          <Navigation size={18} /> Show Shortest Path to {building.name}
        </button>

        {onEditCoordinates && (
          <button
            onClick={() => onEditCoordinates(building)}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '12px',
              background: 'rgba(0, 240, 255, 0.1)',
              border: '1px solid rgba(0, 240, 255, 0.3)',
              color: '#00F0FF',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            ✏️ Edit Location Coordinates (Lat/Lng)
          </button>
        )}

        <button
          onClick={handleDelete}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '12px',
            background: 'rgba(244, 63, 94, 0.15)',
            border: '1px solid rgba(244, 63, 94, 0.4)',
            color: '#F43F5E',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.2s ease'
          }}
        >
          <Trash2 size={15} /> Remove / Delete Location Pin
        </button>
      </div>
    </div>
  );
}

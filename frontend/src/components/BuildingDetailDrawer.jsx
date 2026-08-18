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
  onOpen3DView,
  onOpenSBMIndoor
}) {
  const [selectedFloorLevel, setSelectedFloorLevel] = React.useState('Ground');

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
    <div className="animate-slide-up" style={{
      position: 'absolute',
      top: '20px',
      right: '20px',
      width: '380px',
      maxHeight: 'calc(100% - 40px)',
      overflowY: 'auto',
      zIndex: 700,
      borderRadius: '16px',
      border: '1px solid var(--colors-hairline-strong)',
      boxShadow: 'var(--shadow-md)',
      background: 'var(--colors-surface-card)',
      padding: '24px'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'var(--colors-surface-dark)',
            color: 'var(--colors-on-dark)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <Building2 size={20} color="var(--colors-on-dark)" />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--colors-ink)', fontWeight: 600, fontFamily: 'var(--font-code)' }}>
              📍 Lat: {building.lat ? building.lat.toFixed(6) : '26.498300'}° N | Lng: {building.lng ? building.lng.toFixed(6) : '80.265800'}° E
            </div>
            <div style={{ fontSize: '11px', color: 'var(--colors-body)', fontWeight: 500, fontFamily: 'var(--font-code)' }}>
              CODE: {building.code || 'BLD-CSJMU'}
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          title="Close Drawer"
          style={{
            width: '32px',
            height: '32px',
            minWidth: '32px',
            minHeight: '32px',
            borderRadius: '50%',
            background: '#000000',
            color: '#ffffff',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontWeight: 700,
            fontSize: '16px',
            lineHeight: 1
          }}
        >
          ✕
        </button>
      </div>

      {/* Building Name */}
      <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--colors-ink)', fontFamily: 'var(--font-heading)', marginBottom: '6px' }}>
        {building.name}
      </h3>

      <p style={{ fontSize: '13px', color: 'var(--colors-body)', fontFamily: 'var(--font-main)', marginBottom: '18px', lineHeight: '1.5' }}>
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
          background: 'var(--colors-surface-soft)',
          border: '1px solid var(--colors-hairline)',
          borderRadius: '12px',
          padding: '12px'
        }}>
          <div style={{ fontSize: '11px', color: 'var(--colors-body)', display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--font-main)' }}>
            <Layers size={13} color="var(--colors-ink)" /> Floors
          </div>
          <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--colors-ink)', fontFamily: 'var(--font-heading)', marginTop: '2px' }}>
            {building.floors || 2} Storey Block
          </div>
        </div>

        <div style={{
          background: 'var(--colors-surface-soft)',
          border: '1px solid var(--colors-hairline)',
          borderRadius: '12px',
          padding: '12px'
        }}>
          <div style={{ fontSize: '11px', color: 'var(--colors-body)', display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--font-main)' }}>
            <MapPin size={13} color="var(--colors-ink)" /> GPS Location
          </div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--colors-ink)', fontFamily: 'var(--font-code)', marginTop: '4px' }}>
            {building.lat ? `${building.lat.toFixed(4)}, ${building.lng.toFixed(4)}` : 'Campus Quad'}
          </div>
        </div>
      </div>

      {/* Department & Lab Directory */}
      <div style={{ marginBottom: '20px' }}>
        <h4 style={{ fontSize: '12px', fontWeight: 700, color: 'var(--colors-ink)', textTransform: 'uppercase', fontFamily: 'var(--font-heading)', marginBottom: '10px' }}>
          🏢 Housed Departments & Labs
        </h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {(building.departments || ["Academic Wing", "Faculty Rooms"]).map((dept, idx) => (
            <span
              key={idx}
              style={{
                background: 'var(--colors-surface-soft)',
                border: '1px solid var(--colors-hairline-strong)',
                color: 'var(--colors-ink)',
                padding: '5px 12px',
                borderRadius: '9999px',
                fontSize: '12px',
                fontWeight: 500,
                fontFamily: 'var(--font-main)'
              }}
            >
              • {dept}
            </span>
          ))}
        </div>
      </div>

      {/* Interactive Multi-Level Indoor Floor Plan Selector */}
      <div style={{ marginBottom: '22px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <h4 style={{ fontSize: '12px', fontWeight: 700, color: 'var(--colors-ink)', textTransform: 'uppercase', fontFamily: 'var(--font-heading)' }}>
            📐 Interactive Floor-by-Floor Map View
          </h4>
        </div>

        {/* Floor Level Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
          <button
            onClick={() => setSelectedFloorLevel('Ground')}
            className={selectedFloorLevel === 'Ground' ? 'ollama-btn-primary' : 'ollama-btn-secondary'}
            style={{ height: '32px', borderRadius: '9999px', fontSize: '12px', padding: '0 14px' }}
          >
            Ground Floor (G)
          </button>
          <button
            onClick={() => setSelectedFloorLevel('1st')}
            className={selectedFloorLevel === '1st' ? 'ollama-btn-primary' : 'ollama-btn-secondary'}
            style={{ height: '32px', borderRadius: '9999px', fontSize: '12px', padding: '0 14px' }}
          >
            1st Floor (1F)
          </button>
          {(building.floors || 2) > 2 && (
            <button
              onClick={() => setSelectedFloorLevel('2nd')}
              className={selectedFloorLevel === '2nd' ? 'ollama-btn-primary' : 'ollama-btn-secondary'}
              style={{ height: '32px', borderRadius: '9999px', fontSize: '12px', padding: '0 14px' }}
            >
              2nd Floor (2F)
            </button>
          )}
        </div>

        {/* Indoor Rooms on Active Floor */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {selectedFloorLevel === 'Ground' && (
            <>
              <div style={{ background: 'var(--colors-surface-soft)', border: '1px solid var(--colors-hairline)', padding: '10px 14px', borderRadius: '10px', fontSize: '12px', color: 'var(--colors-ink)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span><strong>G-01:</strong> Reception & Visitor Registration</span>
                <span style={{ fontSize: '10px', color: '#10B981', fontWeight: 600 }}>Ramp Access</span>
              </div>
              <div style={{ background: 'var(--colors-surface-soft)', border: '1px solid var(--colors-hairline)', padding: '10px 14px', borderRadius: '10px', fontSize: '12px', color: 'var(--colors-ink)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span><strong>G-04:</strong> Dean & Administrative Office</span>
                <span style={{ fontSize: '10px', color: '#10B981', fontWeight: 600 }}>Elevator Near</span>
              </div>
            </>
          )}

          {selectedFloorLevel === '1st' && (
            <>
              <div style={{ background: 'var(--colors-surface-soft)', border: '1px solid var(--colors-hairline)', padding: '10px 14px', borderRadius: '10px', fontSize: '12px', color: 'var(--colors-ink)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span><strong>101:</strong> AI & Neural Networks Research Lab</span>
                <span style={{ fontSize: '10px', color: '#00F0FF', fontWeight: 600 }}>AC Lab</span>
              </div>
              <div style={{ background: 'var(--colors-surface-soft)', border: '1px solid var(--colors-hairline)', padding: '10px 14px', borderRadius: '10px', fontSize: '12px', color: 'var(--colors-ink)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span><strong>105:</strong> HOD Computer Science Chamber</span>
                <span style={{ fontSize: '10px', color: '#F59E0B', fontWeight: 600 }}>Office Hours</span>
              </div>
            </>
          )}

          {selectedFloorLevel === '2nd' && (
            <>
              <div style={{ background: 'var(--colors-surface-soft)', border: '1px solid var(--colors-hairline)', padding: '10px 14px', borderRadius: '10px', fontSize: '12px', color: 'var(--colors-ink)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span><strong>202:</strong> High-Performance Computing Cluster</span>
                <span style={{ fontSize: '10px', color: '#00F0FF', fontWeight: 600 }}>GPU Server Room</span>
              </div>
              <div style={{ background: 'var(--colors-surface-soft)', border: '1px solid var(--colors-hairline)', padding: '10px 14px', borderRadius: '10px', fontSize: '12px', color: 'var(--colors-ink)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span><strong>208:</strong> CSJMU Seminar & Keynote Hall B</span>
                <span style={{ fontSize: '10px', color: '#10B981', fontWeight: 600 }}>120 Seats</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Navigation Action Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {onOpen3DView && (
          <button
            onClick={() => onOpen3DView(building)}
            className="ollama-btn-secondary"
            style={{
              width: '100%',
              height: '42px',
              borderRadius: '9999px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
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
          onClick={() => {
            if (onNavigateToBuilding) onNavigateToBuilding(building);
            onClose();
          }}
          className="ollama-btn-primary"
          style={{
            width: '100%',
            height: '42px',
            borderRadius: '9999px',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <Navigation size={16} /> Show Shortest Path to {building.name}
        </button>

        {onOpenSBMIndoor && (
          <button
            onClick={() => {
              onOpenSBMIndoor();
              onClose();
            }}
            className="ollama-btn-secondary"
            style={{
              width: '100%',
              height: '38px',
              borderRadius: '9999px',
              fontSize: '12px',
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            🏢 Open SBM Rooms, Watercoolers & Corridors
          </button>
        )}

        {onEditCoordinates && (
          <button
            onClick={() => onEditCoordinates(building)}
            className="ollama-btn-secondary"
            style={{
              width: '100%',
              height: '38px',
              borderRadius: '9999px',
              fontSize: '12px',
              fontWeight: 500,
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
            height: '38px',
            borderRadius: '9999px',
            background: 'var(--colors-surface-soft)',
            border: '1px solid #EF4444',
            color: '#EF4444',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
          }}
        >
          <Trash2 size={15} /> Remove Pin from Map
        </button>
      </div>
    </div>
  );
}

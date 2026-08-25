import React, { useState } from 'react';
import { 
  Building2, X, Navigation, Layers
} from 'lucide-react';

export default function BuildingDetailDrawer({
  building,
  onClose,
  onNavigateToBuilding,
  onOpen3DView,
  onOpenStreetView
}) {
  const [selectedFloorLevel, setSelectedFloorLevel] = useState('Ground');

  if (!building) return null;

  const totalFloors = parseInt(building.floors) || 2;

  return (
    <div className="animate-slide-up" style={{
      position: 'absolute',
      top: '20px',
      right: '20px',
      width: '360px',
      maxHeight: 'calc(100% - 40px)',
      overflowY: 'auto',
      zIndex: 700,
      borderRadius: '16px',
      border: '1px solid var(--colors-hairline-strong)',
      boxShadow: '0 12px 36px rgba(0,0,0,0.25)',
      background: 'var(--colors-surface-card)',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    }}>
      {/* 1. Destination Name Header (No Latitudes, No Codes) */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid var(--colors-hairline)',
        paddingBottom: '14px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'var(--colors-primary)',
            color: 'var(--colors-on-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Building2 size={20} />
          </div>
          <div style={{ minWidth: 0 }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: 700,
              color: 'var(--colors-ink)',
              fontFamily: 'var(--font-heading)',
              margin: 0,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {building.name}
            </h3>
            <span style={{ fontSize: '11px', color: 'var(--colors-body)', fontWeight: 500 }}>
              {building.category || 'Campus Facility'}
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          title="Close"
          style={{
            width: '30px',
            height: '30px',
            minWidth: '30px',
            minHeight: '30px',
            borderRadius: '50%',
            background: 'var(--colors-surface-soft)',
            color: 'var(--colors-ink)',
            border: '1px solid var(--colors-hairline)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontWeight: 700,
            fontSize: '14px',
            marginLeft: '8px'
          }}
        >
          ✕
        </button>
      </div>

      {/* 2. Interactive Floor-by-Floor Map View */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <h4 style={{
            fontSize: '12px',
            fontWeight: 700,
            color: 'var(--colors-ink)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            fontFamily: 'var(--font-heading)',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <Layers size={14} color="var(--colors-primary)" /> Floor-by-Floor Map View
          </h4>
        </div>

        {/* Floor Level Tabs */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
          <button
            type="button"
            onClick={() => setSelectedFloorLevel('Ground')}
            className={selectedFloorLevel === 'Ground' ? 'ollama-btn-primary' : 'ollama-btn-secondary'}
            style={{
              height: '32px',
              borderRadius: '9999px',
              fontSize: '12px',
              fontWeight: 600,
              padding: '0 14px',
              flex: 1
            }}
          >
            Ground (G)
          </button>
          <button
            type="button"
            onClick={() => setSelectedFloorLevel('1st')}
            className={selectedFloorLevel === '1st' ? 'ollama-btn-primary' : 'ollama-btn-secondary'}
            style={{
              height: '32px',
              borderRadius: '9999px',
              fontSize: '12px',
              fontWeight: 600,
              padding: '0 14px',
              flex: 1
            }}
          >
            1st Floor (1F)
          </button>
          {totalFloors > 2 && (
            <button
              type="button"
              onClick={() => setSelectedFloorLevel('2nd')}
              className={selectedFloorLevel === '2nd' ? 'ollama-btn-primary' : 'ollama-btn-secondary'}
              style={{
                height: '32px',
                borderRadius: '9999px',
                fontSize: '12px',
                fontWeight: 600,
                padding: '0 14px',
                flex: 1
              }}
            >
              2nd Floor (2F)
            </button>
          )}
        </div>

        {/* Floor Rooms / Areas Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {selectedFloorLevel === 'Ground' && (
            <>
              <div style={{
                background: 'var(--colors-surface-soft)',
                border: '1px solid var(--colors-hairline)',
                padding: '10px 14px',
                borderRadius: '10px',
                fontSize: '12px',
                color: 'var(--colors-ink)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span><strong>G-01:</strong> Reception & Visitor Registration</span>
                <span style={{ fontSize: '10px', color: '#10B981', fontWeight: 700 }}>Entry</span>
              </div>
              <div style={{
                background: 'var(--colors-surface-soft)',
                border: '1px solid var(--colors-hairline)',
                padding: '10px 14px',
                borderRadius: '10px',
                fontSize: '12px',
                color: 'var(--colors-ink)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span><strong>G-04:</strong> Dean & Administrative Office</span>
                <span style={{ fontSize: '10px', color: '#10B981', fontWeight: 700 }}>Active</span>
              </div>
            </>
          )}

          {selectedFloorLevel === '1st' && (
            <>
              <div style={{
                background: 'var(--colors-surface-soft)',
                border: '1px solid var(--colors-hairline)',
                padding: '10px 14px',
                borderRadius: '10px',
                fontSize: '12px',
                color: 'var(--colors-ink)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span><strong>101:</strong> AI & Machine Learning Research Lab</span>
                <span style={{ fontSize: '10px', color: '#0284C7', fontWeight: 700 }}>1st Floor</span>
              </div>
              <div style={{
                background: 'var(--colors-surface-soft)',
                border: '1px solid var(--colors-hairline)',
                padding: '10px 14px',
                borderRadius: '10px',
                fontSize: '12px',
                color: 'var(--colors-ink)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span><strong>105:</strong> Faculty & HOD Department Chamber</span>
                <span style={{ fontSize: '10px', color: '#0284C7', fontWeight: 700 }}>Faculty</span>
              </div>
            </>
          )}

          {selectedFloorLevel === '2nd' && (
            <>
              <div style={{
                background: 'var(--colors-surface-soft)',
                border: '1px solid var(--colors-hairline)',
                padding: '10px 14px',
                borderRadius: '10px',
                fontSize: '12px',
                color: 'var(--colors-ink)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span><strong>202:</strong> High Performance Computing Cluster</span>
                <span style={{ fontSize: '10px', color: '#8B5CF6', fontWeight: 700 }}>GPU Server</span>
              </div>
              <div style={{
                background: 'var(--colors-surface-soft)',
                border: '1px solid var(--colors-hairline)',
                padding: '10px 14px',
                borderRadius: '10px',
                fontSize: '12px',
                color: 'var(--colors-ink)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span><strong>208:</strong> Seminar & Keynote Presentation Hall</span>
                <span style={{ fontSize: '10px', color: '#8B5CF6', fontWeight: 700 }}>Keynote</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Action Button: Show Path */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
        {onNavigateToBuilding && (
          <button
            type="button"
            onClick={() => {
              onNavigateToBuilding(building);
              onClose();
            }}
            className="ollama-btn-primary"
            style={{
              width: '100%',
              height: '40px',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <Navigation size={15} /> Show Path to {building.name}
          </button>
        )}
      </div>
    </div>
  );
}

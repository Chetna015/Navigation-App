import React from 'react';
import { Building2, X, ChevronRight } from 'lucide-react';

export default function IndoorBuildingSelectorModal({
  isOpen,
  onClose,
  onSelectBuilding
}) {
  if (!isOpen) return null;

  // The buildings offering detailed digital twins/indoor blueprints
  const indoorBuildings = [
    {
      id: 'sbm',
      name: 'School of Business Management (SBM)',
      code: 'BLD-SBM',
      description: '3 Floors • Classrooms, GPU Labs, Watercoolers Network & Hallways',
      floorsCount: 3,
      roomsCount: 7,
      watercoolersCount: 3
    },
    {
      id: 'auditorium',
      name: 'CSJM Auditorium',
      code: 'BLD-AUD',
      description: '2 Floors • Plenary Hall, VIP Seating, Exhibition Spaces & Corridors',
      floorsCount: 2,
      roomsCount: 4,
      watercoolersCount: 2
    }
  ];

  return (
    <div className="mobile-map-search-overlay" onClick={onClose}>
      <div 
        className="mobile-map-search-sheet animate-slide-up" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxHeight: '80vh' }}
      >
        <div className="search-sheet-handle" />

        {/* Header */}
        <div className="search-sheet-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFF'
            }}>
              <Building2 size={16} />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', margin: 0, fontWeight: 700 }}>Indoor Digital Twins</h3>
              <p style={{ fontSize: '11px', color: 'var(--colors-body)', margin: 0 }}>
                Select a building to view interactive indoor floor plan blueprint SVGs
              </p>
            </div>
          </div>

          <button 
            type="button"
            className="search-sheet-close"
            onClick={onClose}
            title="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* Buildings List in Single Column */}
        <div className="search-sheet-results" style={{ padding: '16px 4px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {indoorBuildings.map(bld => (
              <div 
                key={bld.id} 
                className="search-sheet-item"
                onClick={() => {
                  onSelectBuilding(bld.id);
                  onClose();
                }}
                style={{
                  cursor: 'pointer',
                  padding: '16px',
                  background: 'var(--colors-surface-soft)',
                  border: '1px solid var(--colors-hairline-strong)',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'transform 0.15s ease, background-color 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '12px',
                    background: 'var(--colors-surface-dark)',
                    color: '#FFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Building2 size={20} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--colors-ink)' }}>
                      {bld.name}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--colors-body)', marginTop: '2px' }}>
                      {bld.description}
                    </div>
                    
                    {/* Stats Pill Badges */}
                    <div style={{ display: 'flex', gap: '6px', marginTop: '6px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '9px', fontWeight: 700, background: 'rgba(59, 130, 246, 0.1)', color: '#2563EB', padding: '2px 6px', borderRadius: '4px' }}>
                        🏢 {bld.floorsCount} Floors
                      </span>
                      <span style={{ fontSize: '9px', fontWeight: 700, background: 'rgba(16, 185, 129, 0.1)', color: '#059669', padding: '2px 6px', borderRadius: '4px' }}>
                        🏫 {bld.roomsCount} Rooms
                      </span>
                      <span style={{ fontSize: '9px', fontWeight: 700, background: 'rgba(245, 158, 11, 0.1)', color: '#D97706', padding: '2px 6px', borderRadius: '4px' }}>
                        🚰 {bld.watercoolersCount} Dispensers
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ color: 'var(--colors-mute)', display: 'flex', alignItems: 'center' }}>
                  <ChevronRight size={18} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

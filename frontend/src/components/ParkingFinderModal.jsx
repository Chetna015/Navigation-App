import React from 'react';
import { SquareParking, MapPin, Navigation, ArrowRight, ShieldCheck } from 'lucide-react';

const PARKING_LOTS = [
  {
    id: 'park_1',
    name: 'CSJMU Main Gate 1 Visitor Parking',
    location: 'Near GT Road Entry Gate',
    freeSpots: 42,
    totalSpots: 60,
    vehicleType: 'Car & 2-Wheeler',
    status: 'Plenty Spots Free',
    statusColor: '#10B981'
  },
  {
    id: 'park_2',
    name: 'UIET Engineering Academic Bay',
    location: 'Adjacent to UIET Block 1',
    freeSpots: 18,
    totalSpots: 50,
    vehicleType: '2-Wheeler Priority',
    status: 'Filling Fast',
    statusColor: '#F59E0B'
  },
  {
    id: 'park_3',
    name: 'Auditorium & SAC Multipurpose Ground',
    location: 'Auditorium Quadrangle',
    freeSpots: 85,
    totalSpots: 150,
    vehicleType: 'Heavy Event Parking',
    status: 'Plenty Spots Free',
    statusColor: '#10B981'
  },
  {
    id: 'park_4',
    name: 'Administration Building VIP Bay',
    location: 'Senate Hall Complex',
    freeSpots: 5,
    totalSpots: 25,
    vehicleType: 'Official Vehicles',
    status: 'Almost Full',
    statusColor: '#EF4444'
  }
];

export default function ParkingFinderModal({
  isOpen,
  onClose,
  onNavigateToParking
}) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 1000,
      background: 'rgba(0, 0, 0, 0.6)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="animate-scale-up" style={{
        width: '100%',
        maxWidth: '640px',
        maxHeight: '90vh',
        borderRadius: '16px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        border: '1px solid var(--colors-hairline-strong)',
        boxShadow: 'var(--shadow-md)',
        background: 'var(--colors-surface-card)'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          background: 'var(--colors-surface-soft)',
          borderBottom: '1px solid var(--colors-hairline)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'var(--colors-surface-dark)',
              color: 'var(--colors-on-dark)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <SquareParking size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--colors-ink)', fontFamily: 'var(--font-heading)' }}>
                🅿️ Smart Campus Parking Availability
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--colors-body)', fontFamily: 'var(--font-main)' }}>
                Live vacant spots meter across CSJMU campus parking lots
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            title="Close Modal"
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

        {/* Modal Body */}
        <div style={{ padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {PARKING_LOTS.map(lot => (
            <div key={lot.id} style={{
              background: 'var(--colors-surface-soft)',
              border: '1px solid var(--colors-hairline)',
              borderRadius: '12px',
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--colors-ink)', fontFamily: 'var(--font-heading)' }}>
                    {lot.name}
                  </h4>
                  <span style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    color: lot.statusColor,
                    background: 'rgba(16, 185, 129, 0.1)',
                    padding: '2px 8px',
                    borderRadius: '9999px'
                  }}>
                    {lot.status}
                  </span>
                </div>

                <div style={{ fontSize: '12px', color: 'var(--colors-body)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={12} /> {lot.location} • <span style={{ color: 'var(--colors-ink)', fontWeight: 600 }}>{lot.vehicleType}</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--colors-ink)', fontFamily: 'var(--font-code)' }}>
                    {lot.freeSpots} <span style={{ fontSize: '11px', color: 'var(--colors-body)' }}>/ {lot.totalSpots}</span>
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--colors-body)', fontWeight: 600 }}>
                    Vacant Spots
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (onNavigateToParking) onNavigateToParking(lot.name);
                    onClose();
                  }}
                  className="ollama-btn-primary"
                  style={{ height: '34px', padding: '0 12px', fontSize: '12px', borderRadius: '9999px' }}
                >
                  Navigate <ArrowRight size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

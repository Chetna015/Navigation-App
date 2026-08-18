import React, { useState, useEffect } from 'react';
import { Bus, MapPin, Clock, RefreshCw, X, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

const SHUTTLE_STOPS = [
  { id: 'stop_1', name: 'CSJMU Main Gate 1 Stand', location: 'GT Road Gate', etaMins: 2, status: 'Arriving Soon' },
  { id: 'stop_2', name: 'UIET Engineering Stand', location: 'Near UIET Block 1', etaMins: 4, status: 'On Route' },
  { id: 'stop_3', name: 'Central Library Stand', location: 'Library Entrance', etaMins: 6, status: 'On Route' },
  { id: 'stop_4', name: 'Girls & Boys Hostel Ring', location: 'Hostel Sector', etaMins: 9, status: 'Scheduled' },
  { id: 'stop_5', name: 'CSJMU Auditorium Stand', location: 'Near Main Auditorium', etaMins: 11, status: 'Scheduled' }
];

const SHUTTLES = [
  { id: 'EV-01', driver: 'Ramesh Kumar', vehicle: 'Eco Rickshaw 1', capacity: '4 / 6 Seats', speed: '18 km/h', nextStop: 'UIET Engineering Stand' },
  { id: 'EV-02', driver: 'Sanjay Singh', vehicle: 'Eco Rickshaw 2', capacity: '2 / 6 Seats', speed: '15 km/h', nextStop: 'CSJMU Main Gate 1 Stand' },
  { id: 'EV-03', driver: 'Vikas Sharma', vehicle: 'Campus Bus 1', capacity: '12 / 24 Seats', speed: '22 km/h', nextStop: 'Central Library Stand' }
];

export default function CampusShuttleModal({
  isOpen,
  onClose,
  onSelectShuttleStop
}) {
  const [stops, setStops] = useState(SHUTTLE_STOPS);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      setStops(prev => prev.map(stop => ({
        ...stop,
        etaMins: stop.etaMins <= 1 ? 12 : stop.etaMins - 1
      })));
    }, 4000);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

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
        maxWidth: '680px',
        maxHeight: '90vh',
        borderRadius: '16px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        border: '1px solid var(--colors-hairline-strong)',
        boxShadow: 'var(--shadow-md)',
        background: 'var(--colors-surface-card)'
      }}>
        {/* Modal Header */}
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
              <Bus size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--colors-ink)', fontFamily: 'var(--font-heading)' }}>
                🚌 Campus E-Rickshaw & Shuttle Live Tracker
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--colors-body)', fontFamily: 'var(--font-main)' }}>
                Real-time transit locations & stop ETAs across CSJMU campus
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={handleRefresh}
              className="ollama-btn-secondary"
              style={{ width: '32px', height: '32px', borderRadius: '50%', padding: 0 }}
              title="Refresh ETAs"
            >
              <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
            </button>
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
        </div>

        {/* Content Body */}
        <div style={{ padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Active Shuttles Fleet */}
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--colors-ink)', fontFamily: 'var(--font-heading)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              ⚡ Active Campus Vehicles (3 Operating)
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '10px' }}>
              {SHUTTLES.map(shuttle => (
                <div key={shuttle.id} style={{
                  background: 'var(--colors-surface-soft)',
                  border: '1px solid var(--colors-hairline)',
                  borderRadius: '12px',
                  padding: '12px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--colors-ink)', fontFamily: 'var(--font-code)' }}>
                      {shuttle.id}
                    </span>
                    <span style={{ fontSize: '10px', fontWeight: 600, color: '#10B981', background: 'rgba(16, 185, 129, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>
                      {shuttle.capacity}
                    </span>
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--colors-ink)', fontFamily: 'var(--font-heading)' }}>
                    {shuttle.vehicle}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--colors-body)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={11} /> {shuttle.nextStop}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shuttle Stops List */}
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--colors-ink)', fontFamily: 'var(--font-heading)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              📍 Campus Pickup Stands & ETAs
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {stops.map(stop => (
                <div key={stop.id} style={{
                  background: 'var(--colors-surface-soft)',
                  border: '1px solid var(--colors-hairline)',
                  borderRadius: '12px',
                  padding: '14px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: 'var(--colors-surface-dark)',
                      color: 'var(--colors-on-dark)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Clock size={16} />
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--colors-ink)', fontFamily: 'var(--font-heading)' }}>
                        {stop.name}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--colors-body)', fontFamily: 'var(--font-main)' }}>
                        {stop.location}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--colors-ink)', fontFamily: 'var(--font-code)' }}>
                        {stop.etaMins} min
                      </div>
                      <div style={{ fontSize: '10px', color: '#10B981', fontWeight: 600 }}>
                        {stop.status}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        if (onSelectShuttleStop) onSelectShuttleStop(stop);
                        onClose();
                      }}
                      className="ollama-btn-primary"
                      style={{ height: '32px', padding: '0 12px', fontSize: '12px', borderRadius: '9999px' }}
                    >
                      Route Here <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

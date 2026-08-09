import React, { useState } from 'react';
import { X, Search, Landmark, Sparkles, MapPin, Clock, ArrowRight, Layers } from 'lucide-react';
import { STARTUP_STALLS } from '../data/auditoriumData';

export default function SenateHallVerticalPanel({
  isOpen,
  onClose,
  onSelectStall
}) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState('all');
  const [filterQuery, setFilterQuery] = useState('');

  // Filter items
  const filteredStalls = STARTUP_STALLS.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
                          s.domain.toLowerCase().includes(filterQuery.toLowerCase()) ||
                          s.id.toLowerCase().includes(filterQuery.toLowerCase());
    if (activeTab === 'all') return matchesSearch;
    return matchesSearch && s.domain.toLowerCase().includes(activeTab.toLowerCase());
  });

  return (
    <div
      className="animate-fade-in"
      style={{
        position: 'fixed',
        top: '84px',
        right: '20px',
        width: '390px',
        maxHeight: 'calc(100vh - 105px)',
        zIndex: 990,
        background: 'rgba(10, 20, 38, 0.94)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1.5px solid rgba(0, 240, 255, 0.4)',
        borderRadius: '24px',
        boxShadow: '0 0 40px rgba(0, 240, 255, 0.25), 0 20px 50px rgba(0, 0, 0, 0.8)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      {/* Header */}
      <div style={{
        padding: '18px 20px 14px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        background: 'linear-gradient(180deg, rgba(0, 240, 255, 0.1) 0%, rgba(0, 0, 0, 0) 100%)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #0066FF 0%, #00F0FF 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(0, 240, 255, 0.5)'
            }}>
              <Landmark size={20} color="#FFF" />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#FFF', margin: 0, letterSpacing: '-0.3px' }}>
                Senate Hall Indoor Arena
              </h3>
              <div style={{ fontSize: '11px', color: '#00F0FF', fontWeight: 700, fontFamily: 'monospace', marginTop: '1px' }}>
                📍 Lat: 26.50150° N | Lng: 80.26880° E
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="btn-glass"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
            title="Close Senate Hall View"
          >
            <X size={16} color="var(--text-muted)" />
          </button>
        </div>

        {/* Quick Search */}
        <div style={{
          position: 'relative',
          marginTop: '12px'
        }}>
          <Search size={14} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search stalls inside Senate Hall..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            style={{
              width: '100%',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '14px',
              padding: '8px 12px 8px 34px',
              color: '#FFF',
              fontSize: '12px',
              outline: 'none'
            }}
          />
        </div>

        {/* Category Tabs */}
        <div style={{
          display: 'flex',
          gap: '6px',
          overflowX: 'auto',
          marginTop: '10px',
          paddingBottom: '4px'
        }}>
          {[
            { id: 'all', label: `All Stalls (${STARTUP_STALLS.length})` },
            { id: 'healthcare', label: 'Healthcare' },
            { id: 'robotics', label: 'Robotics' },
            { id: 'cyber', label: 'Cyber Tech' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: activeTab === tab.id ? 'linear-gradient(135deg, #0066FF 0%, #00F0FF 100%)' : 'rgba(255, 255, 255, 0.06)',
                border: activeTab === tab.id ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
                color: activeTab === tab.id ? '#FFF' : 'var(--text-muted)',
                padding: '4px 10px',
                borderRadius: '12px',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Vertical Scrollable List of Senate Hall Stalls */}
      <div style={{
        padding: '14px 18px',
        overflowY: 'auto',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>
        {filteredStalls.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)', fontSize: '13px' }}>
            No stalls found inside Senate Hall matching "{filterQuery}".
          </div>
        ) : (
          filteredStalls.map(stall => (
            <div
              key={stall.id}
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                padding: '12px 14px',
                transition: 'all 0.2s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = '#00F0FF'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)'}
              onClick={() => {
                if (onSelectStall) onSelectStall(stall);
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    background: 'linear-gradient(135deg, #0066FF 0%, #00F0FF 100%)',
                    color: '#FFF',
                    fontSize: '10px',
                    fontWeight: 900,
                    padding: '2px 7px',
                    borderRadius: '8px'
                  }}>
                    {stall.id}
                  </span>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: '#FFF' }}>
                    {stall.name}
                  </span>
                </div>

                <span style={{
                  background: 'rgba(0, 240, 255, 0.12)',
                  color: '#00F0FF',
                  fontSize: '10px',
                  fontWeight: 700,
                  padding: '2px 6px',
                  borderRadius: '6px'
                }}>
                  {stall.domain}
                </span>
              </div>

              <p style={{
                fontSize: '11px',
                color: 'var(--text-muted)',
                margin: '0 0 8px',
                lineHeight: '1.4',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}>
                {stall.description}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '10px', color: 'rgba(255, 255, 255, 0.6)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={11} color="#00F0FF" /> Demo: {stall.demoTiming}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#00F0FF', fontWeight: 700 }}>
                  View <ArrowRight size={11} />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer Banner */}
      <div style={{
        padding: '12px 18px',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        background: 'rgba(0, 102, 255, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justify: 'space-between',
        fontSize: '11px',
        color: '#00F0FF',
        fontWeight: 700
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Sparkles size={14} color="#00F0FF" />
          <span>Senate Hall Indoor Exhibition Mode</span>
        </div>
        <span>20 Stalls Housed</span>
      </div>
    </div>
  );
}

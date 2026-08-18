import React, { useState } from 'react';
import { Utensils, BookOpen, Coffee, Clock, Users, ArrowRight, ShieldCheck, Flame } from 'lucide-react';

const CANTEEN_DATA = [
  {
    id: 'cant_1',
    name: 'CSJMU Central Cafeteria',
    category: 'Dining & Snacks',
    rushLevel: 'Low Rush',
    waitMins: '3-5 mins',
    desksAvailable: '45 / 80 Tables Free',
    specialToday: 'Chole Bhature & Cold Coffee',
    statusColor: '#10B981'
  },
  {
    id: 'cant_2',
    name: 'Nescafe Coffee Booth (Auditorium Lawn)',
    category: 'Coffee & Express',
    rushLevel: 'Moderate Rush',
    waitMins: '8-10 mins',
    desksAvailable: '12 / 30 Seating Free',
    specialToday: 'Hazelnut Iced Latte & Grilled Sandwich',
    statusColor: '#F59E0B'
  },
  {
    id: 'cant_3',
    name: 'UIET Canteen & Food Court',
    category: 'Student Hub',
    rushLevel: 'Low Rush',
    waitMins: '4 mins',
    desksAvailable: '28 / 50 Tables Free',
    specialToday: 'Paneer Patties & Masala Chai',
    statusColor: '#10B981'
  }
];

const LIBRARY_DATA = [
  {
    id: 'lib_1',
    name: 'CSJMU Central Library (Reading Hall 1)',
    category: 'Quiet Study Zone',
    noiseLevel: 'Silence Required (32 dB)',
    desksAvailable: '38 / 120 Desks Free',
    airConditioned: 'Yes',
    statusColor: '#10B981'
  },
  {
    id: 'lib_2',
    name: 'Computer & Research E-Library',
    category: 'Digital Lab',
    noiseLevel: 'Low Discussion (45 dB)',
    desksAvailable: '14 / 60 Terminals Free',
    airConditioned: 'Yes',
    statusColor: '#F59E0B'
  }
];

export default function CampusLifeStatusModal({
  isOpen,
  onClose,
  onNavigateToFacility
}) {
  const [activeTab, setActiveTab] = useState('canteen');

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
              <Utensils size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--colors-ink)', fontFamily: 'var(--font-heading)' }}>
                🍔 Canteen Wait Times & Library Quiet Zone Meter
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--colors-body)', fontFamily: 'var(--font-main)' }}>
                Real-time rush status, available desks, and daily specials
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

        {/* Tab Selection */}
        <div style={{
          padding: '12px 24px',
          borderBottom: '1px solid var(--colors-hairline)',
          display: 'flex',
          gap: '10px'
        }}>
          <button
            onClick={() => setActiveTab('canteen')}
            className={activeTab === 'canteen' ? 'ollama-btn-primary' : 'ollama-btn-secondary'}
            style={{ height: '36px', borderRadius: '9999px', fontSize: '13px' }}
          >
            <Coffee size={15} /> Canteens & Food Courts
          </button>
          <button
            onClick={() => setActiveTab('library')}
            className={activeTab === 'library' ? 'ollama-btn-primary' : 'ollama-btn-secondary'}
            style={{ height: '36px', borderRadius: '9999px', fontSize: '13px' }}
          >
            <BookOpen size={15} /> Library Quiet Zones
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {activeTab === 'canteen' ? (
            CANTEEN_DATA.map(item => (
              <div key={item.id} style={{
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
                      {item.name}
                    </h4>
                    <span style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      color: item.statusColor,
                      background: 'rgba(16, 185, 129, 0.1)',
                      padding: '2px 8px',
                      borderRadius: '9999px'
                    }}>
                      {item.rushLevel}
                    </span>
                  </div>

                  <div style={{ fontSize: '12px', color: 'var(--colors-body)', marginBottom: '8px' }}>
                    Wait: <strong style={{ color: 'var(--colors-ink)' }}>{item.waitMins}</strong> • {item.desksAvailable}
                  </div>

                  <div style={{ fontSize: '12px', color: 'var(--colors-ink)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Flame size={13} color="#F59E0B" /> Today's Special: {item.specialToday}
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (onNavigateToFacility) onNavigateToFacility(item.name);
                    onClose();
                  }}
                  className="ollama-btn-secondary"
                  style={{ height: '36px', borderRadius: '9999px', fontSize: '12px', padding: '0 14px' }}
                >
                  Navigate <ArrowRight size={12} />
                </button>
              </div>
            ))
          ) : (
            LIBRARY_DATA.map(item => (
              <div key={item.id} style={{
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
                      {item.name}
                    </h4>
                    <span style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      color: item.statusColor,
                      background: 'rgba(16, 185, 129, 0.1)',
                      padding: '2px 8px',
                      borderRadius: '9999px'
                    }}>
                      {item.desksAvailable}
                    </span>
                  </div>

                  <div style={{ fontSize: '12px', color: 'var(--colors-body)' }}>
                    Noise Level: <strong style={{ color: 'var(--colors-ink)' }}>{item.noiseLevel}</strong> • AC: {item.airConditioned}
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (onNavigateToFacility) onNavigateToFacility(item.name);
                    onClose();
                  }}
                  className="ollama-btn-secondary"
                  style={{ height: '36px', borderRadius: '9999px', fontSize: '12px', padding: '0 14px' }}
                >
                  Navigate <ArrowRight size={12} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

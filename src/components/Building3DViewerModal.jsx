import React, { useState, useEffect, useRef } from 'react';
import { 
  X, RotateCw, ZoomIn, ZoomOut, Sun, Moon, Layers, Building2, Navigation, Eye, CheckCircle2, Shield
} from 'lucide-react';

export default function Building3DViewerModal({
  isOpen,
  building,
  onClose,
  onNavigateToBuilding
}) {
  const [rotationY, setRotationY] = useState(25);
  const [rotationX, setRotationX] = useState(20);
  const [zoom, setZoom] = useState(1);
  const [isNightMode, setIsNightMode] = useState(true);
  const [selectedFloor, setSelectedFloor] = useState('all');
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  if (!isOpen || !building) return null;

  // Determine 3D Image asset based on building code / name
  const bldNameLower = (building.name || '').toLowerCase();
  let imageAsset = '/assets/buildings/auditorium.jpg';

  if (bldNameLower.includes('uiet') || bldNameLower.includes('engineering') || bldNameLower.includes('tech')) {
    imageAsset = '/assets/buildings/uiet.jpg';
  } else if (bldNameLower.includes('senate') || bldNameLower.includes('admin')) {
    imageAsset = '/assets/buildings/senate.jpg';
  }

  // Mouse Drag handlers for 3D rotation
  const handleMouseDown = (e) => {
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartRef.current.x;
    const deltaY = e.clientY - dragStartRef.current.y;

    setRotationY(prev => prev + deltaX * 0.5);
    setRotationX(prev => Math.max(-10, Math.min(60, prev - deltaY * 0.4)));

    dragStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div 
      className="animate-fade-in"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: 'rgba(5, 10, 20, 0.88)',
        backdropFilter: 'blur(20px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onMouseUp={handleMouseUp}
    >
      <div 
        className="glass-card animate-scale-up"
        style={{
          width: '920px',
          maxWidth: '95vw',
          height: '620px',
          maxHeight: '90vh',
          borderRadius: '28px',
          border: '1px solid var(--border-glass-light)',
          background: 'rgba(11, 20, 38, 0.96)',
          boxShadow: '0 0 50px rgba(0, 240, 255, 0.3)',
          display: 'grid',
          gridTemplateColumns: '1fr 340px',
          overflow: 'hidden'
        }}
      >
        {/* Left Column: Interactive 3D Canvas / Render Viewport */}
        <div 
          style={{
            position: 'relative',
            background: isNightMode 
              ? 'radial-gradient(circle at center, #0F203C 0%, #060C18 100%)' 
              : 'radial-gradient(circle at center, #1E293B 0%, #0F172A 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: isDragging ? 'grabbing' : 'grab',
            userSelect: 'none',
            overflow: 'hidden'
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
        >
          {/* Top Instructions Badge */}
          <div style={{
            position: 'absolute',
            top: '16px',
            left: '16px',
            zIndex: 10,
            background: 'rgba(0, 0, 0, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: '#00F0FF',
            padding: '6px 14px',
            borderRadius: '20px',
            fontSize: '11px',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <RotateCw size={13} className="animate-spin" style={{ animationDuration: '6s' }} />
            <span>3D INTERACTIVE VIEWPORT: Click & drag to rotate 3D mesh</span>
          </div>

          {/* 3D Render Image Container with 3D Perspective Transform */}
          <div style={{
            perspective: '1000px',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{
              transform: `scale(${zoom}) rotateX(${rotationX}deg) rotateY(${rotationY}deg)`,
              transition: isDragging ? 'none' : 'transform 0.1s ease-out',
              transformStyle: 'preserve-3d',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <img 
                src={imageAsset} 
                alt={`${building.name} 3D View`}
                style={{
                  maxWidth: '460px',
                  maxHeight: '380px',
                  objectFit: 'contain',
                  borderRadius: '20px',
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.9), 0 0 30px rgba(0, 240, 255, 0.3)',
                  border: '2px solid rgba(0, 240, 255, 0.4)'
                }}
              />

              {/* Holographic Base Grid Ring */}
              <div style={{
                position: 'absolute',
                bottom: '-20px',
                width: '110%',
                height: '40px',
                borderRadius: '50%',
                border: '2px dashed rgba(0, 240, 255, 0.6)',
                boxShadow: '0 0 20px rgba(0, 240, 255, 0.4)',
                transform: 'rotateX(75deg)'
              }} />
            </div>
          </div>

          {/* Floating Controls Bar (Bottom Left Viewport) */}
          <div style={{
            position: 'absolute',
            bottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(14, 23, 38, 0.85)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            padding: '6px 12px',
            borderRadius: '16px'
          }}>
            <button 
              onClick={() => setZoom(prev => Math.min(1.8, prev + 0.15))}
              className="btn-glass"
              style={{ padding: '6px', borderRadius: '8px' }}
              title="Zoom In 3D View"
            >
              <ZoomIn size={16} color="#FFF" />
            </button>
            <button 
              onClick={() => setZoom(prev => Math.max(0.6, prev - 0.15))}
              className="btn-glass"
              style={{ padding: '6px', borderRadius: '8px' }}
              title="Zoom Out 3D View"
            >
              <ZoomOut size={16} color="#FFF" />
            </button>
            <button 
              onClick={() => { setRotationX(20); setRotationY(25); setZoom(1); }}
              className="btn-glass"
              style={{ padding: '6px 10px', borderRadius: '8px', fontSize: '11px', color: '#00F0FF', fontWeight: 800 }}
              title="Reset 3D Camera"
            >
              Reset View
            </button>
            <div style={{ width: '1px', height: '18px', background: 'rgba(255,255,255,0.2)', margin: '0 4px' }} />
            <button 
              onClick={() => setIsNightMode(!isNightMode)}
              className="btn-glass"
              style={{ padding: '6px', borderRadius: '8px' }}
              title="Toggle Day/Night 3D Lighting"
            >
              {isNightMode ? <Sun size={16} color="#F59E0B" /> : <Moon size={16} color="#00F0FF" />}
            </button>
          </div>
        </div>

        {/* Right Column: Building 3D Details & Directory */}
        <div style={{
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          borderLeft: '1px solid var(--border-glass)',
          overflowY: 'auto'
        }}>
          <div>
            {/* Header Close */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #0066FF 0%, #00F0FF 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Building2 size={18} color="#FFF" />
                </div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#00F0FF', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  3D Digital Twin Model
                </span>
              </div>

              <button
                onClick={onClose}
                className="btn-glass"
                style={{ width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <X size={16} color="var(--text-muted)" />
              </button>
            </div>

            {/* Title */}
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#FFF', marginBottom: '6px' }}>
              {building.name}
            </h3>

            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: '1.4' }}>
              {building.description || 'Verified CSJMU Infrastructure Building'}
            </p>

            {/* 3D Technical Metrics */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '8px',
              marginBottom: '16px'
            }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)', padding: '10px', borderRadius: '12px' }}>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Storey Height</div>
                <div style={{ fontSize: '15px', fontWeight: 800, color: '#FFF', marginTop: '2px' }}>
                  {building.floors || 3} Floors (18.5m)
                </div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)', padding: '10px', borderRadius: '12px' }}>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>HVAC & Solar</div>
                <div style={{ fontSize: '15px', fontWeight: 800, color: '#10B981', marginTop: '2px' }}>
                  A+ Green Rated
                </div>
              </div>
            </div>

            {/* Floor Selector & Directory */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#00F0FF', textTransform: 'uppercase', marginBottom: '8px' }}>
                🏢 Select Floor 3D Slice
              </div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {['all', 'Ground', 'Floor 1', 'Floor 2'].map(f => (
                  <button
                    key={f}
                    onClick={() => setSelectedFloor(f)}
                    style={{
                      background: selectedFloor === f ? 'linear-gradient(135deg, #0066FF, #00F0FF)' : 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      color: '#FFF',
                      padding: '6px 10px',
                      borderRadius: '8px',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {f === 'all' ? 'All Floors' : f}
                  </button>
                ))}
              </div>
            </div>

            {/* Housed Wings & Labs */}
            <div>
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#00F0FF', textTransform: 'uppercase', marginBottom: '8px' }}>
                🔬 Departments & Facilities
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {(building.departments || ['Main Auditorium Hall', 'VIP Green Room', 'Control Suite']).map((dept, idx) => (
                  <div key={idx} style={{
                    background: 'rgba(0, 102, 255, 0.08)',
                    border: '1px solid rgba(0, 102, 255, 0.25)',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#FFF',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <CheckCircle2 size={13} color="#00F0FF" />
                    <span>{dept}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div style={{ marginTop: '16px' }}>
            <button
              onClick={() => {
                if (onNavigateToBuilding) onNavigateToBuilding(building);
                onClose();
              }}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #0066FF 0%, #00F0FF 100%)',
                color: '#FFF',
                border: 'none',
                fontSize: '13px',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 0 20px rgba(0, 240, 255, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <Navigation size={16} /> Route & Navigate to Building
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

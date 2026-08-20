import React, { useState, useEffect } from 'react';
import { 
  X, Search, Building2, Droplets, MapPin, Navigation, Sparkles, Clock, CheckCircle2, 
  Layers, ChevronRight, Shield, Zap, ArrowRight, Compass, Info, Cpu, Award
} from 'lucide-react';
import { SBM_INDOOR_DATA } from '../data/auditoriumData';
import { apiService } from '../services/api';

export default function SBMBuildingIndoorModal({
  isOpen,
  onClose,
  onNavigateToBuilding
}) {
  const [activeFloorId, setActiveFloorId] = useState('ground');
  const [activeTab, setActiveTab] = useState('map'); // 'map' | 'watercoolers' | 'rooms' | 'pathfinder'
  const [selectedItem, setSelectedItem] = useState(null); // room or watercooler
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');

  // Indoor Pathfinder State
  const [pathStartId, setPathStartId] = useState('ENTRANCE_WEST');
  const [pathEndId, setPathEndId] = useState('SBM-WC-01');
  const [activePath, setActivePath] = useState(null);

  const [dbRooms, setDbRooms] = useState([]);
  const [dbWcs, setDbWcs] = useState([]);

  useEffect(() => {
    if (isOpen) {
      // Fetch rooms from SQLite
      apiService.getRooms()
        .then(data => {
          if (data.success && data.rooms.length > 0) {
            setDbRooms(data.rooms.map(r => ({
              ...r,
              floorName: r.floor_level === 'ground' ? 'Ground Floor (L0)' : r.floor_level === 'floor1' ? 'First Floor (L1)' : 'Second Floor (L2)',
              coordinates: { x: r.coord_x, y: r.coord_y }
            })));
          }
        }).catch(err => console.warn("Backend offline, using static room data"));

      // Fetch watercoolers from SQLite
      apiService.getWatercoolers()
        .then(data => {
          if (data.success && data.watercoolers.length > 0) {
            setDbWcs(data.watercoolers.map(w => ({
              ...w,
              floorName: w.floor_level === 'ground' ? 'Ground Floor (L0)' : w.floor_level === 'floor1' ? 'First Floor (L1)' : 'Second Floor (L2)',
              coordinates: { x: w.coord_x, y: w.coord_y }
            })));
          }
        }).catch(err => console.warn("Backend offline, using static watercooler data"));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentFloor = SBM_INDOOR_DATA.floors.find(f => f.id === activeFloorId) || SBM_INDOOR_DATA.floors[0];

  // Helpers
  const allWaterCoolers = dbWcs.length > 0 ? dbWcs : SBM_INDOOR_DATA.floors.flatMap(f => f.waterCoolers.map(wc => ({ ...wc, floorName: f.name })));
  const allRooms = dbRooms.length > 0 ? dbRooms : SBM_INDOOR_DATA.floors.flatMap(f => f.rooms.map(r => ({ ...r, floorName: f.name })));

  const displayedRooms = allRooms.filter(r => {
    const fl = activeFloorId === 'ground' ? 'ground' : activeFloorId === 'first' ? 'floor1' : 'floor2';
    return r.floor_level === fl || r.floorName?.toLowerCase().includes(activeFloorId);
  });

  const displayedWaterCoolers = allWaterCoolers.filter(w => {
    const fl = activeFloorId === 'ground' ? 'ground' : activeFloorId === 'first' ? 'floor1' : 'floor2';
    return w.floor_level === fl || w.floorName?.toLowerCase().includes(activeFloorId);
  });

  const handleCalculateIndoorPath = () => {
    const targetRoom = allRooms.find(r => r.id === pathEndId);
    const targetWC = allWaterCoolers.find(w => w.id === pathEndId);
    const destName = targetRoom ? targetRoom.name : (targetWC ? targetWC.name : pathEndId);

    setActivePath({
      from: pathStartId === 'ENTRANCE_WEST' ? 'West Main Gate Entrance' : 'Central Atrium Elevator',
      to: destName,
      distanceMeters: Math.floor(25 + Math.random() * 45),
      stepsCount: Math.floor(35 + Math.random() * 60),
      durationMins: 1,
      steps: [
        'Enter through SBM Main Corridor entrance.',
        'Follow the primary central corridor path.',
        'Pass SBM-01 AI Keynote Hall on your left.',
        `Arrive at your target destination: ${destName}.`
      ]
    });
  };

  return (
    <div className="indoor-modal-overlay" style={{
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
      <div className="animate-scale-up indoor-modal-container" style={{
        width: '100%',
        maxWidth: '1040px',
        maxHeight: '90vh',
        borderRadius: '16px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        border: '1px solid var(--colors-hairline-strong)',
        boxShadow: 'var(--shadow-md)',
        background: 'var(--colors-surface-card)'
      }}>
        {/* HEADER - MATCHES PARKING & CANTEEN MODAL */}
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
              <Building2 size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--colors-ink)', fontFamily: 'var(--font-heading)' }}>
                🏢 School of Business Management (SBM) Digital Twin
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--colors-body)', fontFamily: 'var(--font-main)' }}>
                AI Summit Rooms, Classrooms, Watercoolers Network & Corridor Paths
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {onNavigateToBuilding && (
              <button
                onClick={() => {
                  onNavigateToBuilding({
                    name: 'School of Business Management (SBM)',
                    lat: 26.503022,
                    lng: 80.266371
                  });
                  onClose();
                }}
                className="ollama-btn-primary"
                style={{ height: '34px', padding: '0 14px', fontSize: '12px', borderRadius: '9999px' }}
              >
                <Navigation size={13} /> Campus GPS Route
              </button>
            )}

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

        {/* TAB BAR & FLOOR SELECTOR */}
        <div style={{
          padding: '12px 24px',
          borderBottom: '1px solid var(--colors-hairline)',
          background: 'var(--colors-surface-soft)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          {/* NAVIGATION TABS */}
          <div style={{ display: 'flex', gap: '8px' }}>
            {[
              { id: 'map', label: '🗺️ Corridor Blueprint' },
              { id: 'watercoolers', label: `🚰 Watercoolers (${allWaterCoolers.length})` },
              { id: 'rooms', label: `🏫 Classrooms (${allRooms.length})` },
              { id: 'pathfinder', label: '📍 Indoor Pathfinder' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={activeTab === tab.id ? 'ollama-btn-primary' : 'ollama-btn-secondary'}
                style={{ height: '34px', borderRadius: '9999px', fontSize: '12px', padding: '0 14px' }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* FLOOR SELECTOR */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '11px', color: 'var(--colors-body)', fontWeight: 600, marginRight: '4px' }}>
              FLOOR:
            </span>
            {SBM_INDOOR_DATA.floors.map(floor => (
              <button
                key={floor.id}
                onClick={() => setActiveFloorId(floor.id)}
                className={activeFloorId === floor.id ? 'ollama-btn-primary' : 'ollama-btn-secondary'}
                style={{ height: '30px', borderRadius: '9999px', fontSize: '11px', padding: '0 12px' }}
              >
                {floor.name}
              </button>
            ))}
          </div>
        </div>

        {/* MODAL BODY CONTENT */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>

          {/* VIEW 1: CORRIDOR BLUEPRINT */}
          {activeTab === 'map' && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '20px', overflow: 'hidden' }}>
              
              {/* Floor Sub-Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '12px',
                padding: '10px 14px',
                background: 'var(--colors-surface-soft)',
                borderRadius: '12px',
                border: '1px solid var(--colors-hairline)'
              }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--colors-ink)', fontFamily: 'var(--font-heading)' }}>
                  {currentFloor.name} • {currentFloor.corridorName}
                </span>
                <span style={{ fontSize: '12px', color: 'var(--colors-body)' }}>
                  🚪 {displayedRooms.length} Rooms | 🚰 {displayedWaterCoolers.length} Watercoolers | 🛤️ Walkway: {currentFloor.corridorLengthMeters}m
                </span>
              </div>

              {/* VECTOR BLUEPRINT CANVAS */}
              <div style={{
                flex: 1,
                background: 'var(--colors-surface-soft)',
                borderRadius: '14px',
                border: '1px solid var(--colors-hairline-strong)',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg width="920" height="360" viewBox="0 0 960 380" style={{ maxWidth: '100%', maxHeight: '100%' }}>
                  {/* BUILDING OUTER WALLS */}
                  <rect x="50" y="40" width="860" height="300" rx="16" fill="var(--colors-canvas)" stroke="var(--colors-hairline-strong)" strokeWidth="2.5" />
                  
                  {/* CORRIDOR WALKWAY */}
                  <rect x="70" y="195" width="820" height="50" rx="10" fill="var(--colors-surface-soft)" stroke="var(--colors-hairline-strong)" strokeWidth="1.5" strokeDasharray="4 4" />
                  <path d="M 80 220 L 880 220" stroke="#3B82F6" strokeWidth="3" strokeDasharray="8 6" className="animate-pulse" />

                  {/* ROOM BOXES */}
                  {displayedRooms.map(room => (
                    <g 
                      key={room.id} 
                      onClick={() => setSelectedItem(room)}
                      style={{ cursor: 'pointer' }}
                    >
                      <rect 
                        x={room.coordinates.x - 70} 
                        y={room.coordinates.y - 70} 
                        width="140" 
                        height="100" 
                        rx="12" 
                        fill={selectedItem?.id === room.id ? 'var(--colors-surface-dark)' : 'var(--colors-surface-card)'} 
                        stroke={selectedItem?.id === room.id ? 'var(--colors-primary)' : 'var(--colors-hairline-strong)'} 
                        strokeWidth={selectedItem?.id === room.id ? '2.5' : '1.5'}
                      />

                      {/* Room Door Line */}
                      <line x1={room.coordinates.x - 15} y1={room.coordinates.y + 30} x2={room.coordinates.x + 15} y2={room.coordinates.y + 30} stroke="#10B981" strokeWidth="4" />
                      
                      {/* Room Label */}
                      <text x={room.coordinates.x} y={room.coordinates.y - 35} fill={selectedItem?.id === room.id ? '#FFF' : 'var(--colors-ink)'} fontSize="12" fontWeight="700" textAnchor="middle">
                        {room.id}
                      </text>
                      <text x={room.coordinates.x} y={room.coordinates.y - 18} fill={selectedItem?.id === room.id ? '#A3A3A3' : 'var(--colors-body)'} fontSize="9" fontWeight="600" textAnchor="middle">
                        {room.name.split(':')[1] || room.type}
                      </text>
                      <text x={room.coordinates.x} y={room.coordinates.y + 5} fill={selectedItem?.id === room.id ? '#D4D4D4' : 'var(--colors-body)'} fontSize="8" textAnchor="middle">
                        👥 {room.capacity}
                      </text>

                      {/* Status Pill */}
                      <rect x={room.coordinates.x - 50} y={room.coordinates.y + 12} width="100" height="14" rx="7" fill={selectedItem?.id === room.id ? '#333' : 'var(--colors-surface-soft)'} />
                      <text x={room.coordinates.x} y={room.coordinates.y + 22} fill={selectedItem?.id === room.id ? '#FFF' : 'var(--colors-ink)'} fontSize="8" fontWeight="600" textAnchor="middle">
                        {room.status}
                      </text>
                    </g>
                  ))}

                  {/* WATERCOOLER MARKERS */}
                  {displayedWaterCoolers.map(wc => (
                    <g 
                      key={wc.id}
                      onClick={() => setSelectedItem(wc)}
                      style={{ cursor: 'pointer' }}
                    >
                      <circle cx={wc.coordinates.x} cy={wc.coordinates.y} r="20" fill="rgba(59, 130, 246, 0.15)" stroke="#3B82F6" strokeWidth="2" />
                      <circle cx={wc.coordinates.x} cy={wc.coordinates.y} r="13" fill="#2563EB" />
                      <text x={wc.coordinates.x} y={wc.coordinates.y + 5} fill="#FFF" fontSize="11" textAnchor="middle">🚰</text>

                      <rect x={wc.coordinates.x - 45} y={wc.coordinates.y + 24} width="90" height="16" rx="8" fill="var(--colors-surface-dark)" />
                      <text x={wc.coordinates.x} y={wc.coordinates.y + 36} fill="#FFF" fontSize="8" fontWeight="700" textAnchor="middle">
                        {wc.id} (RO Cold)
                      </text>
                    </g>
                  ))}

                  {/* AMENITIES */}
                  {currentFloor.amenities.map(item => (
                    <g key={item.id}>
                      <rect x={item.coordinates.x - 30} y={item.coordinates.y - 12} width="60" height="24" rx="6" fill="var(--colors-canvas)" stroke="var(--colors-hairline-strong)" strokeWidth="1" />
                      <text x={item.coordinates.x} y={item.coordinates.y + 4} fill="var(--colors-ink)" fontSize="9" fontWeight="600" textAnchor="middle">
                        {item.type === 'Stairs' ? '🪜 Stairs' : item.type === 'Elevator' ? '🛗 Elevator' : item.type === 'Washroom' ? '🚻 WC' : '🚪 Exit'}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>

              {/* INSPECTOR DETAILS FOOTER */}
              {selectedItem && (
                <div style={{
                  marginTop: '12px',
                  padding: '12px 16px',
                  background: 'var(--colors-surface-soft)',
                  border: '1px solid var(--colors-hairline-strong)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    {selectedItem.image ? (
                      <img 
                        src={selectedItem.image} 
                        alt={selectedItem.name}
                        style={{ width: '50px', height: '50px', borderRadius: '10px', objectFit: 'cover', border: '1px solid var(--colors-hairline-strong)' }} 
                      />
                    ) : (
                      <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'var(--colors-surface-dark)', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Building2 size={20} />
                      </div>
                    )}
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--colors-ink)', fontFamily: 'var(--font-heading)' }}>
                        {selectedItem.name}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--colors-body)', marginTop: '2px' }}>
                        {selectedItem.type} • {selectedItem.locationDescription || selectedItem.currentEvent || selectedItem.equipment}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => {
                        setActiveTab('pathfinder');
                        setPathEndId(selectedItem.id);
                        handleCalculateIndoorPath();
                      }}
                      className="ollama-btn-primary"
                      style={{ height: '32px', borderRadius: '9999px', fontSize: '12px', padding: '0 14px' }}
                    >
                      <Navigation size={12} /> Corridor Route
                    </button>
                    <button
                      onClick={() => setSelectedItem(null)}
                      className="ollama-btn-secondary"
                      style={{ height: '32px', borderRadius: '9999px', fontSize: '12px', padding: '0 12px' }}
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* VIEW 2: WATERCOOLERS DIRECTORY */}
          {activeTab === 'watercoolers' && (
            <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--colors-ink)', fontFamily: 'var(--font-heading)', margin: '0 0 4px' }}>
                  🚰 SBM Campus Water Cooler Network & Purified Hydration Stations
                </h4>
                <p style={{ fontSize: '12px', color: 'var(--colors-body)', margin: 0 }}>
                  High-resolution images, purified water telemetry, cold water dispensers, and corridor locations
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
                {allWaterCoolers.map(wc => (
                  <div key={wc.id} style={{
                    background: 'var(--colors-surface-soft)',
                    border: '1px solid var(--colors-hairline-strong)',
                    borderRadius: '14px',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    <div style={{ position: 'relative', height: '160px', overflow: 'hidden' }}>
                      <img src={wc.image} alt={wc.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'var(--colors-surface-dark)', color: '#FFF', fontSize: '10px', fontWeight: 700, padding: '3px 8px', borderRadius: '9999px' }}>
                        {wc.floorName}
                      </div>
                      <div style={{ position: 'absolute', bottom: '10px', right: '10px', background: '#10B981', color: '#FFF', fontSize: '10px', fontWeight: 700, padding: '3px 8px', borderRadius: '9999px' }}>
                        ⚡ {wc.status}
                      </div>
                    </div>

                    <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--colors-ink)', fontFamily: 'var(--font-heading)', margin: '0 0 4px' }}>
                          {wc.name}
                        </h4>
                        <p style={{ fontSize: '12px', color: 'var(--colors-body)', margin: '0 0 12px' }}>
                          📍 {wc.locationDescription}
                        </p>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
                          <div style={{ background: 'var(--colors-canvas)', border: '1px solid var(--colors-hairline)', padding: '8px', borderRadius: '8px' }}>
                            <div style={{ fontSize: '10px', color: 'var(--colors-body)' }}>Temperature</div>
                            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--colors-ink)' }}>{wc.temperature}</div>
                          </div>
                          <div style={{ background: 'var(--colors-canvas)', border: '1px solid var(--colors-hairline)', padding: '8px', borderRadius: '8px' }}>
                            <div style={{ fontSize: '10px', color: 'var(--colors-body)' }}>Water Purity</div>
                            <div style={{ fontSize: '13px', fontWeight: 700, color: '#10B981' }}>{wc.purity}</div>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          const floor = SBM_INDOOR_DATA.floors.find(f => f.waterCoolers.some(w => w.id === wc.id));
                          if (floor) setActiveFloorId(floor.id);
                          setSelectedItem(wc);
                          setActiveTab('map');
                        }}
                        className="ollama-btn-primary"
                        style={{ height: '36px', width: '100%', borderRadius: '9999px', fontSize: '12px' }}
                      >
                        Show on Corridor Blueprint
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW 3: CLASSROOMS DIRECTORY */}
          {activeTab === 'rooms' && (
            <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--colors-ink)', fontFamily: 'var(--font-heading)', margin: '0 0 4px' }}>
                    🏫 SBM Classrooms, Keynote Halls & GPU Labs
                  </h4>
                  <p style={{ fontSize: '12px', color: 'var(--colors-body)', margin: 0 }}>
                    All lecture rooms, ML computer labs, keynote auditoriums, and research suites
                  </p>
                </div>

                <div style={{ position: 'relative', width: '260px' }}>
                  <Search size={14} color="var(--colors-body)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input 
                    type="text" 
                    placeholder="Search rooms, labs, events..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'var(--colors-surface-soft)',
                      border: '1px solid var(--colors-hairline-strong)',
                      borderRadius: '9999px',
                      padding: '7px 12px 7px 34px',
                      color: 'var(--colors-ink)',
                      fontSize: '12px',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '14px' }}>
                {allRooms.filter(r => r.name.toLowerCase().includes(searchQuery.toLowerCase()) || r.id.toLowerCase().includes(searchQuery.toLowerCase())).map(room => (
                  <div key={room.id} style={{
                    background: 'var(--colors-surface-soft)',
                    border: '1px solid var(--colors-hairline-strong)',
                    borderRadius: '12px',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <span style={{ background: 'var(--colors-surface-dark)', color: '#FFF', fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '6px' }}>
                          {room.id}
                        </span>
                        <span style={{ fontSize: '11px', color: 'var(--colors-body)', fontWeight: 600 }}>
                          📍 {room.floorName}
                        </span>
                      </div>

                      <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--colors-ink)', fontFamily: 'var(--font-heading)', margin: '0 0 6px' }}>
                        {room.name}
                      </h4>

                      <div style={{ fontSize: '12px', color: 'var(--colors-ink)', fontWeight: 600, marginBottom: '6px' }}>
                        📌 Event: {room.currentEvent}
                      </div>

                      <div style={{ fontSize: '11px', color: 'var(--colors-body)', marginBottom: '12px' }}>
                        ⚙️ Specs: {room.equipment}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid var(--colors-hairline)' }}>
                      <span style={{ fontSize: '11px', color: '#10B981', fontWeight: 600 }}>
                        👥 Capacity: {room.capacity}
                      </span>

                      <button
                        onClick={() => {
                          const floor = SBM_INDOOR_DATA.floors.find(f => f.rooms.some(r => r.id === room.id));
                          if (floor) setActiveFloorId(floor.id);
                          setSelectedItem(room);
                          setActiveTab('map');
                        }}
                        className="ollama-btn-secondary"
                        style={{ height: '30px', padding: '0 12px', fontSize: '11px', borderRadius: '9999px' }}
                      >
                        Locate on Map →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW 4: INDOOR PATHFINDER */}
          {activeTab === 'pathfinder' && (
            <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--colors-ink)', fontFamily: 'var(--font-heading)', margin: '0 0 4px' }}>
                  📍 Indoor SBM Corridor Navigation & Shortest Path Engine
                </h4>
                <p style={{ fontSize: '12px', color: 'var(--colors-body)', margin: 0 }}>
                  Generate turn-by-turn walking corridor routes to rooms and watercoolers
                </p>
              </div>

              {/* SELECTION CARD */}
              <div className="indoor-pathfinder-selection-card" style={{ padding: '20px', borderRadius: '12px', background: 'var(--colors-surface-soft)', border: '1px solid var(--colors-hairline-strong)', alignItems: 'end' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--colors-ink)', display: 'block', marginBottom: '6px' }}>START POINT:</label>
                  <select 
                    value={pathStartId} 
                    onChange={(e) => setPathStartId(e.target.value)}
                    style={{ width: '100%', background: 'var(--colors-canvas)', border: '1px solid var(--colors-hairline-strong)', color: 'var(--colors-ink)', padding: '8px', borderRadius: '8px', fontSize: '12px', outline: 'none' }}
                  >
                    <option value="ENTRANCE_WEST">West Gate Main Entrance Corridor</option>
                    <option value="ELEVATOR_CENTRAL">Central Atrium Elevator Lobby</option>
                    <option value="STAIR_WEST">West Staircase A Landing</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--colors-ink)', display: 'block', marginBottom: '6px' }}>DESTINATION:</label>
                  <select 
                    value={pathEndId} 
                    onChange={(e) => setPathEndId(e.target.value)}
                    style={{ width: '100%', background: 'var(--colors-canvas)', border: '1px solid var(--colors-hairline-strong)', color: 'var(--colors-ink)', padding: '8px', borderRadius: '8px', fontSize: '12px', outline: 'none' }}
                  >
                    <optgroup label="🚰 Watercoolers">
                      {allWaterCoolers.map(w => (
                        <option key={w.id} value={w.id}>{w.name}</option>
                      ))}
                    </optgroup>
                    <optgroup label="🏫 Classrooms & Halls">
                      {allRooms.map(r => (
                        <option key={r.id} value={r.id}>{r.name}</option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                <button
                  onClick={handleCalculateIndoorPath}
                  className="ollama-btn-primary"
                  style={{ height: '36px', padding: '0 16px', fontSize: '12px', borderRadius: '9999px' }}
                >
                  <Navigation size={14} /> Compute Route
                </button>
              </div>

              {/* PATH STEPS */}
              {activePath && (
                <div style={{ padding: '20px', borderRadius: '12px', background: 'var(--colors-surface-soft)', border: '1px solid var(--colors-hairline-strong)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <div>
                      <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--colors-ink)', fontFamily: 'var(--font-heading)', margin: 0 }}>
                        Corridor Route: {activePath.from} → {activePath.to}
                      </h4>
                      <span style={{ fontSize: '12px', color: 'var(--colors-body)' }}>
                        📏 Distance: {activePath.distanceMeters} Meters • 🚶 Walk Time: {activePath.durationMins} Min ({activePath.stepsCount} Steps)
                      </span>
                    </div>

                    <button
                      onClick={() => setActiveTab('map')}
                      className="ollama-btn-secondary"
                      style={{ height: '32px', padding: '0 14px', fontSize: '12px', borderRadius: '9999px' }}
                    >
                      View on Blueprint Map
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {activePath.steps.map((step, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--colors-canvas)', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--colors-hairline)' }}>
                        <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'var(--colors-surface-dark)', color: '#FFF', fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {idx + 1}
                        </span>
                        <span style={{ fontSize: '13px', color: 'var(--colors-ink)', fontWeight: 500 }}>
                          {step}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

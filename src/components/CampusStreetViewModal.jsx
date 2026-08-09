import React, { useEffect, useRef, useState } from 'react';
import { 
  X, Eye, Compass, MapPin, ZoomIn, ZoomOut, Play, Pause, 
  RotateCcw, ChevronDown, Sparkles, Navigation, Layers
} from 'lucide-react';
import { 
  getNearestStreetViewLocation, 
  CAMPUS_STREET_VIEW_NODES, 
  CAMPUS_STREET_VIEW_LOCATIONS,
  FALLBACK_STREET_VIEW
} from '../data/streetViewData';
import { findNearestStreetViewNode } from '../utils/haversine';

export default function CampusStreetViewModal({
  isOpen,
  onClose,
  currentLocation,
  destination
}) {
  const containerRef = useRef(null);
  const viewerInstanceRef = useRef(null);

  const targetLat = destination?.lat || currentLocation?.lat || 26.4970;
  const targetLng = destination?.lng || currentLocation?.lng || 80.2666;

  const [activeLocation, setActiveLocation] = useState(() => 
    getNearestStreetViewLocation(targetLat, targetLng)
  );

  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [isAutoRotating, setIsAutoRotating] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);

  // Sync active 360 location when target coordinates change or modal opens
  useEffect(() => {
    if (isOpen) {
      const nearest = getNearestStreetViewLocation(targetLat, targetLng);
      setActiveLocation(nearest);
    }
  }, [isOpen, targetLat, targetLng]);

  // Load Pannellum 360 Library dynamically
  useEffect(() => {
    if (!isOpen) return;

    if (window.pannellum) {
      setIsScriptLoaded(true);
      return;
    }

    // Insert CSS
    if (!document.getElementById('pannellum-css')) {
      const link = document.createElement('link');
      link.id = 'pannellum-css';
      link.rel = 'stylesheet';
      link.href = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css';
      document.head.appendChild(link);
    }

    // Insert JS
    if (!document.getElementById('pannellum-js')) {
      const script = document.createElement('script');
      script.id = 'pannellum-js';
      script.src = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js';
      script.async = true;
      script.onload = () => {
        setIsScriptLoaded(true);
      };
      document.head.appendChild(script);
    } else {
      const interval = setInterval(() => {
        if (window.pannellum) {
          setIsScriptLoaded(true);
          clearInterval(interval);
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  // Initialize & configure Pannellum 360 Tour Viewer
  useEffect(() => {
    if (!isOpen || !isScriptLoaded || !containerRef.current || !window.pannellum) return;

    // Destroy existing viewer instance if any
    if (viewerInstanceRef.current) {
      try {
        viewerInstanceRef.current.destroy();
      } catch (e) {
        console.warn(e);
      }
      viewerInstanceRef.current = null;
    }

    // Build multi-scene tour configuration graph from CAMPUS_STREET_VIEW_NODES
    const scenesConfig = {};
    Object.values(CAMPUS_STREET_VIEW_NODES).forEach((node) => {
      scenesConfig[node.id] = {
        title: node.name,
        type: "equirectangular",
        panorama: node.panoramaUrl,
        autoLoad: true,
        hotSpots: (node.hotspots || []).map((hs) => {
          const targetNode = CAMPUS_STREET_VIEW_NODES[hs.targetNodeId];
          return {
            pitch: hs.pitch || 0,
            yaw: hs.yaw || 0,
            type: "scene",
            text: hs.text || `Walk to ${targetNode?.name || hs.targetNodeId}`,
            sceneId: hs.targetNodeId
          };
        })
      };
    });

    const initialSceneId = activeLocation?.id && scenesConfig[activeLocation.id] 
      ? activeLocation.id 
      : 'main_gate';

    try {
      const viewer = window.pannellum.viewer(containerRef.current, {
        default: {
          firstScene: initialSceneId,
          sceneFadeDuration: 800,
          autoLoad: true,
          showControls: false,
          compass: true
        },
        scenes: scenesConfig
      });

      viewerInstanceRef.current = viewer;

      // Update React state when user clicks a 360 hotspot arrow and changes scene
      viewer.on('scenechange', (sceneId) => {
        const node = CAMPUS_STREET_VIEW_NODES[sceneId];
        if (node) {
          setActiveLocation(node);
        }
      });

    } catch (err) {
      console.error("Pannellum 360 initialization error:", err);
    }

    return () => {
      if (viewerInstanceRef.current) {
        try {
          viewerInstanceRef.current.destroy();
        } catch (e) {
          console.warn(e);
        }
        viewerInstanceRef.current = null;
      }
    };
  }, [isOpen, isScriptLoaded]);

  if (!isOpen) return null;

  // Handle direct location picker selection
  const handleSelectLocation = (loc) => {
    setActiveLocation(loc);
    setShowLocationPicker(false);
    if (viewerInstanceRef.current && loc?.id) {
      try {
        viewerInstanceRef.current.loadScene(loc.id);
      } catch (e) {
        console.warn(e);
      }
    }
  };

  const handleZoomIn = () => {
    if (viewerInstanceRef.current) {
      try {
        const currentFov = viewerInstanceRef.current.getFov();
        viewerInstanceRef.current.setFov(Math.max(30, currentFov - 15));
      } catch (e) {
        console.warn(e);
      }
    }
  };

  const handleZoomOut = () => {
    if (viewerInstanceRef.current) {
      try {
        const currentFov = viewerInstanceRef.current.getFov();
        viewerInstanceRef.current.setFov(Math.min(110, currentFov + 15));
      } catch (e) {
        console.warn(e);
      }
    }
  };

  const handleToggleAutoRotate = () => {
    if (viewerInstanceRef.current) {
      try {
        if (isAutoRotating) {
          viewerInstanceRef.current.stopAutoRotate();
          setIsAutoRotating(false);
        } else {
          viewerInstanceRef.current.startAutoRotate(-2); // Rotate 2 deg/sec left
          setIsAutoRotating(true);
        }
      } catch (e) {
        console.warn(e);
      }
    }
  };

  const handleResetOrientation = () => {
    if (viewerInstanceRef.current) {
      try {
        viewerInstanceRef.current.setPitch(0);
        viewerInstanceRef.current.setYaw(0);
        viewerInstanceRef.current.setFov(90);
      } catch (e) {
        console.warn(e);
      }
    }
  };

  const currentHotspots = activeLocation?.hotspots || [];

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      background: '#090E1A',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'var(--font-main)',
      color: '#FFFFFF'
    }}>
      {/* Top Header Controls Overlay Bar */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        padding: '16px 24px',
        background: 'linear-gradient(180deg, rgba(9, 14, 26, 0.95) 0%, rgba(9, 14, 26, 0) 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        pointerEvents: 'none'
      }}>
        {/* Active Node Info & Title */}
        <div style={{ pointerEvents: 'auto', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #0284C7 0%, #00F0FF 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(0, 240, 255, 0.4)'
          }}>
            <Eye size={24} color="#FFF" />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                background: 'rgba(0, 240, 255, 0.15)',
                color: '#00F0FF',
                fontSize: '11px',
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: '12px',
                textTransform: 'uppercase',
                border: '1px solid rgba(0, 240, 255, 0.3)'
              }}>
                {activeLocation?.category || '360° Street View'}
              </span>

              {currentHotspots.length > 0 && (
                <span style={{
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: '#34D399',
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: '12px',
                  border: '1px solid rgba(16, 185, 129, 0.3)'
                }}>
                  🧭 {currentHotspots.length} Walk Hotspots
                </span>
              )}
            </div>

            <h2 style={{ fontSize: '18px', fontWeight: 900, marginTop: '2px', color: '#FFF' }}>
              {activeLocation?.name || 'Campus 360° Location'}
            </h2>
          </div>
        </div>

        {/* Right Top Actions */}
        <div style={{ pointerEvents: 'auto', display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Location Selector Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowLocationPicker(!showLocationPicker)}
              style={{
                background: 'rgba(255, 255, 255, 0.12)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                color: '#FFF',
                padding: '8px 14px',
                borderRadius: '12px',
                fontSize: '13px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer'
              }}
            >
              <MapPin size={16} color="#00F0FF" />
              <span>Change View</span>
              <ChevronDown size={14} />
            </button>

            {showLocationPicker && (
              <div style={{
                position: 'absolute',
                top: '46px',
                right: 0,
                width: '300px',
                background: 'rgba(15, 23, 42, 0.95)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '16px',
                padding: '8px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.6)',
                zIndex: 100
              }}>
                <div style={{ padding: '8px 12px', fontSize: '11px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>
                  Select Campus 360° Node
                </div>
                {CAMPUS_STREET_VIEW_LOCATIONS.map((loc) => (
                  <button
                    key={loc.id}
                    onClick={() => handleSelectLocation(loc)}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      background: activeLocation?.id === loc.id ? 'rgba(0, 102, 255, 0.3)' : 'transparent',
                      border: 'none',
                      color: activeLocation?.id === loc.id ? '#00F0FF' : '#E2E8F0',
                      fontSize: '13px',
                      fontWeight: activeLocation?.id === loc.id ? 800 : 500,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <Compass size={14} color={activeLocation?.id === loc.id ? '#00F0FF' : '#64748B'} />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {loc.name}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Close Modal Button */}
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: '#FFF',
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)'
            }}
            title="Close Street View"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Main 360 Container */}
      <div 
        ref={containerRef} 
        style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }} 
      />

      {/* Bottom Floating Control Bar */}
      <div style={{
        position: 'absolute',
        bottom: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 50,
        background: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '30px',
        padding: '8px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)'
      }}>
        {/* Zoom In */}
        <button
          onClick={handleZoomIn}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#E2E8F0',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '12px',
            fontWeight: 700
          }}
          title="Zoom In"
        >
          <ZoomIn size={18} color="#00F0FF" />
          <span>Zoom +</span>
        </button>

        <div style={{ width: '1px', height: '20px', background: 'rgba(255, 255, 255, 0.2)' }} />

        {/* Zoom Out */}
        <button
          onClick={handleZoomOut}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#E2E8F0',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '12px',
            fontWeight: 700
          }}
          title="Zoom Out"
        >
          <ZoomOut size={18} color="#00F0FF" />
          <span>Zoom -</span>
        </button>

        <div style={{ width: '1px', height: '20px', background: 'rgba(255, 255, 255, 0.2)' }} />

        {/* Auto Rotate Toggle */}
        <button
          onClick={handleToggleAutoRotate}
          style={{
            background: isAutoRotating ? 'rgba(0, 240, 255, 0.25)' : 'transparent',
            border: isAutoRotating ? '1px solid #00F0FF' : 'none',
            color: isAutoRotating ? '#00F0FF' : '#E2E8F0',
            padding: '4px 10px',
            borderRadius: '16px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '12px',
            fontWeight: 700
          }}
          title="Toggle 360° Auto Rotation"
        >
          {isAutoRotating ? <Pause size={16} /> : <Play size={16} />}
          <span>Auto Rotate</span>
        </button>

        <div style={{ width: '1px', height: '20px', background: 'rgba(255, 255, 255, 0.2)' }} />

        {/* Reset View */}
        <button
          onClick={handleResetOrientation}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#E2E8F0',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '12px',
            fontWeight: 700
          }}
          title="Reset Orientation"
        >
          <RotateCcw size={16} color="#38BDF8" />
          <span>Reset</span>
        </button>
      </div>

      {/* Instruction Toast Overlay */}
      <div style={{
        position: 'absolute',
        top: '85px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 40,
        background: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        borderRadius: '20px',
        padding: '6px 16px',
        fontSize: '12px',
        color: '#94A3B8',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        pointerEvents: 'none'
      }}>
        <Sparkles size={14} color="#00F0FF" />
        <span>Click & drag to look 360°. Click arrow hotspots on screen to walk between campus nodes.</span>
      </div>
    </div>
  );
}

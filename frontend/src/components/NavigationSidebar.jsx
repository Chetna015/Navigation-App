import React, { useEffect, useState, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  Navigation, Clock, Footprints, 
  Volume2, VolumeX, X, Compass, MapPin, Eye,
  ArrowUpRight, ArrowLeft, ArrowRight, CornerUpRight, CornerUpLeft,
  Maximize2, Minimize2, Search, AlertTriangle, Sparkles, Layers
} from 'lucide-react';
import { getCampusRoute } from '../utils/pathfinding';

/**
 * Embedded Mini Live Tracking Map Component inside single Card Block
 */
function EmbeddedMiniTrackingMap({ currentLocation, destination, routeInfo }) {
  const miniContainerRef = useRef(null);
  const miniMapRef = useRef(null);
  const markersRef = useRef(null);
  const polylineRef = useRef(null);

  useEffect(() => {
    if (!miniContainerRef.current) return;

    if (!miniMapRef.current) {
      const startLat = currentLocation?.lat || 26.4970;
      const startLng = currentLocation?.lng || 80.2666;

      const map = L.map(miniContainerRef.current, {
        center: [startLat, startLng],
        zoom: 18.5,
        zoomControl: false,
        attributionControl: false,
        dragging: true,
        scrollWheelZoom: true
      });

      L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
        maxZoom: 21,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
      }).addTo(map);

      markersRef.current = L.layerGroup().addTo(map);
      miniMapRef.current = map;
    }

    const map = miniMapRef.current;
    if (map) {
      map.invalidateSize();
    }
  }, []);

  // Update markers & route line inside mini map
  useEffect(() => {
    const map = miniMapRef.current;
    if (!map || !markersRef.current) return;

    markersRef.current.clearLayers();
    if (polylineRef.current) {
      map.removeLayer(polylineRef.current);
      polylineRef.current = null;
    }

    const fromLat = currentLocation?.lat || 26.4970;
    const fromLng = currentLocation?.lng || 80.2666;
    const toLat = destination?.lat || 26.5015;
    const toLng = destination?.lng || 80.2688;

    // 1. Live User Marker (Blue Directional Arrow)
    const heading = currentLocation?.heading || 45;
    const liveUserIcon = L.divIcon({
      className: 'mini-leaflet-user-arrow',
      html: `
        <div style="
          position: relative;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          transform: translate(-50%, -50%);
        ">
          <div style="
            position: absolute;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: rgba(0, 102, 255, 0.25);
            border: 1.5px solid rgba(0, 240, 255, 0.8);
            box-shadow: 0 0 15px rgba(0, 240, 255, 0.9);
          "></div>
          <div style="
            transform: rotate(${heading}deg);
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            filter: drop-shadow(0 2px 8px rgba(0, 102, 255, 0.9));
          ">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L19 21L12 17L5 21L12 2Z" fill="#0066FF" stroke="#FFFFFF" stroke-width="2" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>
      `,
      iconSize: [0, 0],
      iconAnchor: [0, 0]
    });

    const userMarker = L.marker([fromLat, fromLng], { icon: liveUserIcon });
    markersRef.current.addLayer(userMarker);

    // 2. Destination Callout Badge Marker
    if (destination) {
      const destBadgeIcon = L.divIcon({
        className: 'mini-leaflet-dest-badge',
        html: `
          <div style="
            transform: translate(-50%, -100%);
            background: #1D4ED8;
            color: #FFFFFF;
            font-family: system-ui, -apple-system, sans-serif;
            font-size: 11px;
            font-weight: 800;
            padding: 4px 10px;
            border-radius: 12px;
            box-shadow: 0 4px 14px rgba(29, 78, 216, 0.6);
            border: 1.5px solid #FFFFFF;
            white-space: nowrap;
          ">
            📍 ${destination.name || 'Destination'}
          </div>
        `,
        iconSize: [0, 0],
        iconAnchor: [0, 0]
      });

      const destMarker = L.marker([toLat, toLng], { icon: destBadgeIcon });
      markersRef.current.addLayer(destMarker);
    }

    // 3. Polyline Route
    const routePoints = (routeInfo && routeInfo.latLngList && routeInfo.latLngList.length >= 2)
      ? routeInfo.latLngList
      : null;

    if (routePoints && routePoints.length >= 2) {
      const polyline = L.polyline(routePoints, {
        color: '#1D4ED8',
        weight: 6,
        opacity: 0.95,
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(map);

      polylineRef.current = polyline;
    }

    // Center map view on user position
    try {
      map.flyTo([fromLat, fromLng], 18.5, { animate: true, duration: 0.8 });
    } catch (e) {
      console.warn(e);
    }
  }, [currentLocation, destination, routeInfo]);

  const handleRecenterMiniMap = () => {
    const map = miniMapRef.current;
    if (map && currentLocation) {
      map.flyTo([currentLocation.lat || 26.4970, currentLocation.lng || 80.2666], 19, { animate: true, duration: 0.8 });
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '175px', borderRadius: '18px', overflow: 'hidden', border: '1px solid #E2E8F0', boxShadow: 'inset 0 0 10px rgba(0,0,0,0.1)', flexShrink: 0 }}>
      <div ref={miniContainerRef} style={{ width: '100%', height: '100%' }} />

      {/* Floating Re-centre Button on Mini Map */}
      <button
        onClick={handleRecenterMiniMap}
        style={{
          position: 'absolute',
          bottom: '10px',
          left: '10px',
          zIndex: 400,
          background: '#FFFFFF',
          color: '#005A52',
          border: '1px solid rgba(0, 90, 82, 0.25)',
          padding: '6px 12px',
          borderRadius: '16px',
          fontSize: '12px',
          fontWeight: 800,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
        }}
      >
        <Navigation size={13} color="#005A52" style={{ transform: 'rotate(45deg)' }} /> Re-centre
      </button>

      {/* Live tracking badge top right of mini map */}
      <div style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        zIndex: 400,
        background: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(6px)',
        color: '#10B981',
        fontSize: '10px',
        fontWeight: 900,
        padding: '4px 10px',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        border: '1px solid rgba(16, 185, 129, 0.4)'
      }}>
        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981' }} className="animate-ping" />
        LIVE GPS TRACKING
      </div>
    </div>
  );
}

/**
 * Floating Sidebar Navigation Component
 * States: 'hidden' | 'preview' | 'active'
 */
export default function NavigationSidebar({
  currentLocation,
  destination,
  onCancelNavigation,
  accessibilityOptions,
  navMode = 'preview',
  setNavMode,
  onOpenStreetView
}) {
  const [routeInfo, setRouteInfo] = useState(null);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [showStepsModal, setShowStepsModal] = useState(false);

  const lastSidebarParamsRef = useRef(null);

  // Fetch road route info whenever origin or destination changes (with 5m thresholding)
  useEffect(() => {
    let isCancelled = false;

    async function fetchInfo() {
      if (!currentLocation || !destination) {
        setRouteInfo(null);
        lastSidebarParamsRef.current = null;
        return;
      }

      const sLat = currentLocation.lat || 26.4970;
      const sLng = currentLocation.lng || 80.2666;
      const eLat = destination.lat || 26.5015;
      const eLng = destination.lng || 80.2688;

      if (lastSidebarParamsRef.current) {
        const p = lastSidebarParamsRef.current;
        const isSameDest = Math.abs(p.eLat - eLat) < 0.00001 && Math.abs(p.eLng - eLng) < 0.00001;
        const dStart = Math.abs(p.sLat - sLat) + Math.abs(p.sLng - sLng);
        if (dStart < 0.00005 && isSameDest) {
          return;
        }
        if (!isSameDest) {
          setRouteInfo(null);
        }
      }

      lastSidebarParamsRef.current = { sLat, sLng, eLat, eLng };
      const info = await getCampusRoute(sLat, sLng, eLat, eLng);
      if (!isCancelled) {
        if (info) {
          setRouteInfo(info);
        } else {
          // Haversine distance metric calculation for info card without drawing straight path
          const dLat = (eLat - sLat) * Math.PI / 180;
          const dLon = (eLng - sLng) * Math.PI / 180;
          const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                    Math.cos(sLat * Math.PI / 180) * Math.cos(eLat * Math.PI / 180) *
                    Math.sin(dLon/2) * Math.sin(dLon/2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
          const distMeters = Math.max(20, Math.round(6371000 * c));

          setRouteInfo({
            path: null,
            latLngList: null,
            totalDistanceMeters: distMeters,
            walkingTimeMins: Math.max(1, Math.round(distMeters / 75)),
            totalSteps: Math.round(distMeters / 0.75),
            directions: []
          });
        }
      }
    }

    fetchInfo();

    return () => {
      isCancelled = true;
    };
  }, [currentLocation, destination]);

  if (navMode === 'hidden' || !destination) return null;

  const distance = routeInfo ? routeInfo.totalDistanceMeters : 350;
  const walkTime = routeInfo ? routeInfo.walkingTimeMins : 4;
  const estimatedSteps = routeInfo ? routeInfo.totalSteps : 460;

  // Calculate ETA string e.g. 1:02 pm
  const getETAString = (mins) => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + Math.max(1, mins || 3));
    return now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }).toLowerCase();
  };

  // Turn directions
  const steps = [
    { text: `Walk straight along Central Campus Avenue`, dist: "80m", icon: ArrowUpRight },
    { text: `Turn left towards ${destination?.name || 'Destination'}`, dist: "140m", icon: CornerUpLeft },
    { text: `Arrive at ${destination?.name || 'Destination'}`, dist: "30m", icon: MapPin }
  ];

  const currentStep = steps[currentStepIdx] || steps[0];
  const StepIcon = currentStep.icon || Navigation;

  // Voice speech synthesis
  const speakInstruction = (text) => {
    if (!voiceEnabled || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  const handleStartLiveNavigation = () => {
    if (setNavMode) {
      setNavMode('active');
    }
    speakInstruction(`Starting live turn-by-turn navigation to ${destination?.name}. Head straight.`);
  };

  const handleExitRoute = () => {
    if (setNavMode) setNavMode('hidden');
    if (onCancelNavigation) onCancelNavigation();
  };

  // -------------------------------------------------------------
  // STATE 1: 'preview' MODE (Route Preview Sidebar Box)
  // -------------------------------------------------------------
  if (navMode === 'preview') {
    return (
      <div 
        className="animate-slide-up navigation-sidebar-card"
        style={{
          position: 'absolute',
          bottom: '24px',
          left: '24px',
          width: '380px',
          maxWidth: 'calc(100vw - 48px)',
          borderRadius: '12px',
          padding: '20px',
          zIndex: 600,
          border: '1px solid var(--colors-hairline-strong)',
          boxShadow: 'var(--shadow-md)',
          background: 'var(--colors-surface-card)'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '9999px',
              background: 'var(--colors-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Navigation size={18} color="var(--colors-on-primary)" />
            </div>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--colors-body)', textTransform: 'uppercase', fontFamily: 'var(--font-heading)' }}>
                Route Preview
              </div>
              <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--colors-ink)', fontFamily: 'var(--font-heading)' }}>
                {currentLocation?.name || 'Current GPS Location'}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--colors-body)', fontFamily: 'var(--font-main)' }}>
                ➔ {destination?.name || 'Destination'}
              </div>
            </div>
          </div>

          <button
            onClick={handleExitRoute}
            className="ollama-btn-secondary"
            style={{ width: '32px', height: '32px', borderRadius: '9999px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            title="Cancel Route"
          >
            <X size={16} color="var(--colors-ink)" />
          </button>
        </div>

        {/* Metrics Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '8px',
          marginBottom: '16px'
        }}>
          <div style={{
            background: 'var(--colors-surface-soft)',
            border: '1px solid var(--colors-hairline)',
            borderRadius: '8px',
            padding: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '11px', color: 'var(--colors-body)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px' }}>
              <Compass size={12} /> Distance
            </div>
            <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--colors-ink)', fontFamily: 'var(--font-code)', marginTop: '2px' }}>
              {distance} m
            </div>
          </div>

          <div style={{
            background: 'var(--colors-surface-soft)',
            border: '1px solid var(--colors-hairline)',
            borderRadius: '8px',
            padding: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '11px', color: 'var(--colors-body)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px' }}>
              <Clock size={12} /> Time
            </div>
            <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--colors-ink)', fontFamily: 'var(--font-code)', marginTop: '2px' }}>
              {walkTime} min
            </div>
          </div>

          <div style={{
            background: 'var(--colors-surface-soft)',
            border: '1px solid var(--colors-hairline)',
            borderRadius: '8px',
            padding: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '11px', color: 'var(--colors-body)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px' }}>
              <Footprints size={12} /> Steps
            </div>
            <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--colors-ink)', fontFamily: 'var(--font-code)', marginTop: '2px' }}>
              {estimatedSteps}
            </div>
          </div>
        </div>

        {/* Start Live Navigation & 360° View Buttons */}
        <div style={{ display: 'flex', gap: '10px' }}>
          {onOpenStreetView && (
            <button
              onClick={onOpenStreetView}
              className="ollama-btn-secondary"
              style={{
                flex: '0 0 auto',
                height: '40px',
                fontSize: '13px'
              }}
              title="Open 360° Panoramic Street View"
            >
              <Eye size={16} />
              <span>360° View</span>
            </button>
          )}

          <button
            onClick={handleStartLiveNavigation}
            className="ollama-btn-primary"
            style={{
              flex: 1,
              height: '40px',
              fontSize: '14px'
            }}
          >
            <Navigation size={16} /> START LIVE NAVIGATION
          </button>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // STATE 2: 'active' MODE - SINGLE UNIFIED NAVIGATION CARD BLOCK
  // -------------------------------------------------------------
  if (navMode === 'active') {
    return (
      <div 
        className="animate-slide-up navigation-active-card"
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          bottom: '20px',
          width: '420px',
          maxWidth: 'calc(100vw - 40px)',
          maxHeight: 'calc(100vh - 40px)',
          zIndex: 850,
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-md)',
          border: '1px solid var(--colors-hairline-strong)',
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--colors-surface-card)'
        }}
      >
        {/* UPPER PART: OLLAMA SURFACE DARK HEADER BANNER */}
        <div style={{
          flexShrink: 0,
          background: 'var(--colors-surface-dark)',
          color: 'var(--colors-on-dark)',
          padding: '14px 18px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          borderBottom: '1px solid var(--colors-hairline)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '9999px',
                background: 'rgba(255, 255, 255, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <StepIcon size={20} color="var(--colors-on-dark)" />
              </div>

              <div>
                <div style={{ fontSize: '11px', textTransform: 'uppercase', opacity: 0.7, fontWeight: 500, fontFamily: 'var(--font-heading)' }}>
                  towards
                </div>
                <div style={{ fontSize: '16px', fontWeight: 600, fontFamily: 'var(--font-heading)', lineHeight: '1.2' }}>
                  {destination?.name || 'Destination'}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  border: 'none',
                  borderRadius: '9999px',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--colors-on-dark)',
                  cursor: 'pointer'
                }}
                title={voiceEnabled ? 'Mute Voice' : 'Unmute Voice'}
              >
                {voiceEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </button>

              <button
                onClick={handleExitRoute}
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  border: 'none',
                  borderRadius: '9999px',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--colors-on-dark)',
                  cursor: 'pointer'
                }}
                title="Cancel Live Navigation"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Sub-Banner Pill: Next Maneuver Preview */}
          <div style={{
            alignSelf: 'flex-start',
            background: 'rgba(0, 0, 0, 0.35)',
            backdropFilter: 'blur(6px)',
            borderRadius: '12px',
            padding: '4px 12px',
            fontSize: '12px',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            border: '1px solid rgba(255, 255, 255, 0.15)'
          }}>
            <span>Then</span>
            <CornerUpRight size={14} color="#6EE7B7" />
            <span style={{ color: '#E2E8F0', fontWeight: 600 }}>{currentStep.text || 'Continue along main path'}</span>
          </div>
        </div>

        {/* LOWER PART & REST OF CARD: WHITE BODY */}
        <div style={{
          flex: 1,
          padding: '14px 18px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          background: '#FFFFFF',
          color: '#0F172A',
          overflowY: 'auto'
        }}>
          <EmbeddedMiniTrackingMap
            currentLocation={currentLocation}
            destination={destination}
            routeInfo={routeInfo}
          />

          {/* 2. BOLD GREEN ETA, SUBTEXT & VOICE / 360° NAV CONTROLS */}
          <div style={{
            background: '#F8FAFC',
            border: '1px solid #E2E8F0',
            borderRadius: '16px',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px'
          }}>
            <div>
              <div style={{ fontSize: '26px', fontWeight: 900, color: '#16A34A', display: 'flex', alignItems: 'center', gap: '6px' }}>
                {walkTime} min <span style={{ fontSize: '18px' }}>🌿</span>
              </div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#475569', marginTop: '2px' }}>
                {distance} m • ETA {getETAString(walkTime)}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {/* 360° Street View Button */}
              {onOpenStreetView && (
                <button
                  onClick={onOpenStreetView}
                  style={{
                    background: 'rgba(2, 132, 199, 0.12)',
                    border: '1px solid rgba(2, 132, 199, 0.4)',
                    color: '#0284C7',
                    padding: '8px 10px',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    cursor: 'pointer'
                  }}
                  title="Open 360° Panoramic Street View"
                >
                  <Eye size={15} color="#0284C7" />
                  <span>360° View</span>
                </button>
              )}

              {/* Voice Navigation Toggle Button */}
              <button
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                style={{
                  background: voiceEnabled ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                  border: voiceEnabled ? '1px solid #10B981' : '1px solid #EF4444',
                  color: voiceEnabled ? '#059669' : '#EF4444',
                  padding: '8px 10px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  cursor: 'pointer',
                  boxShadow: voiceEnabled ? '0 2px 10px rgba(16, 185, 129, 0.2)' : 'none'
                }}
                title={voiceEnabled ? 'Mute Voice Navigation' : 'Enable Voice Navigation'}
              >
                {voiceEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
                <span>{voiceEnabled ? 'VOICE ON' : 'MUTED'}</span>
              </button>

              <div style={{
                background: '#EEF2FF',
                border: '1px solid #C7D2FE',
                borderRadius: '12px',
                padding: '6px 10px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '10px', color: '#4F46E5', fontWeight: 800 }}>STEPS</div>
                <div style={{ fontSize: '15px', fontWeight: 900, color: '#1E1B4B' }}>{estimatedSteps}</div>
              </div>
            </div>
          </div>

          {/* 3. TURN DIRECTION STEP INSTRUCTION */}
          <div style={{
            background: '#F1F5F9',
            border: '1px solid #E2E8F0',
            borderRadius: '14px',
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <StepIcon size={22} color="#005A52" />
            <div>
              <div style={{ fontSize: '10px', color: '#005A52', fontWeight: 800, textTransform: 'uppercase' }}>NEXT TURN INSTRUCTION</div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>{currentStep.text}</div>
            </div>
          </div>

          {/* 4. ACTION CONTROLS ROW */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <button
              onClick={() => setShowStepsModal(!showStepsModal)}
              style={{
                padding: '11px',
                borderRadius: '14px',
                background: '#F1F5F9',
                border: '1px solid #CBD5E1',
                color: '#334155',
                fontSize: '13px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <CornerUpRight size={16} /> {showStepsModal ? 'Hide Directions' : 'All Directions'}
            </button>

            <button
              onClick={handleExitRoute}
              style={{
                padding: '11px',
                borderRadius: '14px',
                background: '#FEF2F2',
                border: '1px solid #FCA5A5',
                color: '#EF4444',
                fontSize: '13px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <X size={16} /> Exit Route
            </button>
          </div>

          {/* Turn-by-Turn Steps List if toggled */}
          {showStepsModal && (
            <div style={{
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '16px',
              padding: '14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              <div style={{ fontSize: '13px', fontWeight: 900, color: '#0F172A' }}>Step-by-Step Guidance</div>
              {steps.map((st, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', color: '#334155', padding: '6px 8px', background: '#FFFFFF', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                  <st.icon size={16} color="#005A52" />
                  <div>
                    <div style={{ fontWeight: 700 }}>{st.text}</div>
                    <div style={{ fontSize: '11px', color: '#64748B' }}>{st.dist}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}

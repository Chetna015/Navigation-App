import React, { useEffect, useState } from 'react';
import { 
  Navigation, Clock, Footprints, 
  Volume2, VolumeX, X, Play, Pause, Compass, MapPin, 
  ArrowUpRight, ArrowLeft, ArrowRight, CornerUpRight, Maximize2, Minimize2
} from 'lucide-react';
import { getCampusRoute } from '../utils/pathfinding';

export default function NavigationBanner({
  currentLocation,
  destination,
  onCancelNavigation,
  accessibilityOptions,
  isNavigatingLive,
  setIsNavigatingLive
}) {
  const [routeInfo, setRouteInfo] = useState(null);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  // Fetch route info whenever origin or destination changes
  useEffect(() => {
    let isCancelled = false;

    async function fetchInfo() {
      if (!currentLocation || !destination) {
        setRouteInfo(null);
        return;
      }

      const sLat = currentLocation.lat || 26.4970;
      const sLng = currentLocation.lng || 80.2666;
      const eLat = destination.lat || 26.5015;
      const eLng = destination.lng || 80.2688;

      const info = await getCampusRoute(sLat, sLng, eLat, eLng);
      if (!isCancelled && info) {
        setRouteInfo(info);
      }
    }

    fetchInfo();

    return () => {
      isCancelled = false;
    };
  }, [currentLocation, destination]);

  const distance = routeInfo ? routeInfo.totalDistanceMeters : 350;
  const walkTime = routeInfo ? routeInfo.walkingTimeMins : 4;
  const estimatedSteps = routeInfo ? routeInfo.totalSteps : 460;

  // Turn directions
  const steps = [
    { text: `Walk straight along Central Campus Avenue`, dist: "80m", icon: ArrowUpRight },
    { text: `Turn right towards ${destination?.name || 'Destination'}`, dist: "140m", icon: ArrowRight },
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

  // Trigger speech when entering Live Navigation Mode
  const handleStartLiveNavigation = () => {
    if (setIsNavigatingLive) {
      setIsNavigatingLive(true);
    }
    speakInstruction(`Starting live turn-by-turn navigation to ${destination?.name}. Head straight.`);
  };

  // -------------------------------------------------------------
  // MODE 1: ROUTE PREVIEW BOX (Side Box before user hits Navigate)
  // -------------------------------------------------------------
  if (!isNavigatingLive) {
    return (
      <div 
        className="glass-panel animate-slide-up"
        style={{
          position: 'absolute',
          bottom: '24px',
          left: '24px',
          width: '380px',
          maxWidth: 'calc(100vw - 48px)',
          borderRadius: '24px',
          padding: '22px',
          zIndex: 600,
          border: '1px solid var(--border-glass-light)',
          boxShadow: '0 0 40px rgba(0, 240, 255, 0.3)',
          background: 'rgba(14, 23, 38, 0.95)',
          backdropFilter: 'blur(20px)'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #0284C7 0%, #00F0FF 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(0, 240, 255, 0.4)'
            }}>
              <Navigation size={22} color="#FFF" />
            </div>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#00F0FF', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Route Preview (Road-Snapped OSRM)
              </div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#FFF', marginTop: '2px' }}>
                {currentLocation?.name || 'Current GPS Location'}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>
                ➔ {destination?.name || 'Destination'}
              </div>
            </div>
          </div>

          <button
            onClick={onCancelNavigation}
            className="btn-glass"
            style={{ width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            title="Cancel Route"
          >
            <X size={16} color="var(--text-muted)" />
          </button>
        </div>

        {/* Route Metrics Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '8px',
          marginBottom: '18px'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid var(--border-glass)',
            borderRadius: '14px',
            padding: '10px 8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px' }}>
              <Compass size={12} color="#00F0FF" /> Distance
            </div>
            <div style={{ fontSize: '16px', fontWeight: 800, color: '#FFF', marginTop: '2px' }}>
              {distance} m
            </div>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid var(--border-glass)',
            borderRadius: '14px',
            padding: '10px 8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px' }}>
              <Clock size={12} color="#F59E0B" /> Time
            </div>
            <div style={{ fontSize: '16px', fontWeight: 800, color: '#FFF', marginTop: '2px' }}>
              {walkTime} min
            </div>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid var(--border-glass)',
            borderRadius: '14px',
            padding: '10px 8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px' }}>
              <Footprints size={12} color="#10B981" /> Steps
            </div>
            <div style={{ fontSize: '16px', fontWeight: 800, color: '#FFF', marginTop: '2px' }}>
              {estimatedSteps}
            </div>
          </div>
        </div>

        {/* Start Live Navigation Action Button */}
        <button
          onClick={handleStartLiveNavigation}
          style={{
            width: '100%',
            padding: '16px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
            color: '#FFF',
            border: 'none',
            fontSize: '15px',
            fontWeight: 900,
            cursor: 'pointer',
            boxShadow: '0 0 25px rgba(16, 185, 129, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            letterSpacing: '0.3px'
          }}
        >
          <Navigation size={20} className="animate-pulse" /> START LIVE NAVIGATION
        </button>
      </div>
    );
  }

  // -------------------------------------------------------------
  // MODE 2: LIVE SIDE TRACKER CARD (Replaces Preview in SAME SIDE BOX SIZE)
  // -------------------------------------------------------------
  if (!isExpanded) {
    return (
      <div 
        className="glass-panel animate-scale-up"
        style={{
          position: 'absolute',
          bottom: '24px',
          left: '24px',
          width: '380px',
          maxWidth: 'calc(100vw - 48px)',
          borderRadius: '24px',
          padding: '20px',
          zIndex: 700,
          border: '1px solid rgba(16, 185, 129, 0.4)',
          boxShadow: '0 0 40px rgba(16, 185, 129, 0.4)',
          background: 'rgba(10, 20, 32, 0.96)',
          backdropFilter: 'blur(20px)'
        }}
      >
        {/* Live Tracking Header Badge */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: '#10B981',
              boxShadow: '0 0 12px #10B981'
            }} className="animate-ping" />
            <span style={{ fontSize: '11px', fontWeight: 900, color: '#10B981', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              📍 LIVE GPS AUTO-TRACKING ACTIVE
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              className="btn-glass"
              style={{ width: '30px', height: '30px', padding: 0, justifyContent: 'center', borderRadius: '50%' }}
              title={voiceEnabled ? 'Mute Voice' : 'Unmute Voice'}
            >
              {voiceEnabled ? <Volume2 size={15} color="#10B981" /> : <VolumeX size={15} color="var(--text-muted)" />}
            </button>
            <button
              onClick={() => setIsExpanded(true)}
              className="btn-glass"
              style={{ width: '30px', height: '30px', padding: 0, justifyContent: 'center', borderRadius: '50%' }}
              title="Expand Fullscreen Google Maps View"
            >
              <Maximize2 size={15} color="#00F0FF" />
            </button>
          </div>
        </div>

        {/* Destination Target */}
        <div style={{ fontSize: '16px', fontWeight: 900, color: '#FFF', marginBottom: '12px' }}>
          Navigating to {destination?.name}
        </div>

        {/* Live Metrics Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '8px',
          marginBottom: '14px'
        }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '12px', padding: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '10px', color: '#10B981', fontWeight: 700 }}>REMAINING</div>
            <div style={{ fontSize: '16px', fontWeight: 900, color: '#FFF', marginTop: '2px' }}>{distance}m</div>
          </div>
          <div style={{ background: 'rgba(0, 240, 255, 0.1)', border: '1px solid rgba(0, 240, 255, 0.3)', borderRadius: '12px', padding: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '10px', color: '#00F0FF', fontWeight: 700 }}>ETA WALK</div>
            <div style={{ fontSize: '16px', fontWeight: 900, color: '#FFF', marginTop: '2px' }}>{walkTime} min</div>
          </div>
          <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '12px', padding: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '10px', color: '#F59E0B', fontWeight: 700 }}>STEPS</div>
            <div style={{ fontSize: '16px', fontWeight: 900, color: '#FFF', marginTop: '2px' }}>{estimatedSteps}</div>
          </div>
        </div>

        {/* Next Step Turn Instruction */}
        <div style={{
          background: 'rgba(0, 240, 255, 0.08)',
          border: '1px dashed #00F0FF',
          borderRadius: '14px',
          padding: '10px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '14px'
        }}>
          <StepIcon size={22} color="#00F0FF" />
          <div>
            <div style={{ fontSize: '10px', color: '#00F0FF', fontWeight: 800 }}>NEXT TURN DIRECTION</div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#FFF' }}>{currentStep.text}</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ height: '5px', width: '100%', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden', marginBottom: '14px' }}>
          <div style={{ height: '100%', width: '40%', background: 'linear-gradient(90deg, #10B981, #00F0FF)' }} />
        </div>

        {/* Action Controls */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <button
            onClick={() => setIsExpanded(true)}
            style={{
              padding: '10px',
              borderRadius: '12px',
              background: 'rgba(0, 240, 255, 0.15)',
              border: '1px solid rgba(0, 240, 255, 0.4)',
              color: '#00F0FF',
              fontSize: '12px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Maximize2 size={14} /> Expand View
          </button>

          <button
            onClick={() => {
              if (setIsNavigatingLive) setIsNavigatingLive(false);
              onCancelNavigation();
            }}
            style={{
              padding: '10px',
              borderRadius: '12px',
              background: 'rgba(239, 68, 68, 0.2)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              color: '#EF4444',
              fontSize: '12px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <X size={14} /> Exit Route
          </button>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // MODE 3: FULLSCREEN GOOGLE MAPS LIVE NAVIGATION OVERLAY
  // -------------------------------------------------------------
  return (
    <>
      {/* TOP FLOATING GREEN DIRECTION BANNER */}
      <div 
        className="animate-slide-down"
        style={{
          position: 'absolute',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '560px',
          maxWidth: 'calc(100vw - 40px)',
          zIndex: 850,
          background: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
          color: '#FFF',
          borderRadius: '24px',
          padding: '16px 22px',
          boxShadow: '0 10px 40px rgba(16, 185, 129, 0.6), 0 0 20px rgba(0, 0, 0, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Large Direction Icon */}
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: '16px',
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid rgba(255, 255, 255, 0.3)'
          }}>
            <StepIcon size={32} color="#FFF" />
          </div>

          <div>
            <div style={{ fontSize: '20px', fontWeight: 900, lineHeight: '1.2' }}>
              In {currentStep.dist || '40m'}
            </div>
            <div style={{ fontSize: '14px', fontWeight: 700, opacity: 0.95, marginTop: '2px' }}>
              {currentStep.text}
            </div>
          </div>
        </div>

        {/* Top Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFF',
              cursor: 'pointer'
            }}
            title={voiceEnabled ? 'Mute Voice' : 'Unmute Voice'}
          >
            {voiceEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
          <button
            onClick={() => setIsExpanded(false)}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFF',
              cursor: 'pointer'
            }}
            title="Minimize to Side Card"
          >
            <Minimize2 size={18} />
          </button>
        </div>
      </div>

      {/* BOTTOM FLOATING LIVE ETA & CONTROL BAR */}
      <div 
        className="animate-slide-up"
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '560px',
          maxWidth: 'calc(100vw - 40px)',
          zIndex: 850,
          background: 'rgba(14, 23, 38, 0.96)',
          backdropFilter: 'blur(20px)',
          border: '1px solid var(--border-glass-light)',
          borderRadius: '24px',
          padding: '16px 22px',
          boxShadow: '0 0 50px rgba(0, 0, 0, 0.8)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <div>
            <div style={{ fontSize: '22px', fontWeight: 900, color: '#10B981', display: 'flex', alignItems: 'center', gap: '6px' }}>
              {walkTime} <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>min walk</span>
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 700 }}>
              {distance} meters • {estimatedSteps} steps remaining
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setIsExpanded(false)}
              style={{
                background: 'rgba(0, 240, 255, 0.15)',
                border: '1px solid rgba(0, 240, 255, 0.4)',
                color: '#00F0FF',
                borderRadius: '16px',
                padding: '12px 16px',
                fontSize: '13px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Minimize2 size={16} /> Side Box
            </button>

            <button
              onClick={() => {
                if (setIsNavigatingLive) setIsNavigatingLive(false);
                onCancelNavigation();
              }}
              style={{
                background: 'linear-gradient(135deg, #EF4444 0%, #F43F5E 100%)',
                color: '#FFF',
                border: 'none',
                borderRadius: '16px',
                padding: '12px 20px',
                fontSize: '13px',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 0 20px rgba(239, 68, 68, 0.5)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <X size={16} /> Exit Navigation
            </button>
          </div>
        </div>

        {/* Live Progress Bar */}
        <div style={{ height: '6px', width: '100%', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: '40%',
            background: 'linear-gradient(90deg, #10B981, #00F0FF)',
            borderRadius: '3px'
          }} />
        </div>
      </div>
    </>
  );
}

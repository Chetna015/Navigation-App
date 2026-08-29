import React, { useEffect, useState } from 'react';
import { 
  Navigation, Clock, Footprints, 
  Volume2, VolumeX, X, Compass, MapPin, 
  ArrowUpRight, ArrowRight, Maximize2, Minimize2,
  Bot, RotateCcw, Languages, Gauge, Sparkles
} from 'lucide-react';
import { getCampusRoute } from '../utils/pathfinding';
import { haversineDistanceMeters, estimateWalkingDistanceMeters } from '../utils/haversine';
import { useNavigation } from '../context/NavigationContext';

export default function NavigationBanner({
  currentLocation,
  destination,
  onCancelNavigation,
  accessibilityOptions,
  isNavigatingLive,
  setIsNavigatingLive,
  onOpenAIAssistant
}) {
  const { 
    voiceEnabled, toggleVoice, 
    voiceLang, toggleVoiceLang, 
    voiceRate, cycleVoiceRate, 
    speakInstruction: ctxSpeakInstruction 
  } = useNavigation();
  const [routeInfo, setRouteInfo] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [simulatedMetersLeft, setSimulatedMetersLeft] = useState(null);

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
      const instantDist = Math.max(10, estimateWalkingDistanceMeters(sLat, sLng, eLat, eLng));

      const info = await getCampusRoute(sLat, sLng, eLat, eLng);
      if (!isCancelled && info) {
        setRouteInfo(info);
        setSimulatedMetersLeft(info.totalDistanceMeters || instantDist);
      } else if (!isCancelled) {
        setSimulatedMetersLeft(instantDist);
      }
    }

    fetchInfo();

    return () => {
      isCancelled = false;
    };
  }, [currentLocation, destination]);

  // Simulate progress step countdown when live navigation is active
  useEffect(() => {
    if (!isNavigatingLive) return;

    const timer = setInterval(() => {
      setSimulatedMetersLeft((prev) => {
        if (prev === null || prev <= 10) {
          return 0;
        }
        const nextVal = prev - 15;
        if (nextVal < 200 && currentStepIdx === 0) {
          setCurrentStepIdx(1);
        } else if (nextVal < 50 && currentStepIdx === 1) {
          setCurrentStepIdx(2);
        }
        return nextVal;
      });
    }, 2500);

    return () => clearInterval(timer);
  }, [isNavigatingLive, currentStepIdx]);

  const fallbackBannerDist = (currentLocation && destination && (currentLocation.lat || 26.4970) && (destination.lat || 26.5015))
    ? Math.max(10, estimateWalkingDistanceMeters(currentLocation.lat || 26.4970, currentLocation.lng || 80.2666, destination.lat || 26.5015, destination.lng || 80.2688))
    : 0;

  const totalDistance = routeInfo ? routeInfo.totalDistanceMeters : fallbackBannerDist;
  const distance = simulatedMetersLeft !== null ? simulatedMetersLeft : totalDistance;
  const walkTime = Math.max(1, Math.ceil(distance / 80));
  const estimatedSteps = Math.ceil(distance * 1.3);

  // Turn directions
  const steps = [
    { 
      text: `Walk straight along Central Campus Avenue`, 
      hindiText: `सेंट्रल कैंपस एवेन्यू के रास्ते सीधे आगे बढ़ें`,
      dist: "80m", 
      icon: ArrowUpRight 
    },
    { 
      text: `Turn right towards ${destination?.name || 'Destination'}`, 
      hindiText: `${destination?.name || 'गंतव्य'} की ओर दायें मुड़ें`,
      dist: "140m", 
      icon: ArrowRight 
    },
    { 
      text: `Arriving at ${destination?.name || 'Destination'}`, 
      hindiText: `आप ${destination?.name || 'गंतव्य'} के समीप पहुँच रहे हैं`,
      dist: "20m", 
      icon: MapPin 
    }
  ];

  const currentStep = steps[currentStepIdx] || steps[0];
  const StepIcon = currentStep.icon || Navigation;

  // Speak turn direction helper
  const handleSpeakCurrentStep = () => {
    const enText = `In ${currentStep.dist || '40 meters'}, ${currentStep.text}. ${distance} meters remaining.`;
    const hiText = `${currentStep.dist || '40 मीटर'} में, ${currentStep.hindiText}. कुल दूरी ${distance} मीटर शेष है।`;
    if (ctxSpeakInstruction) {
      ctxSpeakInstruction(enText, hiText);
    }
  };

  // Turn Voice Assistant ON/OFF and recite immediately on enable
  const handleToggleVoiceAssistantWithSpeech = () => {
    const nextVoiceState = !voiceEnabled;
    toggleVoice(nextVoiceState);
    if (nextVoiceState) {
      const enText = `Navigation Voice Assistant active. In ${currentStep.dist || '40 meters'}, ${currentStep.text}. Total distance remaining: ${distance} meters.`;
      const hiText = `नेविगेशन वॉइस असिस्टेंट चालू है। ${currentStep.dist || '40 मीटर'} में, ${currentStep.hindiText}। कुल दूरी ${distance} मीटर शेष है।`;
      if (ctxSpeakInstruction) {
        ctxSpeakInstruction(enText, hiText);
      }
    } else {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    }
  };

  // Start Live Navigation Mode (only speaks if user explicitly turned voice assistant on)
  const handleStartLiveNavigation = () => {
    if (setIsNavigatingLive) {
      setIsNavigatingLive(true);
    }
    if (voiceEnabled && ctxSpeakInstruction) {
      const enText = `Starting live turn-by-turn navigation to ${destination?.name}. Walk straight along Central Campus Avenue.`;
      const hiText = `${destination?.name || 'गंतव्य'} के लिए लाइव नेविगेशन शुरू हो रहा है। सेंट्रल कैंपस एवेन्यू पर सीधे चलें।`;
      ctxSpeakInstruction(enText, hiText);
    }
  };

  // -------------------------------------------------------------
  // MODE 1: ROUTE PREVIEW CARD
  // -------------------------------------------------------------
  if (!isNavigatingLive) {
    return (
      <div 
        className="animate-slide-up"
        style={{
          position: 'absolute',
          bottom: '24px',
          left: '24px',
          width: '380px',
          maxWidth: 'calc(100vw - 48px)',
          borderRadius: '16px',
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
              borderRadius: '10px',
              background: 'var(--colors-surface-dark)',
              color: 'var(--colors-on-dark)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Navigation size={18} />
            </div>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--colors-ink)', fontFamily: 'var(--font-heading)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Route Preview (OSRM Campus Path)
              </div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--colors-ink)', marginTop: '2px', fontFamily: 'var(--font-heading)' }}>
                {currentLocation?.name || 'Current GPS Location'}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--colors-body)', fontFamily: 'var(--font-main)' }}>
                ➔ {destination?.name || 'Destination'}
              </div>
            </div>
          </div>

          <button
            onClick={onCancelNavigation}
            title="Cancel Route"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: '#000000',
              color: '#ffffff',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '15px'
            }}
          >
            ✕
          </button>
        </div>

        {/* Route Metrics Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '8px',
          marginBottom: '16px'
        }}>
          <div style={{
            background: 'var(--colors-surface-soft)',
            border: '1px solid var(--colors-hairline)',
            borderRadius: '12px',
            padding: '10px 8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '10px', color: 'var(--colors-body)', fontFamily: 'var(--font-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px' }}>
              <Compass size={12} color="var(--colors-ink)" /> Distance
            </div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--colors-ink)', fontFamily: 'var(--font-code)', marginTop: '2px' }}>
              {distance} m
            </div>
          </div>

          <div style={{
            background: 'var(--colors-surface-soft)',
            border: '1px solid var(--colors-hairline)',
            borderRadius: '12px',
            padding: '10px 8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '10px', color: 'var(--colors-body)', fontFamily: 'var(--font-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px' }}>
              <Clock size={12} color="var(--colors-ink)" /> Time
            </div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--colors-ink)', fontFamily: 'var(--font-code)', marginTop: '2px' }}>
              {walkTime} min
            </div>
          </div>

          <div style={{
            background: 'var(--colors-surface-soft)',
            border: '1px solid var(--colors-hairline)',
            borderRadius: '12px',
            padding: '10px 8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '10px', color: 'var(--colors-body)', fontFamily: 'var(--font-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px' }}>
              <Footprints size={12} color="var(--colors-ink)" /> Steps
            </div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--colors-ink)', fontFamily: 'var(--font-code)', marginTop: '2px' }}>
              {estimatedSteps}
            </div>
          </div>
        </div>

        {/* AI Voice Assistant Control Box in Route Preview */}
        <div style={{
          background: 'var(--colors-surface-soft)',
          border: '1px solid var(--colors-hairline-strong)',
          borderRadius: '12px',
          padding: '10px 12px',
          marginBottom: '14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Bot size={16} color="#2563EB" />
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--colors-ink)' }}>
                AI Navigation Voice Assistant
              </span>
            </div>
            <button
              onClick={() => toggleVoice()}
              style={{
                background: voiceEnabled ? 'rgba(16, 185, 129, 0.15)' : 'var(--colors-canvas)',
                border: voiceEnabled ? '1px solid #10B981' : '1px solid var(--colors-hairline)',
                color: voiceEnabled ? '#059669' : 'var(--colors-body)',
                borderRadius: '9999px',
                padding: '3px 8px',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
              title={voiceEnabled ? "Mute Navigation Voice" : "Unmute Navigation Voice"}
            >
              {voiceEnabled ? <Volume2 size={12} /> : <VolumeX size={12} />}
              {voiceEnabled ? 'Voice ON' : 'Muted'}
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            {/* Language Switch */}
            <button
              onClick={toggleVoiceLang}
              style={{
                background: 'var(--colors-canvas)',
                border: '1px solid var(--colors-hairline)',
                color: 'var(--colors-ink)',
                borderRadius: '8px',
                padding: '4px 8px',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
              title="Toggle Voice Language (Hindi / English)"
            >
              <Languages size={12} color="#3B82F6" />
              {voiceLang.startsWith('hi') ? '🇮🇳 हिन्दी' : '🇬🇧 English'}
            </button>

            {/* Voice Speed */}
            <button
              onClick={cycleVoiceRate}
              style={{
                background: 'var(--colors-canvas)',
                border: '1px solid var(--colors-hairline)',
                color: 'var(--colors-ink)',
                borderRadius: '8px',
                padding: '4px 8px',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
              title="Cycle Voice Speed"
            >
              <Gauge size={12} color="#8B5CF6" />
              {voiceRate}x Speed
            </button>

            {/* Repeat Direction */}
            <button
              onClick={handleSpeakCurrentStep}
              style={{
                background: 'var(--colors-canvas)',
                border: '1px solid var(--colors-hairline)',
                color: '#2563EB',
                borderRadius: '8px',
                padding: '4px 8px',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
              title="Hear Voice Direction"
            >
              <RotateCcw size={12} />
              Hear Voice
            </button>

            {/* Ask AI Guide */}
            {onOpenAIAssistant && (
              <button
                onClick={onOpenAIAssistant}
                style={{
                  background: 'rgba(59, 130, 246, 0.1)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  color: '#2563EB',
                  borderRadius: '8px',
                  padding: '4px 8px',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  marginLeft: 'auto'
                }}
              >
                <Sparkles size={12} />
                Ask AI
              </button>
            )}
          </div>
        </div>

        {/* Start Live Navigation Action Button */}
        <button
          onClick={handleStartLiveNavigation}
          className="ollama-btn-primary"
          style={{
            width: '100%',
            height: '42px',
            borderRadius: '9999px',
            fontSize: '14px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <Navigation size={18} /> START LIVE NAVIGATION
        </button>
      </div>
    );
  }

  // -------------------------------------------------------------
  // MODE 2: LIVE SIDE TRACKER CARD
  // -------------------------------------------------------------
  if (!isExpanded) {
    const progressPct = Math.max(0, Math.min(100, Math.round(((totalDistance - distance) / totalDistance) * 100)));

    return (
      <div 
        className="animate-scale-up"
        style={{
          position: 'absolute',
          bottom: '24px',
          left: '24px',
          width: '380px',
          maxWidth: 'calc(100vw - 48px)',
          borderRadius: '16px',
          padding: '20px',
          zIndex: 700,
          border: '1px solid var(--colors-hairline-strong)',
          boxShadow: 'var(--shadow-md)',
          background: 'var(--colors-surface-card)'
        }}
      >
        {/* Live Tracking Header Badge */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#10B981'
            }} className="animate-pulse" />
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#10B981', fontFamily: 'var(--font-heading)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              LIVE GPS NAVIGATION ACTIVE
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              onClick={() => toggleVoice()}
              className="ollama-btn-secondary"
              style={{ width: '30px', height: '30px', padding: 0, borderRadius: '50%', color: voiceEnabled ? '#10B981' : 'var(--colors-body)', border: voiceEnabled ? '1px solid #10B981' : '1px solid var(--colors-hairline)' }}
              title={voiceEnabled ? 'Mute Voice' : 'Unmute Voice'}
            >
              {voiceEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
            </button>
            <button
              onClick={() => setIsExpanded(true)}
              className="ollama-btn-secondary"
              style={{ width: '30px', height: '30px', padding: 0, borderRadius: '50%' }}
              title="Expand Fullscreen View"
            >
              <Maximize2 size={14} />
            </button>
          </div>
        </div>

        {/* Destination Target */}
        <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--colors-ink)', fontFamily: 'var(--font-heading)', marginBottom: '12px' }}>
          Navigating to {destination?.name}
        </div>

        {/* Live Metrics Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '8px',
          marginBottom: '14px'
        }}>
          <div style={{ background: 'var(--colors-surface-soft)', border: '1px solid var(--colors-hairline)', borderRadius: '10px', padding: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '10px', color: 'var(--colors-body)', fontWeight: 600 }}>REMAINING</div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--colors-ink)', fontFamily: 'var(--font-code)', marginTop: '2px' }}>{distance}m</div>
          </div>
          <div style={{ background: 'var(--colors-surface-soft)', border: '1px solid var(--colors-hairline)', borderRadius: '10px', padding: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '10px', color: 'var(--colors-body)', fontWeight: 600 }}>ETA WALK</div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--colors-ink)', fontFamily: 'var(--font-code)', marginTop: '2px' }}>{walkTime} min</div>
          </div>
          <div style={{ background: 'var(--colors-surface-soft)', border: '1px solid var(--colors-hairline)', borderRadius: '10px', padding: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '10px', color: 'var(--colors-body)', fontWeight: 600 }}>STEPS</div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--colors-ink)', fontFamily: 'var(--font-code)', marginTop: '2px' }}>{estimatedSteps}</div>
          </div>
        </div>

        {/* Next Step Turn Instruction */}
        <div style={{
          background: 'var(--colors-surface-soft)',
          border: '1px solid var(--colors-hairline-strong)',
          borderRadius: '12px',
          padding: '10px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '12px'
        }}>
          <StepIcon size={20} color="var(--colors-ink)" />
          <div>
            <div style={{ fontSize: '10px', color: 'var(--colors-body)', fontWeight: 700 }}>NEXT MANEUVER</div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--colors-ink)', fontFamily: 'var(--font-main)' }}>{currentStep.text}</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ height: '6px', width: '100%', background: 'var(--colors-hairline)', borderRadius: '9999px', overflow: 'hidden', marginBottom: '14px' }}>
          <div style={{ height: '100%', width: `${progressPct}%`, background: 'var(--colors-primary)', transition: 'width 0.3s ease' }} />
        </div>

        {/* Navigation Voice Assistant Control Option */}
        <div style={{
          background: voiceEnabled ? 'rgba(37, 99, 235, 0.08)' : 'var(--colors-surface-soft)',
          border: voiceEnabled ? '1px solid #3B82F6' : '1px solid var(--colors-hairline-strong)',
          borderRadius: '12px',
          padding: '10px 12px',
          marginBottom: '12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Bot size={16} color={voiceEnabled ? '#2563EB' : 'var(--colors-body)'} />
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--colors-ink)' }}>
                Navigation Voice Assistant
              </span>
            </div>
            <button
              onClick={handleToggleVoiceAssistantWithSpeech}
              style={{
                background: voiceEnabled ? '#10B981' : 'var(--colors-canvas)',
                border: voiceEnabled ? '1px solid #059669' : '1px solid var(--colors-hairline-strong)',
                color: voiceEnabled ? '#FFFFFF' : 'var(--colors-ink)',
                borderRadius: '9999px',
                padding: '4px 12px',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                boxShadow: voiceEnabled ? '0 2px 6px rgba(16, 185, 129, 0.3)' : 'none'
              }}
              title="Click to turn on Voice Assistant and recite path"
            >
              {voiceEnabled ? <Volume2 size={13} /> : <VolumeX size={13} />}
              {voiceEnabled ? 'VOICE ON' : 'TURN VOICE ON'}
            </button>
          </div>

          {voiceEnabled && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', paddingTop: '4px', borderTop: '1px solid var(--colors-hairline)' }}>
              <button
                onClick={handleSpeakCurrentStep}
                style={{
                  background: 'var(--colors-canvas)',
                  border: '1px solid var(--colors-hairline)',
                  color: '#2563EB',
                  borderRadius: '6px',
                  padding: '3px 8px',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
                title="Recite Next Turn Instruction"
              >
                <RotateCcw size={11} />
                Recite Step
              </button>

              <button
                onClick={toggleVoiceLang}
                style={{
                  background: 'var(--colors-canvas)',
                  border: '1px solid var(--colors-hairline)',
                  color: 'var(--colors-ink)',
                  borderRadius: '6px',
                  padding: '3px 8px',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px'
                }}
                title="Toggle Voice Language (Hindi / English)"
              >
                <Languages size={11} color="#3B82F6" />
                {voiceLang.startsWith('hi') ? '🇮🇳 हिन्दी' : '🇬🇧 English'}
              </button>

              <button
                onClick={cycleVoiceRate}
                style={{
                  background: 'var(--colors-canvas)',
                  border: '1px solid var(--colors-hairline)',
                  color: 'var(--colors-ink)',
                  borderRadius: '6px',
                  padding: '3px 8px',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px'
                }}
                title="Voice Speed"
              >
                <Gauge size={11} color="#8B5CF6" />
                {voiceRate}x Speed
              </button>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <button
            onClick={() => setIsExpanded(true)}
            className="ollama-btn-secondary"
            style={{ width: '100%', height: '36px', borderRadius: '9999px', fontSize: '12px' }}
          >
            <Maximize2 size={14} /> Fullscreen
          </button>

          <button
            onClick={() => {
              if (setIsNavigatingLive) setIsNavigatingLive(false);
              onCancelNavigation();
            }}
            className="ollama-btn-secondary"
            style={{ width: '100%', height: '36px', borderRadius: '9999px', fontSize: '12px', color: '#EF4444', borderColor: 'rgba(239, 68, 68, 0.4)' }}
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
  const progressPct = Math.max(0, Math.min(100, Math.round(((totalDistance - distance) / totalDistance) * 100)));

  return (
    <>
      {/* TOP FLOATING DIRECTION BANNER */}
      <div 
        className="animate-slide-down"
        style={{
          position: 'absolute',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '540px',
          maxWidth: 'calc(100vw - 40px)',
          zIndex: 850,
          background: 'var(--colors-surface-dark)',
          color: 'var(--colors-on-dark)',
          borderRadius: '16px',
          padding: '16px 20px',
          boxShadow: 'var(--shadow-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <StepIcon size={24} color="#FFF" />
          </div>

          <div>
            <div style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'var(--font-heading)', lineHeight: '1.2' }}>
              In {currentStep.dist || '40m'}
            </div>
            <div style={{ fontSize: '13px', fontWeight: 500, opacity: 0.9, marginTop: '2px', fontFamily: 'var(--font-main)' }}>
              {currentStep.text}
            </div>
          </div>
        </div>

        {/* Top Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {/* Navigation Voice Assistant Toggle Button in Top Banner */}
          <button
            onClick={handleToggleVoiceAssistantWithSpeech}
            style={{
              background: voiceEnabled ? '#10B981' : 'rgba(255, 255, 255, 0.15)',
              border: 'none',
              borderRadius: '9999px',
              padding: '6px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              color: '#FFF',
              cursor: 'pointer',
              fontSize: '11px',
              fontWeight: 700
            }}
            title={voiceEnabled ? "Voice Assistant ON (Tap to mute)" : "Click to enable Voice Assistant and recite direction"}
          >
            {voiceEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
            <span>{voiceEnabled ? "Voice ON" : "Voice Assistant"}</span>
          </button>
          <button
            onClick={() => setIsExpanded(false)}
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFF',
              cursor: 'pointer'
            }}
            title="Minimize to Side Card"
          >
            <Minimize2 size={16} />
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
          width: '540px',
          maxWidth: 'calc(100vw - 40px)',
          zIndex: 850,
          background: 'var(--colors-surface-card)',
          border: '1px solid var(--colors-hairline-strong)',
          borderRadius: '16px',
          padding: '16px 20px',
          boxShadow: 'var(--shadow-md)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <div>
            <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--colors-ink)', fontFamily: 'var(--font-heading)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              {walkTime} <span style={{ fontSize: '13px', color: 'var(--colors-body)', fontFamily: 'var(--font-main)' }}>min walk</span>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--colors-body)', fontWeight: 600, fontFamily: 'var(--font-main)' }}>
              {distance} meters • {estimatedSteps} steps remaining
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setIsExpanded(false)}
              className="ollama-btn-secondary"
              style={{ borderRadius: '9999px', height: '36px', fontSize: '12px' }}
            >
              <Minimize2 size={14} /> Side Card
            </button>

            <button
              onClick={() => {
                if (setIsNavigatingLive) setIsNavigatingLive(false);
                onCancelNavigation();
              }}
              className="ollama-btn-primary"
              style={{ borderRadius: '9999px', height: '36px', fontSize: '12px', background: '#EF4444' }}
            >
              <X size={14} /> Exit Route
            </button>
          </div>
        </div>

        {/* Live Progress Bar */}
        <div style={{ height: '6px', width: '100%', background: 'var(--colors-hairline)', borderRadius: '9999px', overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${progressPct}%`,
            background: 'var(--colors-primary)',
            borderRadius: '9999px',
            transition: 'width 0.3s ease'
          }} />
        </div>
      </div>
    </>
  );
}

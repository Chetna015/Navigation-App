import { useState, useEffect, useRef, useCallback } from 'react';
import { getCampusRoute } from '../utils/pathfinding';
import { haversineDistanceMeters, estimateWalkingDistanceMeters } from '../utils/haversine';

/**
 * Custom Hook for Live HTML5 Geolocation Tracking, Distance & Step calculation,
 * Voice Assistance & Off-Track Distraction Warnings.
 */
export default function useLiveNavigationVoice({
  currentLocation,
  destination,
  voiceEnabled: propVoiceEnabled,
  setVoiceEnabled: propSetVoiceEnabled,
  voiceLang = 'hi-IN',
  voiceRate = 1.0,
  isNavigatingLive = false
}) {
  const [userPos, setUserPos] = useState(() => {
    try {
      const saved = localStorage.getItem('csjmu_last_gps_location');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.lat && parsed.lng) return parsed;
      }
    } catch (e) {}
    return null;
  });
  const [isOffTrack, setIsOffTrack] = useState(false);
  const [distanceMeters, setDistanceMeters] = useState(0);
  const [stepsCount, setStepsCount] = useState(0);
  const [localVoiceEnabled, setLocalVoiceEnabled] = useState(false);
  const voiceEnabled = propVoiceEnabled !== undefined ? propVoiceEnabled : localVoiceEnabled;
  const setVoiceEnabled = propSetVoiceEnabled || setLocalVoiceEnabled;
  const [gpsPermissionState, setGpsPermissionState] = useState('prompt'); // 'prompt' | 'granted' | 'denied' | 'insecure' | 'unavailable'
  const [gpsErrorMsg, setGpsErrorMsg] = useState(null);

  const lastPosRef = useRef(null);
  const lastTimeRef = useRef(0);
  const lastSpokenRef = useRef(0);

  // Immediately cancel any playing speech synthesis when muted
  useEffect(() => {
    if (!voiceEnabled && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, [voiceEnabled]);

  // Helper to compute Haversine distance in meters
  const calcMeters = (lat1, lon1, lat2, lon2) => {
    const R = 6371000;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  const handlePositionSuccess = useCallback((pos) => {
    const { latitude, longitude, accuracy, heading } = pos.coords;
    const now = Date.now();
    setGpsPermissionState('granted');
    setGpsErrorMsg(null);

    const newPos = { lat: latitude, lng: longitude, accuracy, heading: heading || 45 };

    try {
      localStorage.setItem('csjmu_last_gps_location', JSON.stringify(newPos));
    } catch (e) {}

    if (!lastPosRef.current) {
      lastPosRef.current = newPos;
      lastTimeRef.current = now;
      setUserPos(newPos);
      return;
    }

    const distMeters = calcMeters(
      lastPosRef.current.lat,
      lastPosRef.current.lng,
      latitude,
      longitude
    );

    const timeElapsed = now - lastTimeRef.current;

    // Update if moved >= 2.0 meters OR >= 3000ms elapsed
    if (distMeters >= 2.0 || timeElapsed >= 3000) {
      lastPosRef.current = newPos;
      lastTimeRef.current = now;
      setUserPos(newPos);
    }
  }, []);

  const handlePositionError = useCallback((err) => {
    console.warn("Geolocation watch warning:", err.code, err.message);
    if (err.code === 1) { // PERMISSION_DENIED
      setGpsPermissionState('denied');
      setGpsErrorMsg("Location permission denied. Please allow location access in your phone browser settings.");
    } else if (err.code === 2) { // POSITION_UNAVAILABLE
      setGpsPermissionState('unavailable');
      setGpsErrorMsg("GPS signal unavailable.");
    } else if (err.code === 3) { // TIMEOUT
      setGpsErrorMsg("GPS request timed out.");
    }
  }, []);

  // Explicit user-triggered permission request
  const requestLiveGps = useCallback(() => {
    if (typeof window === 'undefined') return;

    if (!('geolocation' in navigator)) {
      setGpsPermissionState('unavailable');
      setGpsErrorMsg("Geolocation is not supported in this browser.");
      return;
    }

    if (window.isSecureContext === false && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      setGpsPermissionState('insecure');
      setGpsErrorMsg("Insecure connection (HTTP). Please open via HTTPS to enable phone GPS.");
      return;
    }

    navigator.geolocation.getCurrentPosition(handlePositionSuccess, handlePositionError, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000
    });
  }, [handlePositionSuccess, handlePositionError]);

  // 1. Initial watch setup
  useEffect(() => {
    if (typeof window === 'undefined' || !('geolocation' in navigator)) {
      setGpsPermissionState('unavailable');
      return;
    }

    if (window.isSecureContext === false && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      setGpsPermissionState('insecure');
      setGpsErrorMsg("Insecure connection (HTTP). Please open via HTTPS to enable phone GPS.");
      return;
    }

    // Initial fast position fetch (using cached GPS if recent to eliminate cold-start delay)
    navigator.geolocation.getCurrentPosition(handlePositionSuccess, handlePositionError, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000
    });

    // Continuous watch
    const watchId = navigator.geolocation.watchPosition(handlePositionSuccess, handlePositionError, {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 2000
    });

    return () => navigator.geolocation.clearWatch(watchId);
  }, [handlePositionSuccess, handlePositionError]);

  // 2. Calculate Distance & Step Count and announce with exact route distance
  useEffect(() => {
    let isCancelled = false;
    const fromLat = currentLocation?.lat || 26.4970;
    const fromLng = currentLocation?.lng || 80.2666;

    if (destination && destination.lat && destination.lng) {
      // 1. Instant realistic road walking distance estimate (~1.25x road factor) so UI displays accurate estimate immediately without delay
      const instantMeters = Math.max(10, estimateWalkingDistanceMeters(fromLat, fromLng, destination.lat, destination.lng));
      setDistanceMeters(instantMeters);
      setStepsCount(Math.round(instantMeters / 0.75));

      // 2. Fetch road walking route asynchronously to get exact campus path distance
      getCampusRoute(fromLat, fromLng, destination.lat, destination.lng)
        .then((routeInfo) => {
          if (isCancelled) return;
          const exactMeters = (routeInfo && routeInfo.totalDistanceMeters) ? routeInfo.totalDistanceMeters : instantMeters;
          setDistanceMeters(exactMeters);
          setStepsCount(Math.round(exactMeters / 0.75));

          // Speak initial navigation instruction with EXACT route distance ONLY when live navigating and voice enabled
          if (voiceEnabled && isNavigatingLive && typeof window !== 'undefined' && 'speechSynthesis' in window) {
            const now = Date.now();
            if (now - lastSpokenRef.current > 8000) {
              lastSpokenRef.current = now;
              try {
                window.speechSynthesis.cancel();
                const isHindi = voiceLang.startsWith('hi');
                const speechText = isHindi
                  ? `जी, ${destination.name || 'गंतव्य'} की ओर आगे बढ़ें। दूरी लगभग ${exactMeters} मीटर है।`
                  : `Please head towards ${destination.name || 'destination'}. Distance is approximately ${exactMeters} meters.`;

                const msg = new SpeechSynthesisUtterance(speechText);
                msg.lang = isHindi ? 'hi-IN' : 'en-IN';
                msg.pitch = 1.08;
                msg.rate = voiceRate || 1.0;

                const voices = window.speechSynthesis.getVoices();
                if (isHindi) {
                  const hindiFemale = voices.find(v => 
                    (v.lang.includes('hi') || v.lang.includes('HI') || v.name.toLowerCase().includes('hindi')) &&
                    (v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('swara') || v.name.toLowerCase().includes('heera') || v.name.toLowerCase().includes('kalpana') || v.name.toLowerCase().includes('google') || v.name.includes('हिन्दी'))
                  ) || voices.find(v => v.lang.includes('hi') || v.name.toLowerCase().includes('hindi'))
                    || voices.find(v => v.lang.includes('en-IN') && v.name.toLowerCase().includes('female'));
                  if (hindiFemale) msg.voice = hindiFemale;
                } else {
                  const engVoice = voices.find(v => 
                    v.lang.includes('en-IN') || v.name.toLowerCase().includes('india') || v.lang.includes('en_IN')
                  ) || voices.find(v => v.lang.startsWith('en'));
                  if (engVoice) msg.voice = engVoice;
                }

                window.speechSynthesis.speak(msg);
              } catch (e) {
                console.warn("SpeechSynthesis error:", e);
              }
            }
          }
        })
        .catch((err) => {
          if (isCancelled) return;
          console.warn("Route fetch error in useLiveNavigationVoice:", err);
          if (voiceEnabled && isNavigatingLive && typeof window !== 'undefined' && 'speechSynthesis' in window) {
            const now = Date.now();
            if (now - lastSpokenRef.current > 8000) {
              lastSpokenRef.current = now;
              try {
                window.speechSynthesis.cancel();
                const isHindi = voiceLang.startsWith('hi');
                const speechText = isHindi
                  ? `जी, ${destination.name || 'गंतव्य'} की ओर आगे बढ़ें। दूरी लगभग ${instantMeters} मीटर है।`
                  : `Please proceed towards ${destination.name || 'destination'}. Distance is approximately ${instantMeters} meters.`;

                const msg = new SpeechSynthesisUtterance(speechText);
                msg.lang = isHindi ? 'hi-IN' : 'en-IN';
                msg.pitch = 1.08;
                msg.rate = voiceRate || 1.0;

                const voices = window.speechSynthesis.getVoices();
                if (isHindi) {
                  const hindiFemale = voices.find(v => 
                    (v.lang.includes('hi') || v.lang.includes('HI') || v.name.toLowerCase().includes('hindi')) &&
                    (v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('swara') || v.name.toLowerCase().includes('heera') || v.name.toLowerCase().includes('kalpana') || v.name.toLowerCase().includes('google') || v.name.includes('हिन्दी'))
                  ) || voices.find(v => v.lang.includes('hi') || v.name.toLowerCase().includes('hindi'))
                    || voices.find(v => v.lang.includes('en-IN') && v.name.toLowerCase().includes('female'));
                  if (hindiFemale) msg.voice = hindiFemale;
                } else {
                  const engVoice = voices.find(v => 
                    v.lang.includes('en-IN') || v.name.toLowerCase().includes('india') || v.lang.includes('en_IN')
                  ) || voices.find(v => v.lang.startsWith('en'));
                  if (engVoice) msg.voice = engVoice;
                }
                window.speechSynthesis.speak(msg);
              } catch (e) {
                console.warn("SpeechSynthesis error:", e);
              }
            }
          }
        });
    } else {
      setDistanceMeters(0);
      setStepsCount(0);
    }

    return () => {
      isCancelled = true;
    };
  }, [userPos, currentLocation, destination, voiceEnabled, voiceLang, voiceRate, isNavigatingLive]);

  // 3. Off-Track Distraction Detection & Voice Warning
  useEffect(() => {
    if (!userPos || !currentLocation || !destination || !voiceEnabled) return;
    setIsOffTrack(false);
  }, [userPos, currentLocation, destination, voiceEnabled]);

  return {
    userPos,
    distanceMeters,
    stepsCount,
    isOffTrack,
    voiceEnabled,
    setVoiceEnabled,
    gpsPermissionState,
    gpsErrorMsg,
    requestLiveGps
  };
}

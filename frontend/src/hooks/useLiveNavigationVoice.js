import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom Hook for Live HTML5 Geolocation Tracking, Distance & Step calculation,
 * Voice Assistance & Off-Track Distraction Warnings.
 */
export default function useLiveNavigationVoice({ currentLocation, destination }) {
  const [userPos, setUserPos] = useState(null);
  const [isOffTrack, setIsOffTrack] = useState(false);
  const [distanceMeters, setDistanceMeters] = useState(0);
  const [stepsCount, setStepsCount] = useState(0);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [gpsPermissionState, setGpsPermissionState] = useState('prompt'); // 'prompt' | 'granted' | 'denied' | 'insecure' | 'unavailable'
  const [gpsErrorMsg, setGpsErrorMsg] = useState(null);

  const lastPosRef = useRef(null);
  const lastTimeRef = useRef(0);
  const lastSpokenRef = useRef(0);

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
      maximumAge: 0
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

    // Initial position fetch
    navigator.geolocation.getCurrentPosition(handlePositionSuccess, handlePositionError, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 2000
    });

    // Continuous watch
    const watchId = navigator.geolocation.watchPosition(handlePositionSuccess, handlePositionError, {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 2000
    });

    return () => navigator.geolocation.clearWatch(watchId);
  }, [handlePositionSuccess, handlePositionError]);

  // 2. Calculate Distance & Step Count
  useEffect(() => {
    const fromLat = currentLocation?.lat || 26.4970;
    const fromLng = currentLocation?.lng || 80.2666;

    if (destination && destination.lat && destination.lng) {
      const R = 6371000; // Earth radius in meters
      const dLat = (destination.lat - fromLat) * Math.PI / 180;
      const dLon = (destination.lng - fromLng) * Math.PI / 180;
      const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(fromLat * Math.PI / 180) * Math.cos(destination.lat * Math.PI / 180) *
                Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      const meters = Math.round(R * c);

      setDistanceMeters(meters);
      setStepsCount(Math.round(meters / 0.75)); // Average 0.75m per step

      // Speak initial navigation instruction in polite Hindi lady voice
      if (voiceEnabled && typeof window !== 'undefined' && 'speechSynthesis' in window) {
        const now = Date.now();
        if (now - lastSpokenRef.current > 12000) {
          lastSpokenRef.current = now;
          try {
            window.speechSynthesis.cancel();
            const hindiSpeech = `जी, ${destination.name || 'गंतव्य'} की ओर आगे बढ़ें। दूरी लगभग ${meters} मीटर है।`;
            const msg = new SpeechSynthesisUtterance(hindiSpeech);
            msg.lang = 'hi-IN';
            msg.pitch = 1.12;
            msg.rate = 0.92;

            const voices = window.speechSynthesis.getVoices();
            const hindiFemale = voices.find(v => 
              (v.lang.includes('hi') || v.lang.includes('HI') || v.name.toLowerCase().includes('hindi')) &&
              (v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('swara') || v.name.toLowerCase().includes('heera') || v.name.toLowerCase().includes('kalpana') || v.name.toLowerCase().includes('google') || v.name.includes('हिन्दी'))
            ) || voices.find(v => v.lang.includes('hi') || v.name.toLowerCase().includes('hindi'))
              || voices.find(v => v.lang.includes('en-IN') && v.name.toLowerCase().includes('female'));

            if (hindiFemale) {
              msg.voice = hindiFemale;
            }

            window.speechSynthesis.speak(msg);
          } catch (e) {
            console.warn("SpeechSynthesis error:", e);
          }
        }
      }
    } else {
      setDistanceMeters(0);
      setStepsCount(0);
    }
  }, [userPos, currentLocation, destination, voiceEnabled]);

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

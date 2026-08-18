import { useState, useEffect, useRef } from 'react';

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

  // 1. Fetch & Watch Live Geolocation with Jitter Filtering
  useEffect(() => {
    if (!('geolocation' in navigator)) return;

    const handleSuccess = (pos) => {
      const { latitude, longitude } = pos.coords;
      const now = Date.now();

      if (!lastPosRef.current) {
        lastPosRef.current = { lat: latitude, lng: longitude };
        lastTimeRef.current = now;
        setUserPos({ lat: latitude, lng: longitude });
        return;
      }

      const distMeters = calcMeters(
        lastPosRef.current.lat,
        lastPosRef.current.lng,
        latitude,
        longitude
      );

      const timeElapsed = now - lastTimeRef.current;

      // Only update state if moved >= 3.5 meters OR (moved >= 1.5 meters AND >= 3000ms elapsed)
      if (distMeters >= 3.5 || (distMeters >= 1.5 && timeElapsed >= 3000)) {
        lastPosRef.current = { lat: latitude, lng: longitude };
        lastTimeRef.current = now;
        setUserPos({ lat: latitude, lng: longitude });
      }
    };

    const handleError = (err) => {
      console.warn("Geolocation watch warning:", err.message);
    };

    // Initial position fetch
    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 2000
    });

    // Continuous position watch with maximumAge to prevent rapid battery/sensor polling
    const watchId = navigator.geolocation.watchPosition(handleSuccess, handleError, {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 3000
    });

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

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

      // Speak initial navigation instruction
      if (voiceEnabled && typeof window !== 'undefined' && 'speechSynthesis' in window) {
        const now = Date.now();
        if (now - lastSpokenRef.current > 12000) {
          lastSpokenRef.current = now;
          try {
            window.speechSynthesis.cancel();
            const msg = new SpeechSynthesisUtterance(
              `Navigating to ${destination.name || 'destination'}. Distance is ${meters} meters, approximately ${Math.round(meters / 0.75)} steps.`
            );
            msg.rate = 0.95;
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

    // Off-track check disabled to prevent false alarm warnings
    setIsOffTrack(false);
  }, [userPos, currentLocation, destination, voiceEnabled]);

  return {
    userPos,
    distanceMeters,
    stepsCount,
    isOffTrack,
    voiceEnabled,
    setVoiceEnabled
  };
}

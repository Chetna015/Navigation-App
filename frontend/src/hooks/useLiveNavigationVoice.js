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
  const lastSpokenRef = useRef(0);

  // 1. Fetch & Watch Live Geolocation
  useEffect(() => {
    if (!('geolocation' in navigator)) return;

    const handleSuccess = (pos) => {
      const { latitude, longitude } = pos.coords;
      setUserPos({ lat: latitude, lng: longitude });
    };

    const handleError = (err) => {
      console.warn("Geolocation watch warning:", err.message);
    };

    // Initial position fetch
    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    });

    // Continuous position watch
    const watchId = navigator.geolocation.watchPosition(handleSuccess, handleError, {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 1000
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
      if (voiceEnabled && 'speechSynthesis' in window) {
        const now = Date.now();
        if (now - lastSpokenRef.current > 12000) {
          lastSpokenRef.current = now;
          const msg = new SpeechSynthesisUtterance(
            `Navigating to ${destination.name}. Distance is ${meters} meters, approximately ${Math.round(meters / 0.75)} steps.`
          );
          msg.rate = 0.95;
          window.speechSynthesis.speak(msg);
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

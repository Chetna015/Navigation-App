import React, { createContext, useContext, useState, useEffect } from 'react';

const NavigationContext = createContext();

const defaultLiveLocation = {
  id: 'live_user_location',
  name: 'You Are Here 📍',
  lat: 26.4970,
  lng: 80.2666,
  category: 'Live GPS',
  isLiveUser: true
};

const getInitialLocation = () => {
  try {
    const saved = localStorage.getItem('csjmu_last_gps_location');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.lat && parsed.lng) {
        return {
          id: 'live_user_location',
          name: 'My Live GPS Location 📍',
          lat: parsed.lat,
          lng: parsed.lng,
          heading: parsed.heading || 45,
          isLiveUser: true
        };
      }
    }
  } catch (e) {}
  return defaultLiveLocation;
};

export function NavigationProvider({ children }) {
  const [currentLocation, setCurrentLocation] = useState(getInitialLocation);
  const [destination, setDestination] = useState(null);
  const [shortestRoute, setShortestRoute] = useState(null);
  const [navMode, setNavMode] = useState('hidden'); // 'hidden' | 'preview' | 'active'
  const [isNavigatingLive, setIsNavigatingLive] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [activeFloor, setActiveFloor] = useState('G');

  const toggleVoice = (overrideVal) => {
    setVoiceEnabled(prev => {
      const nextVal = typeof overrideVal === 'boolean' ? overrideVal : !prev;
      if (!nextVal && typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      return nextVal;
    });
  };

  useEffect(() => {
    if (!voiceEnabled && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, [voiceEnabled]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === 'true') {
      setIsAdminMode(true);
    }
  }, []);

  return (
    <NavigationContext.Provider value={{
      currentLocation, setCurrentLocation,
      destination, setDestination,
      shortestRoute, setShortestRoute,
      navMode, setNavMode,
      isNavigatingLive, setIsNavigatingLive,
      isAdminMode, setIsAdminMode,
      voiceEnabled, setVoiceEnabled, toggleVoice,
      activeFloor, setActiveFloor,
      defaultLiveLocation
    }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}

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

export function NavigationProvider({ children }) {
  const [currentLocation, setCurrentLocation] = useState(defaultLiveLocation);
  const [destination, setDestination] = useState(null);
  const [shortestRoute, setShortestRoute] = useState(null);
  const [navMode, setNavMode] = useState('hidden'); // 'hidden' | 'preview' | 'active'
  const [isNavigatingLive, setIsNavigatingLive] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [activeFloor, setActiveFloor] = useState('G');

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
      voiceEnabled, setVoiceEnabled,
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

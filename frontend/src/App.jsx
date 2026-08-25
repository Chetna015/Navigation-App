import React, { useState, useEffect } from 'react';
import SplashScreen from './components/SplashScreen';
import HeaderNavbar from './components/HeaderNavbar';
import SearchBarAndActions from './components/SearchBarAndActions';
import DigitalTwinMap from './components/DigitalTwinMap';
import NavigationBanner from './components/NavigationBanner';
import NavigationSidebar from './components/NavigationSidebar';
import AIAssistantModal from './components/AIAssistantModal';
import StartupExhibitionModal from './components/StartupExhibitionModal';
import EventSessionsModal from './components/EventSessionsModal';
import AccessibilityModal from './components/AccessibilityModal';
import StallDetailDrawer from './components/StallDetailDrawer';
import EditLocationModal from './components/EditLocationModal';
import ManagePinsModal from './components/ManagePinsModal';
import Building3DViewerModal from './components/Building3DViewerModal';
import CampusStreetViewModal from './components/CampusStreetViewModal';
import Admin360DashboardModal from './components/Admin360DashboardModal';
import CampusShuttleModal from './components/CampusShuttleModal';
import CampusLifeStatusModal from './components/CampusLifeStatusModal';
import ParkingFinderModal from './components/ParkingFinderModal';
import SBMBuildingIndoorModal from './components/SBMBuildingIndoorModal';
import useLiveNavigationVoice from './hooks/useLiveNavigationVoice';
import { MAP_LOCATIONS, STARTUP_STALLS } from './data/auditoriumData';
import { useNavigation } from './context/NavigationContext';

export default function App() {
  const {
    currentLocation, setCurrentLocation,
    destination, setDestination,
    shortestRoute, setShortestRoute,
    navMode, setNavMode,
    isNavigatingLive, setIsNavigatingLive,
    isAdminMode,
    activeFloor, setActiveFloor,
    defaultLiveLocation
  } = useNavigation();

  const [showSplash, setShowSplash] = useState(false);
  const [building3D, setBuilding3D] = useState(null);

  // Sync navMode when destination is selected or cleared
  useEffect(() => {
    if (destination) {
      if (navMode === 'hidden') setNavMode('preview');
    } else {
      setNavMode('hidden');
    }
  }, [destination]);

  // Live Geolocation Tracking & Voice Assistance
  const {
    userPos,
    distanceMeters,
    stepsCount,
    isOffTrack,
    voiceEnabled,
    setVoiceEnabled,
    gpsPermissionState,
    gpsErrorMsg,
    requestLiveGps
  } = useLiveNavigationVoice({ currentLocation, destination });

  // Automatically update currentLocation with exact real-time phone GPS position when received
  useEffect(() => {
    if (userPos && userPos.lat && userPos.lng) {
      setCurrentLocation(prev => ({
        ...prev,
        id: 'live_user_location',
        name: 'My Live GPS Location 📍',
        lat: userPos.lat,
        lng: userPos.lng,
        heading: userPos.heading || 45,
        isLiveUser: true
      }));
    }
  }, [userPos, setCurrentLocation]);

  const [searchQuery, setSearchQuery] = useState('');
  const [highlightDomain, setHighlightDomain] = useState(null);

  // Modals visibility
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [showStallsModal, setShowStallsModal] = useState(false);
  const [showSessionsModal, setShowSessionsModal] = useState(false);
  const [showAccessibilityModal, setShowAccessibilityModal] = useState(false);
  const [showEditLocationModal, setShowEditLocationModal] = useState(false);
  const [showManagePinsModal, setShowManagePinsModal] = useState(false);
  const [showStreetViewModal, setShowStreetViewModal] = useState(false);
  const [showAdmin360Modal, setShowAdmin360Modal] = useState(false);
  const [showShuttleModal, setShowShuttleModal] = useState(false);
  const [showCampusLifeModal, setShowCampusLifeModal] = useState(false);
  const [showParkingModal, setShowParkingModal] = useState(false);
  const [showSBMIndoorModal, setShowSBMIndoorModal] = useState(false);
  const [indoorBuildingId, setIndoorBuildingId] = useState('sbm'); // 'sbm' | 'auditorium'
  const [editingLocation, setEditingLocation] = useState(null);
  const [selectedStall, setSelectedStall] = useState(null);
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'campus-map'

  // Dynamic Indoor Mode Switcher
  const handleOpenIndoorModal = (buildingId = 'sbm') => {
    setIndoorBuildingId(buildingId);
    setShowSBMIndoorModal(true);
  };

  // Explore Building Mode Trigger (Switch to Indoor Mode after arrival)
  const handleExploreBuilding = (bld) => {
    const name = (bld.name || '').toLowerCase();
    let buildingId = 'sbm';
    if (name.includes('auditorium')) {
      buildingId = 'auditorium';
    }
    setDestination(null);
    setIsNavigatingLive(false);
    setNavMode('hidden');
    handleOpenIndoorModal(buildingId);
  };

  // Automatic Arrival Detection Zone
  useEffect(() => {
    if (navMode === 'active' && destination && distanceMeters > 0) {
      const radius = destination.arrivalRadius || 25;
      if (distanceMeters <= radius) {
        setNavMode('arrived');
        setIsNavigatingLive(false);

        // Voice synthesizer alert on arrival
        if (voiceEnabled && typeof window !== 'undefined' && 'speechSynthesis' in window) {
          try {
            window.speechSynthesis.cancel();
            const speechText = `आप ${destination.originalBuilding?.name || destination.name} पर पहुँच गए हैं।`;
            const msg = new SpeechSynthesisUtterance(speechText);
            msg.lang = 'hi-IN';
            window.speechSynthesis.speak(msg);
          } catch (e) {
            console.warn("SpeechSynthesis error:", e);
          }
        }
      }
    }
  }, [distanceMeters, navMode, destination, setNavMode, setIsNavigatingLive, voiceEnabled]);

  const handleOpenEditLocation = (loc = null) => {
    setEditingLocation(loc);
    setShowEditLocationModal(true);
  };

  // App settings & preferences
  const [theme, setTheme] = useState('light');
  const [bookmarks, setBookmarks] = useState(['S01', 'S08']);
  const [accessibilityOptions, setAccessibilityOptions] = useState({
    wheelchairRoute: false,
    highContrast: false,
    largeFont: false
  });
  const [isListening, setIsListening] = useState(false);
  const [sosBanner, setSosBanner] = useState(false);

  // Update body attributes when theme/accessibility changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-high-contrast', accessibilityOptions.highContrast);
    document.documentElement.setAttribute('data-large-font', accessibilityOptions.largeFont);
  }, [theme, accessibilityOptions]);

  // Voice Search Handler
  const startVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Browser speech recognition not available. Please type your destination in search.");
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';

    setIsListening(true);
    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setIsListening(false);
      setSearchQuery(transcript);
      setShowAIAssistant(true);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
  };

  // Home Tab Dashboard layout matching design specifications
  const renderHomeTab = () => {
    return (
      <div className="flex flex-col w-full gap-md p-md max-w-lg mx-auto bg-slate-50 min-h-screen">
        {/* Welcome Hero Banner */}
        <div className="relative w-full rounded-[20px] overflow-hidden bg-[#002068] shadow-lg shadow-blue-900/20">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-overlay"
            style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCDgU3xav45vHFCI1cY2Yn8RgpAUptL5Dg85l1LQ6A_EaZtIWn56zd8yjweGUujXRJn8zy1RIV-EvemwzSNd9DvTkQMkBYOCX5PDg3YYB7Ki57TeyNtyrfXGHjIYAvwGKqqDVX6TES00s5jiSRUXaG-81b6rDKJEUoUU5gcaSRabHx-VahRoFZHDRGFHDbix4wjPU_0G_0i00iUjBcw27Pj2NwvXIFGK7r1ROF-wmCiIUHUqixUkfTb')" }}
          ></div>
          <div className="relative z-10 p-6 flex flex-col gap-6">
            <div className="flex flex-col gap-1 text-white">
              <span className="text-[10px] text-blue-200 tracking-widest uppercase font-bold">Welcome to</span>
              <h1 className="text-2xl font-bold font-heading">AI Summit 2026</h1>
              <p className="text-xs text-blue-200 opacity-90">CSJMU Smart Campus Navigation</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 flex flex-col gap-3">
              <h3 className="text-white text-center font-bold text-sm">Where would you like to go?</h3>
              <div className="flex gap-2 w-full">
                <button 
                  onClick={() => {
                    setActiveTab('campus-map');
                  }}
                  className="flex-1 bg-white text-blue-900 rounded-full py-2.5 px-4 flex items-center justify-center gap-1.5 shadow-md hover:bg-slate-100 transition-colors active:scale-95 group"
                >
                  <span className="material-symbols-outlined text-[18px] text-blue-900 group-hover:scale-110 transition-transform">search</span>
                  <span className="text-xs font-bold">Search</span>
                </button>
                <button 
                  onClick={() => setShowAIAssistant(true)}
                  className="flex-[1.5] bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full py-2.5 px-4 flex items-center justify-center gap-1.5 shadow-lg shadow-blue-500/30 hover:opacity-90 transition-all active:scale-95 group relative overflow-hidden"
                >
                  <span className="material-symbols-outlined text-[18px] text-white animate-pulse">mic</span>
                  <span className="text-xs font-bold relative z-10">Ask AI Navigator</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Popular Destinations Grid */}
        <div className="flex flex-col gap-2 mt-4">
          <div className="flex justify-between items-end px-1 mb-1">
            <h2 className="text-base font-bold text-slate-800">Popular Destinations</h2>
            <button 
              onClick={() => setActiveTab('campus-map')}
              className="text-xs font-bold text-blue-600 flex items-center gap-0.5 hover:underline"
            >
              View map <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => {
                const aud = MAP_LOCATIONS.find(l => l.name.toLowerCase().includes('auditorium'));
                if (aud) handleSelectLocation(aud);
              }}
              className="bg-white border border-slate-200 p-4 rounded-2xl flex flex-col items-center gap-2 shadow-sm hover:bg-slate-50 transition-colors active:scale-95"
            >
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                <span className="material-symbols-outlined text-blue-700 text-[24px]">theater_comedy</span>
              </div>
              <span className="text-xs font-semibold text-slate-700 text-center">Auditorium</span>
            </button>

            <button 
              onClick={() => {
                const senate = MAP_LOCATIONS.find(l => l.name.toLowerCase().includes('senate'));
                if (senate) handleSelectLocation(senate);
              }}
              className="bg-white border border-slate-200 p-4 rounded-2xl flex flex-col items-center gap-2 shadow-sm hover:bg-slate-50 transition-colors active:scale-95"
            >
              <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center">
                <span className="material-symbols-outlined text-indigo-700 text-[24px]">account_balance</span>
              </div>
              <span className="text-xs font-semibold text-slate-700 text-center">Senate Hall</span>
            </button>

            <button 
              onClick={() => {
                setShowStallsModal(true);
              }}
              className="bg-white border border-slate-200 p-4 rounded-2xl flex flex-col items-center gap-2 shadow-sm hover:bg-slate-50 transition-colors active:scale-95"
            >
              <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center">
                <span className="material-symbols-outlined text-purple-700 text-[24px]">rocket_launch</span>
              </div>
              <span className="text-xs font-semibold text-slate-700 text-center leading-tight">Startup Exhibition</span>
            </button>

            <button 
              onClick={() => {
                const guest = MAP_LOCATIONS.find(l => l.name.toLowerCase().includes('guest house') || l.name.toLowerCase().includes('hostel'));
                if (guest) handleSelectLocation(guest);
              }}
              className="bg-white border border-slate-200 p-4 rounded-2xl flex flex-col items-center gap-2 shadow-sm hover:bg-slate-50 transition-colors active:scale-95"
            >
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                <span className="material-symbols-outlined text-slate-700 text-[24px]">bed</span>
              </div>
              <span className="text-xs font-semibold text-slate-700 text-center">Guest House</span>
            </button>
          </div>
        </div>

        {/* Just for You Session Card */}
        <div className="flex flex-col gap-2 mt-4 mb-24">
          <div className="flex items-center gap-1.5 px-1">
            <span className="material-symbols-outlined text-indigo-600 text-[20px]">auto_awesome</span>
            <h2 className="text-base font-bold text-slate-800">Just for You</h2>
          </div>
          
          <div className="bg-white border border-slate-200 rounded-2xl p-4 flex gap-4 items-center relative overflow-hidden shadow-sm">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600"></div>
            <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
              <div 
                className="w-full h-full bg-cover bg-center" 
                style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuATtafYVfW13-uzg0-dGJ5QDSnBqCvqi3bSfOWlfDQmR1Q9y-yXiNAl4oNjkdv3dd-VPJkhN-peFy4XkVWU8UYhnXFGW7C4XbutbVgfWVyX4VKDmHgCemouaHK9qvAdd_yAy-KM28FzRPTqQmbB4OKq-WdKMkCF0XunlSoFGu1O4O5_5ndF49WDJGFzCXY54ihLn6U8xhfnYLRTux0RkiWC642y11ctritEp1gYEOvXYHplFPgYfj2T')" }}
              ></div>
            </div>
            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-[10px] text-indigo-600 uppercase font-bold">Next Session • 11:30 AM</span>
              <h4 className="text-sm font-bold text-slate-800 truncate">AI in Higher Education</h4>
              <p className="text-[11px] text-slate-500 flex items-center gap-0.5 mt-1 font-medium">
                <span className="material-symbols-outlined text-[13px]">location_on</span> Senate Hall
              </p>
            </div>
            <button 
              onClick={() => {
                const senate = MAP_LOCATIONS.find(l => l.name.toLowerCase().includes('senate'));
                if (senate) handleSelectLocation(senate);
              }}
              className="w-10 h-10 rounded-full bg-slate-100 hover:bg-indigo-600 hover:text-white shrink-0 flex items-center justify-center shadow-sm text-slate-700 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">directions</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Set Location as Navigation Destination
  const handleSelectLocation = (loc) => {
    let targetLoc = { ...loc };
    if (loc.entrances && loc.entrances.length > 0) {
      let selectedEntrance = loc.entrances[0];
      if (currentLocation && currentLocation.lat && currentLocation.lng) {
        let minDistance = Infinity;
        loc.entrances.forEach(ent => {
          const dist = Math.pow(ent.lat - currentLocation.lat, 2) + Math.pow(ent.lng - currentLocation.lng, 2);
          if (dist < minDistance) {
            minDistance = dist;
            selectedEntrance = ent;
          }
        });
      }
      targetLoc = {
        ...loc,
        lat: selectedEntrance.lat,
        lng: selectedEntrance.lng,
        name: `${loc.name} - ${selectedEntrance.name} 🚪`,
        originalBuilding: loc,
        selectedEntrance: selectedEntrance
      };
    }
    setDestination(targetLoc);
    setIsNavigatingLive(false); // Show Route Preview Box first
    setActiveTab('campus-map');
    if (loc.floor && loc.floor !== activeFloor) {
      setActiveFloor(loc.floor);
    }
  };

  // Set Startup Stall as Navigation Destination
  const handleSelectStallDestination = (stall) => {
    setSelectedStall(stall);
    const destObj = {
      id: stall.id,
      name: `Stall ${stall.id}: ${stall.name}`,
      floor: 'indoor',
      x: stall.x,
      y: stall.y,
      description: stall.description
    };
    setDestination(destObj);
    setIsNavigatingLive(false);
    setActiveFloor('indoor');
    setActiveTab('campus-map');
  };

  // Bookmark toggle
  const handleToggleBookmark = (id) => {
    setBookmarks(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Trigger Emergency SOS
  const handleTriggerSOS = () => {
    const medLoc = MAP_LOCATIONS.find(l => l.id === 'loc_medical_booth');
    if (medLoc) {
      handleSelectLocation(medLoc);
    }
    setSosBanner(true);
  };

  return (
    <div className="app-viewport">
      {/* 1. Splash Screen Intro */}
      {showSplash && (
        <SplashScreen onFinish={() => setShowSplash(false)} />
      )}

      {/* 2. Emergency SOS Alert Banner */}
      {sosBanner && (
        <div style={{
          background: 'linear-gradient(90deg, #EF4444 0%, #F43F5E 100%)',
          color: '#FFF',
          padding: '10px 24px',
          fontWeight: 800,
          fontSize: '13px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 999
        }}>
          <div>
            🚑 EMERGENCY SOS ACTIVATED: Dispatching On-site Medical First-Aid Team to your location. Directing you to Emergency Medical Booth.
          </div>
          <button
            onClick={() => setSosBanner(false)}
            style={{ background: 'rgba(0,0,0,0.2)', border: 'none', color: '#FFF', padding: '4px 10px', borderRadius: '6px', cursor: 'pointer' }}
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 3. Header Navigation Bar */}
      <HeaderNavbar
        currentLocation={currentLocation}
        setCurrentLocation={setCurrentLocation}
        activeFloor={activeFloor}
        setActiveFloor={setActiveFloor}
        theme={theme}
        setTheme={setTheme}
        onOpenAccessibility={() => setShowAccessibilityModal(true)}
        onOpenEmergency={handleTriggerSOS}
        onOpenEditLocation={isAdminMode ? () => handleOpenEditLocation(null) : null}
        onOpenManagePins={isAdminMode ? () => setShowManagePinsModal(true) : null}
        onOpenAdmin360={isAdminMode ? () => setShowAdmin360Modal(true) : null}
        onOpenSBMIndoor={() => setShowSBMIndoorModal(true)}
      />

      {/* 5. Main Content Area: Interactive Vector Digital Twin Map (65%+ Viewport) */}
      <main className="main-content" style={{ paddingBottom: '70px', position: 'relative' }}>
        {activeTab === 'home' && renderHomeTab()}

        {activeTab === 'campus-map' && (
          <>
            {/* Mobile GPS & HTTPS Notice Banner */}
            {gpsPermissionState === 'insecure' && (
              <div style={{
                background: 'linear-gradient(90deg, #1E293B, #0F172A)',
                color: '#F8FAFC',
                borderBottom: '1px solid #334155',
                padding: '8px 16px',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '8px',
                zIndex: 450
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>🔒</span>
                  <span><strong>मोबाइल GPS सूचना:</strong> मोबाइल पर सटीक GPS और वॉयस के लिए कृपया HTTPS लिंक खोलें:</span>
                </div>
                <a
                  href={`https://${typeof window !== 'undefined' ? window.location.hostname : 'localhost'}:5173`}
                  style={{
                    background: '#10B981',
                    color: '#FFF',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontWeight: 700,
                    textDecoration: 'none',
                    fontSize: '11px',
                    whiteSpace: 'nowrap'
                  }}
                >
                  HTTPS पर खोलें 🚀
                </a>
              </div>
            )}

            {gpsPermissionState === 'prompt' && !userPos && (
              <div style={{
                background: 'rgba(16, 185, 129, 0.12)',
                borderBottom: '1px solid rgba(16, 185, 129, 0.3)',
                color: '#065F46',
                padding: '6px 16px',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                zIndex: 450
              }}>
                <span>📍 अपने फ़ोन की लाइव GPS लोकेशन चालू करें</span>
                <button
                  onClick={requestLiveGps}
                  style={{
                    background: '#10B981',
                    color: '#FFF',
                    border: 'none',
                    padding: '3px 10px',
                    borderRadius: '9999px',
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  GPS अनुमति दें 📍
                </button>
              </div>
            )}

            {/* 4. Search Bar & Smart Quick Action Cards (Automatically hidden once both locations/destination are entered) */}
            {!destination && navMode !== 'active' && (
              <SearchBarAndActions
                isAdminMode={isAdminMode}
                currentLocation={currentLocation}
                destination={destination}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onSelectLocation={handleSelectLocation}
                onOpenStalls={() => setShowStallsModal(true)}
                onOpenSessions={() => setShowSessionsModal(true)}
                onOpenAIAssistant={() => setShowAIAssistant(true)}
                onOpenShuttle={() => setShowShuttleModal(true)}
                onOpenCampusLife={() => setShowCampusLifeModal(true)}
                onOpenParking={() => setShowParkingModal(true)}
                onOpenSBMIndoor={() => setShowSBMIndoorModal(true)}
                isListening={isListening}
                startVoiceSearch={startVoiceSearch}
                onOpenManagePins={isAdminMode ? () => setShowManagePinsModal(true) : null}
                distanceMeters={distanceMeters}
                stepsCount={stepsCount}
                isOffTrack={isOffTrack}
                voiceEnabled={voiceEnabled}
                setVoiceEnabled={setVoiceEnabled}
              />
            )}
          </>
        )}

        {/* The Map itself is kept rendered (offscreen if not in Map tab) to preserve Leaflet lifecycle */}
        <div style={{
          position: activeTab === 'campus-map' ? 'relative' : 'absolute',
          top: 0,
          bottom: 0,
          left: activeTab === 'campus-map' ? 0 : '-99999px',
          width: '100%',
          height: activeTab === 'campus-map' ? 'calc(100vh - 12rem)' : 0,
          visibility: activeTab === 'campus-map' ? 'visible' : 'hidden',
          zIndex: 10
        }}>
          <DigitalTwinMap
            isAdminMode={isAdminMode}
            currentLocation={currentLocation}
            setCurrentLocation={setCurrentLocation}
            destination={destination}
            setDestination={setDestination}
            activeFloor={activeFloor}
            setActiveFloor={setActiveFloor}
            selectedStall={selectedStall}
            setSelectedStall={setSelectedStall}
            highlightDomain={highlightDomain}
            accessibilityOptions={accessibilityOptions}
            onOpenEditLocation={handleOpenEditLocation}
            onOpen3DView={(bld) => setBuilding3D(bld)}
            onOpenSBMIndoor={() => setShowSBMIndoorModal(true)}
            navMode={navMode}
            isNavigatingLive={isNavigatingLive}
          />
        </div>

        {activeTab === 'campus-map' && (
          <>
            {/* Floating AI Assistant Trigger Button (Bottom Right) */}
            <button
              onClick={() => setShowAIAssistant(!showAIAssistant)}
              className="ollama-btn-primary"
              style={{
                position: 'absolute',
                bottom: '24px',
                right: '80px',
                zIndex: 500,
                height: '38px',
                padding: '8px 18px',
                whiteSpace: 'nowrap',
                boxShadow: 'var(--shadow-md)',
                cursor: 'pointer'
              }}
              title="Open AI Event Assistant"
            >
              🤖 <span style={{ fontFamily: 'var(--font-heading)', fontSize: '13px', fontWeight: 600 }}>AI Assistant</span>
            </button>

            {/* Modular Sidebar Navigation Component (Preview -> Active Live Tracking) */}
            {destination && (
              <NavigationSidebar
                currentLocation={currentLocation}
                destination={destination}
                onCancelNavigation={() => {
                  setDestination(null);
                  setIsNavigatingLive(false);
                  setNavMode('hidden');
                }}
                accessibilityOptions={accessibilityOptions}
                navMode={navMode}
                setNavMode={(mode) => {
                  setNavMode(mode);
                  if (mode === 'active') setIsNavigatingLive(true);
                  else if (mode === 'hidden') setIsNavigatingLive(false);
                }}
                onOpenStreetView={() => setShowStreetViewModal(true)}
                onExploreBuilding={handleExploreBuilding}
              />
            )}

            {/* Selected Stall Detail Drawer */}
            {selectedStall && !destination && (
              <StallDetailDrawer
                stall={selectedStall}
                onClose={() => setSelectedStall(null)}
                onNavigate={handleSelectStallDestination}
                isBookmarked={bookmarks.includes(selectedStall.id)}
                onToggleBookmark={handleToggleBookmark}
              />
            )}

            {/* Nearby Facilities Horizontal Scroll (from user specification) */}
            {!destination && (
              <div className="absolute bottom-[80px] left-4 right-4 z-[500] pointer-events-none flex flex-col gap-2 max-w-lg mx-auto">
                <div className="glass bg-white/95 p-4 rounded-2xl shadow-lg border border-slate-200 pointer-events-auto">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      📍 Nearby Facilities
                    </h3>
                  </div>
                  <div className="flex gap-3 overflow-x-auto pb-1 snap-x no-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    {/* Parking */}
                    <button 
                      onClick={() => setShowParkingModal(true)}
                      className="min-w-[130px] flex-shrink-0 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-900 p-3 rounded-xl snap-start text-left transition-all active:scale-95"
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="material-symbols-outlined text-[18px] text-blue-700">local_parking</span>
                        <span className="text-[11px] font-bold">Parking</span>
                      </div>
                      <div className="text-sm font-bold">120m</div>
                      <div className="text-[10px] text-slate-500 font-medium">2 min walk</div>
                    </button>
                    
                    {/* Washrooms */}
                    <button 
                      onClick={() => {
                        setIndoorBuildingId('sbm');
                        setShowSBMIndoorModal(true);
                      }}
                      className="min-w-[130px] flex-shrink-0 bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-900 p-3 rounded-xl snap-start text-left transition-all active:scale-95"
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="material-symbols-outlined text-[18px] text-purple-700">wc</span>
                        <span className="text-[11px] font-bold">Washroom</span>
                      </div>
                      <div className="text-sm font-bold">50m</div>
                      <div className="text-[10px] text-slate-500 font-medium">1 min walk</div>
                    </button>

                    {/* E-Rickshaw Stop */}
                    <button 
                      onClick={() => setShowShuttleModal(true)}
                      className="min-w-[130px] flex-shrink-0 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 p-3 rounded-xl snap-start text-left transition-all active:scale-95"
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="material-symbols-outlined text-[18px] text-emerald-700">local_taxi</span>
                        <span className="text-[11px] font-bold">E-Rickshaw</span>
                      </div>
                      <div className="text-sm font-bold">80m</div>
                      <div className="text-[10px] text-slate-500 font-medium">1 min walk</div>
                    </button>

                    {/* Food Court */}
                    <button 
                      onClick={() => setShowCampusLifeModal(true)}
                      className="min-w-[130px] flex-shrink-0 bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-900 p-3 rounded-xl snap-start text-left transition-all active:scale-95"
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="material-symbols-outlined text-[18px] text-orange-700">local_pizza</span>
                        <span className="text-[11px] font-bold">Canteen</span>
                      </div>
                      <div className="text-sm font-bold">150m</div>
                      <div className="text-[10px] text-slate-500 font-medium">3 min walk</div>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* 6. Modals & Drawers */}
      <AIAssistantModal
        isOpen={showAIAssistant}
        onClose={() => setShowAIAssistant(false)}
        currentLocation={currentLocation}
        destination={destination}
        onSelectLocation={handleSelectLocation}
        onStartNavigation={(mode = 'preview') => {
          setNavMode(mode);
          if (mode === 'active') setIsNavigatingLive(true);
        }}
        onCancelNavigation={() => {
          setDestination(null);
          setIsNavigatingLive(false);
          setNavMode('hidden');
        }}
        onOpenStalls={() => setShowStallsModal(true)}
        onOpenSessions={() => setShowSessionsModal(true)}
        onOpen3DView={(bld) => setBuilding3D(bld)}
        onOpenStreetView={() => setShowStreetViewModal(true)}
        onOpenSBMIndoor={() => setShowSBMIndoorModal(true)}
        onOpenParking={() => setShowParkingModal(true)}
        onOpenShuttle={() => setShowShuttleModal(true)}
        onOpenCampusLife={() => setShowCampusLifeModal(true)}
        onOpenEmergency={handleTriggerSOS}
      />

      <StartupExhibitionModal
        isOpen={showStallsModal}
        onClose={() => setShowStallsModal(false)}
        onSelectStallDestination={handleSelectStallDestination}
        bookmarks={bookmarks}
        onToggleBookmark={handleToggleBookmark}
      />

      <EventSessionsModal
        isOpen={showSessionsModal}
        onClose={() => setShowSessionsModal(false)}
        onNavigateToVenue={handleSelectLocation}
        bookmarks={bookmarks}
        onToggleBookmark={handleToggleBookmark}
      />

      <AccessibilityModal
        isOpen={showAccessibilityModal}
        onClose={() => setShowAccessibilityModal(false)}
        accessibilityOptions={accessibilityOptions}
        setAccessibilityOptions={setAccessibilityOptions}
        onTriggerSOS={handleTriggerSOS}
      />

      <EditLocationModal
        isOpen={showEditLocationModal}
        onClose={() => setShowEditLocationModal(false)}
        initialLocation={editingLocation}
        onLocationSaved={(updatedLoc) => {
          if (currentLocation && currentLocation.id === updatedLoc.id) {
            setCurrentLocation(prev => ({ ...prev, ...updatedLoc }));
          }
          if (destination && destination.id === updatedLoc.id) {
            setDestination(prev => ({ ...prev, ...updatedLoc }));
          }
        }}
      />

      <ManagePinsModal
        isOpen={showManagePinsModal}
        onClose={() => setShowManagePinsModal(false)}
        onSelectLocationOnMap={(loc) => {
          handleSelectLocation(loc);
        }}
      />

      {/* 3D Building Viewer Modal */}
      <Building3DViewerModal
        isOpen={!!building3D}
        building={building3D}
        onClose={() => setBuilding3D(null)}
        onNavigateToBuilding={(bld) => {
          handleSelectLocation(bld);
          setBuilding3D(null);
        }}
      />

      {/* Interactive 360° Panoramic Street View Modal */}
      <CampusStreetViewModal
        isOpen={showStreetViewModal}
        onClose={() => setShowStreetViewModal(false)}
        currentLocation={currentLocation}
        destination={destination}
      />

      {/* Admin 360° Photo Uploader & Hotspot Dashboard Modal */}
      <Admin360DashboardModal
        isOpen={showAdmin360Modal}
        onClose={() => setShowAdmin360Modal(false)}
        onOpenPreview360={(node) => {
          setShowAdmin360Modal(false);
          setShowStreetViewModal(true);
        }}
      />
      {/* Smart Campus New Features Modals */}
      <CampusShuttleModal
        isOpen={showShuttleModal}
        onClose={() => setShowShuttleModal(false)}
        onSelectShuttleStop={(stop) => {
          handleSelectLocation({ name: stop.name, lat: 26.5010, lng: 80.2675 });
        }}
      />

      <CampusLifeStatusModal
        isOpen={showCampusLifeModal}
        onClose={() => setShowCampusLifeModal(false)}
        onNavigateToFacility={(facName) => {
          handleSelectLocation({ name: facName, lat: 26.5005, lng: 80.2680 });
        }}
      />

      <ParkingFinderModal
        isOpen={showParkingModal}
        onClose={() => setShowParkingModal(false)}
        onNavigateToParking={(parkName) => {
          handleSelectLocation({ name: parkName, lat: 26.4980, lng: 80.2660 });
        }}
      />

      <SBMBuildingIndoorModal
        isOpen={showSBMIndoorModal}
        onClose={() => setShowSBMIndoorModal(false)}
        initialBuildingId={indoorBuildingId}
        onNavigateToBuilding={(bld) => {
          handleSelectLocation(bld);
        }}
      />

      {/* Bottom Tab Navigation Bar */}
      <nav className="fixed bottom-0 w-full z-[650] pb-safe bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        <div className="flex justify-between items-center h-16 px-2 max-w-lg mx-auto">
          <button 
            onClick={() => setActiveTab('home')}
            className={`flex-1 flex flex-col items-center justify-center gap-0.5 h-full transition-colors ${activeTab === 'home' ? 'text-blue-600 font-semibold' : 'text-slate-500 hover:text-blue-600'}`}
          >
            <span className="material-symbols-outlined">home</span>
            <span className="text-[10px]">Home</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('campus-map')}
            className={`flex-1 flex flex-col items-center justify-center gap-0.5 h-full transition-colors ${activeTab === 'campus-map' ? 'text-blue-600 font-semibold' : 'text-slate-500 hover:text-blue-600'}`}
          >
            <span className="material-symbols-outlined">map</span>
            <span className="text-[10px]">Map</span>
          </button>
          
          <div className="flex-1 flex flex-col items-center justify-start pb-2">
            <button 
              onClick={() => setShowAIAssistant(true)}
              className="w-14 h-14 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 animate-pulse -translate-y-4 border-4 border-white active:scale-90 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[28px]">smart_toy</span>
            </button>
            <span className="text-[10px] text-indigo-600 mt-[-12px] font-semibold">AI</span>
          </div>
          
          <button 
            onClick={() => setShowSessionsModal(true)}
            className="flex-1 flex flex-col items-center justify-center gap-0.5 h-full text-slate-500 hover:text-blue-600 transition-colors"
          >
            <span className="material-symbols-outlined">calendar_month</span>
            <span className="text-[10px]">Schedule</span>
          </button>
          
          <button 
            onClick={() => handleOpenIndoorModal()}
            className="flex-1 flex flex-col items-center justify-center gap-0.5 h-full text-slate-500 hover:text-blue-600 transition-colors"
          >
            <span className="material-symbols-outlined">more_horiz</span>
            <span className="text-[10px]">More</span>
          </button>
        </div>
      </nav>
    </div>
  );
}

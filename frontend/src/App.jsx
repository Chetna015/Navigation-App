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
    setVoiceEnabled
  } = useLiveNavigationVoice({ currentLocation, destination });

  // Automatically update currentLocation with exact real-time phone GPS position when received (with 3.5m thresholding)
  useEffect(() => {
    if (userPos && userPos.lat && userPos.lng) {
      setCurrentLocation(prev => {
        if (prev?.lat && prev?.lng) {
          const latDiff = Math.abs(prev.lat - userPos.lat);
          const lngDiff = Math.abs(prev.lng - userPos.lng);
          // Only update state if coordinates moved more than ~3.5 meters (0.00003 degrees)
          if (latDiff < 0.00003 && lngDiff < 0.00003) {
            return prev;
          }
        }
        return {
          ...prev,
          name: 'My Live GPS Location 📍',
          lat: userPos.lat,
          lng: userPos.lng,
          isLiveUser: true
        };
      });
    }
  }, [userPos]);

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
  const [editingLocation, setEditingLocation] = useState(null);
  const [selectedStall, setSelectedStall] = useState(null);

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

  // Set Location as Navigation Destination
  const handleSelectLocation = (loc) => {
    setDestination(loc);
    setIsNavigatingLive(false); // Show Route Preview Box first
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
      <main className="main-content">
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
      </main>

      {/* 6. Modals & Drawers */}
      <AIAssistantModal
        isOpen={showAIAssistant}
        onClose={() => setShowAIAssistant(false)}
        onSelectLocation={handleSelectLocation}
        onOpenStalls={() => setShowStallsModal(true)}
        onOpenSessions={() => setShowSessionsModal(true)}
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
        onNavigateToBuilding={(bld) => {
          handleSelectLocation(bld);
        }}
      />
    </div>
  );
}

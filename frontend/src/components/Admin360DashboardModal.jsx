import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Upload, Image as ImageIcon, MapPin, Compass, Plus, Trash2, 
  Edit3, Save, CheckCircle, AlertCircle, RefreshCw, Key, Layers, ArrowRight, Eye, Play
} from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getMergedMapLocations, getMergedCampusBuildings, saveLocationOverride, hideOrDeleteLocation } from '../utils/locationStore';
import { saveCustomPlottedBuilding, deleteCustomPlottedBuilding } from '../utils/pathfinding';
import { apiService } from '../services/api';

// Interactive Leaflet Satellite GIS Map Plotter for Admin Console
function AdminCampusMapPlotter({
  locations = [],
  selectedLat,
  selectedLng,
  onMapClick,
  onSelectLocation
}) {
  const mapContainerRef = useRef(null);
  const leafletMapRef = useRef(null);
  const markersGroupRef = useRef(null);
  const [mapType, setMapType] = useState('hybrid'); // 'hybrid' | 'roadmap'
  const tileLayerRef = useRef(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!leafletMapRef.current) {
      const initialLat = parseFloat(selectedLat) || 26.5015;
      const initialLng = parseFloat(selectedLng) || 80.2666;

      const map = L.map(mapContainerRef.current, {
        center: [initialLat, initialLng],
        zoom: 17,
        zoomControl: false,
        attributionControl: false
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      tileLayerRef.current = L.tileLayer(
        'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
        { maxZoom: 21, maxNativeZoom: 20, subdomains: ['mt0', 'mt1', 'mt2', 'mt3'] }
      ).addTo(map);

      markersGroupRef.current = L.layerGroup().addTo(map);

      // Map Click Handler: capture coordinates
      map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        onMapClick(lat, lng);
      });

      leafletMapRef.current = map;
    }

    const timer = setTimeout(() => {
      if (leafletMapRef.current) {
        leafletMapRef.current.invalidateSize();
      }
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  // Update Tile Layer between Satellite Hybrid and Standard Roadmap
  useEffect(() => {
    const map = leafletMapRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    const url = mapType === 'roadmap'
      ? 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}'
      : 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}';

    tileLayerRef.current = L.tileLayer(url, {
      maxZoom: 21,
      maxNativeZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    }).addTo(map);
  }, [mapType]);

  // Render Existing Pins & Active Target Pin
  useEffect(() => {
    const map = leafletMapRef.current;
    if (!map || !markersGroupRef.current) return;

    markersGroupRef.current.clearLayers();

    // 1. Render all existing mapped pins
    locations.forEach(loc => {
      if (!loc.lat || !loc.lng) return;

      const markerHtml = `
        <div style="
          transform: translate(-50%, -100%);
          display: flex;
          align-items: center;
          gap: 4px;
          cursor: pointer;
        ">
          <div style="
            width: 26px;
            height: 26px;
            border-radius: 50%;
            background: #2563EB;
            border: 2px solid #FFFFFF;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #FFF;
            font-size: 11px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.4);
          ">
            📍
          </div>
          <div style="
            background: rgba(15, 23, 42, 0.88);
            color: #FFF;
            font-size: 10px;
            font-weight: 700;
            padding: 2px 7px;
            border-radius: 4px;
            white-space: nowrap;
            border: 1px solid rgba(255,255,255,0.25);
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          ">
            ${loc.name}
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'admin-map-existing-pin',
        html: markerHtml,
        iconSize: [0, 0],
        iconAnchor: [0, 0]
      });

      const marker = L.marker([loc.lat, loc.lng], { icon: customIcon });
      marker.on('click', (e) => {
        L.DomEvent.stopPropagation(e);
        if (onSelectLocation) onSelectLocation(loc);
      });
      markersGroupRef.current.addLayer(marker);
    });

    // 2. Render Active / Selected Pin
    const sLat = parseFloat(selectedLat);
    const sLng = parseFloat(selectedLng);

    if (!isNaN(sLat) && !isNaN(sLng)) {
      const activeHtml = `
        <div style="
          transform: translate(-50%, -100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
        ">
          <div style="
            background: #EF4444;
            color: #FFFFFF;
            font-size: 11px;
            font-weight: 800;
            padding: 3px 8px;
            border-radius: 6px;
            white-space: nowrap;
            box-shadow: 0 2px 8px rgba(239,68,68,0.5);
            border: 1.5px solid #FFFFFF;
            margin-bottom: 2px;
          ">
            🎯 ${sLat.toFixed(5)}, ${sLng.toFixed(5)}
          </div>
          <div style="
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: #EF4444;
            border: 2.5px solid #FFFFFF;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #FFF;
            font-size: 14px;
            box-shadow: 0 0 16px rgba(239, 68, 68, 0.9), 0 4px 12px rgba(0,0,0,0.5);
          ">
            📍
          </div>
        </div>
      `;

      const activeIcon = L.divIcon({
        className: 'admin-map-active-pin',
        html: activeHtml,
        iconSize: [0, 0],
        iconAnchor: [0, 0]
      });

      const activeMarker = L.marker([sLat, sLng], { icon: activeIcon, zIndexOffset: 1000 });
      markersGroupRef.current.addLayer(activeMarker);
    }
  }, [locations, selectedLat, selectedLng]);

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100%',
      minHeight: '320px',
      borderRadius: '12px',
      overflow: 'hidden',
      border: '1px solid var(--colors-hairline-strong)',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    }}>
      <div 
        ref={mapContainerRef} 
        style={{ width: '100%', height: '100%', minHeight: '320px', cursor: 'crosshair' }} 
      />

      {/* Floating Top Controls */}
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '10px',
        right: '10px',
        zIndex: 500,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        pointerEvents: 'none'
      }}>
        <div style={{
          background: 'rgba(15, 23, 42, 0.92)',
          backdropFilter: 'blur(8px)',
          color: '#FFF',
          padding: '6px 12px',
          borderRadius: '8px',
          fontSize: '11px',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          border: '1px solid rgba(255,255,255,0.2)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          pointerEvents: 'auto'
        }}>
          <span>👆 Click anywhere to set coordinates</span>
        </div>

        <div style={{ display: 'flex', gap: '6px', pointerEvents: 'auto' }}>
          <button
            type="button"
            onClick={() => setMapType(mapType === 'hybrid' ? 'roadmap' : 'hybrid')}
            style={{
              background: 'var(--colors-surface-card)',
              color: 'var(--colors-ink)',
              border: '1px solid var(--colors-hairline-strong)',
              padding: '5px 10px',
              borderRadius: '8px',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
            }}
          >
            {mapType === 'hybrid' ? '🗺️ Road View' : '🛰️ Satellite'}
          </button>

          <button
            type="button"
            onClick={() => {
              if (leafletMapRef.current) {
                leafletMapRef.current.flyTo([26.5015, 80.2666], 17, { duration: 0.8 });
              }
            }}
            style={{
              background: 'var(--colors-surface-card)',
              color: 'var(--colors-ink)',
              border: '1px solid var(--colors-hairline-strong)',
              padding: '5px 10px',
              borderRadius: '8px',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
            }}
          >
            🎯 Re-center
          </button>
        </div>
      </div>

      {/* Bottom Coordinate Indicator */}
      <div style={{
        position: 'absolute',
        bottom: '10px',
        left: '10px',
        zIndex: 500,
        background: 'rgba(15, 23, 42, 0.9)',
        backdropFilter: 'blur(6px)',
        color: '#34D399',
        padding: '4px 10px',
        borderRadius: '6px',
        fontSize: '11px',
        fontFamily: 'var(--font-code)',
        fontWeight: 700,
        border: '1px solid rgba(52, 211, 153, 0.3)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
      }}>
        📍 Active Coords: {selectedLat || '26.4970'}, {selectedLng || '80.2666'}
      </div>
    </div>
  );
}

export default function Admin360DashboardModal({
  isOpen,
  onClose
}) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  
  // Dashboard navigation tab: 'locations' | 'rooms' | 'watercoolers' | 'upload_360'
  const [activeTab, setActiveTab] = useState('locations');
  const [statusMsg, setStatusMsg] = useState(null);

  // Locations State
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  
  // Locations Form State
  const [locId, setLocId] = useState('');
  const [locName, setLocName] = useState('');
  const [locCode, setLocCode] = useState('');
  const [locCategory, setLocCategory] = useState('Academic Block');
  const [locLat, setLocLat] = useState('26.4970');
  const [locLng, setLocLng] = useState('80.2666');
  const [locFloors, setLocFloors] = useState(2);
  const [locDescription, setLocDescription] = useState('');
  const [locCoverImage, setLocCoverImage] = useState('');
  const [locVideoUrl, setLocVideoUrl] = useState('');

  // SBM Indoor Rooms State & Form
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [roomId, setRoomId] = useState('');
  const [roomName, setRoomName] = useState('');
  const [roomType, setRoomType] = useState('Classroom');
  const [roomCapacity, setRoomCapacity] = useState('60 Seats');
  const [roomEquipment, setRoomEquipment] = useState('');
  const [roomEvent, setRoomEvent] = useState('');
  const [roomStatus, setRoomStatus] = useState('Active');
  const [roomX, setRoomX] = useState(100);
  const [roomY, setRoomY] = useState(100);

  // SBM Watercoolers State & Form
  const [watercoolers, setWatercoolers] = useState([]);
  const [selectedWc, setSelectedWc] = useState(null);
  const [wcId, setWcId] = useState('');
  const [wcName, setWcName] = useState('');
  const [wcType, setWcType] = useState('Heavy-Duty RO + UV Purifier');
  const [wcTemp, setWcTemp] = useState('6.0°C');
  const [wcPurity, setWcPurity] = useState('99.9%');
  const [wcCapacity, setWcCapacity] = useState('80 Litres/Hr');
  const [wcStatus, setWcStatus] = useState('Operational • Active');
  const [wcDesc, setWcDesc] = useState('');
  const [wcImage, setWcImage] = useState('');
  const [wcX, setWcX] = useState(150);
  const [wcY, setWcY] = useState(150);

  // File Upload File selection
  const [uploadFile, setUploadFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = async () => {
    try {
      // 1. Fetch Locations from Backend API
      const locData = await apiService.getLocations();
      const localMerged = getMergedCampusBuildings();
      
      if (locData && locData.success && Array.isArray(locData.locations)) {
        // Merge database locations with local campus locations
        const combined = { ...localMerged };
        locData.locations.forEach(loc => {
          if (loc && loc.id) {
            combined[loc.id] = { ...(combined[loc.id] || {}), ...loc };
          }
        });
        setLocations(Object.values(combined));
      } else {
        setLocations(Object.values(localMerged));
      }

      // 2. Fetch Rooms
      const roomsData = await apiService.getRooms();
      if (roomsData && roomsData.success) {
        setRooms(roomsData.rooms);
      }

      // 3. Fetch Watercoolers
      const wcData = await apiService.getWatercoolers();
      if (wcData && wcData.success) {
        setWatercoolers(wcData.watercoolers);
      }
    } catch (e) {
      console.warn("Operating with local storage merged campus data:", e);
      setLocations(getMergedMapLocations());
    }
  };

  if (!isOpen) return null;

  // Handle Login Check
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      const data = await apiService.login(username, password);
      if (data.success) {
        setIsLoggedIn(true);
      } else {
        setLoginError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      // Fallback credentials check if backend is offline
      if (username === 'admin' && password === 'admin2026') {
        setIsLoggedIn(true);
      } else {
        setLoginError('Incorrect credentials (offline check failed)');
      }
    }
  };

  // Handle File Upload to local Server Uploads Directory
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setStatusMsg({ type: 'info', text: 'Uploading file to server...' });

    try {
      const data = await apiService.uploadFile(file);
      if (data.success) {
        setUploadedUrl(data.url);
        setStatusMsg({ type: 'success', text: `✅ Uploaded successfully: ${file.name}` });
        
        // Auto apply to active fields
        if (activeTab === 'locations') setLocCoverImage(data.url);
        if (activeTab === 'watercoolers') setWcImage(data.url);
      } else {
        setStatusMsg({ type: 'error', text: 'Upload failed: ' + data.error });
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: 'Upload failed (Backend Server offline)' });
    } finally {
      setUploading(false);
    }
  };

  // Locations Operations
  const handleSaveLocation = async (e) => {
    e.preventDefault();
    if (!locId || !locName) {
      alert("Location ID and Name are required!");
      return;
    }

    const payload = {
      id: locId,
      name: locName,
      code: locCode || 'BLD-CUST',
      category: locCategory || 'Custom Building',
      lat: parseFloat(locLat),
      lng: parseFloat(locLng),
      x: parseInt(locLat) ? 450 : 0, // Mock layout X/Y
      y: parseInt(locLng) ? 400 : 0,
      floors: parseInt(locFloors) || 1,
      description: locDescription || 'University Campus Location',
      cover_image: locCoverImage || '',
      video_url: locVideoUrl || '',
      isCustom: true
    };

    try {
      await apiService.saveLocation(payload);
    } catch (err) {
      console.warn("Backend save failed, saved to local cache", err);
    }

    // Always synchronize browser local storage and plotted buildings for instant map rendering
    saveLocationOverride(locId, payload);
    saveCustomPlottedBuilding(payload);

    setStatusMsg({ type: 'success', text: `✅ Saved Location "${locName}" successfully!` });
    loadData();
    resetLocationForm();
  };

  const handleEditLocation = (loc) => {
    setSelectedLocation(loc);
    setLocId(loc.id);
    setLocName(loc.name);
    setLocCode(loc.code || '');
    setLocCategory(loc.category || 'Academic Block');
    setLocLat(loc.lat.toString());
    setLocLng(loc.lng.toString());
    setLocFloors(loc.floors || 2);
    setLocDescription(loc.description || '');
    setLocCoverImage(loc.cover_image || '');
    setLocVideoUrl(loc.video_url || '');
  };

  const handleDeleteLocation = async (id) => {
    if (!confirm("Are you sure you want to delete this map location?")) return;
    try {
      await apiService.deleteLocation(id);
    } catch (e) {
      console.warn("Backend delete offline:", e);
    }
    hideOrDeleteLocation(id);
    deleteCustomPlottedBuilding(id);
    loadData();
    setStatusMsg({ type: 'success', text: '✅ Deleted location successfully!' });
  };

  const resetLocationForm = () => {
    setSelectedLocation(null);
    setLocId('');
    setLocName('');
    setLocCode('');
    setLocCategory('Academic Block');
    setLocLat('26.4970');
    setLocLng('80.2666');
    setLocFloors(2);
    setLocDescription('');
    setLocCoverImage('');
    setLocVideoUrl('');
  };

  // Map Click handler to auto-fill Latitude & Longitude
  const handleMapClick = (lat, lng) => {
    const formattedLat = lat.toFixed(6);
    const formattedLng = lng.toFixed(6);
    setLocLat(formattedLat);
    setLocLng(formattedLng);
    if (!locId) {
      setLocId(`loc_custom_${Date.now().toString().slice(-4)}`);
    }
    setStatusMsg({
      type: 'info',
      text: `📍 Captured Coordinates (${formattedLat}, ${formattedLng}) from map! Please enter Location Name & Description to save.`
    });
  };

  // Rooms Operations
  const handleSaveRoom = async (e) => {
    e.preventDefault();
    if (!roomId || !roomName) return;

    const payload = {
      id: roomId,
      location_id: 'loc_auditorium', // Lock to SBM Auditorium
      floor_level: 'ground',
      name: roomName,
      type: roomType,
      capacity: roomCapacity,
      equipment: roomEquipment,
      current_event: roomEvent,
      status: roomStatus,
      coord_x: parseInt(roomX),
      coord_y: parseInt(roomY)
    };

    try {
      const data = await apiService.saveRoom(payload);
      if (data.success) {
        setStatusMsg({ type: 'success', text: `✅ Saved Room "${roomName}" successfully!` });
        loadData();
        resetRoomForm();
      }
    } catch (err) {
      alert("Error: Server Offline. Can only manage rooms via local database connection.");
    }
  };

  const handleDeleteRoom = async (id) => {
    if (!confirm("Are you sure you want to delete this SBM classroom?")) return;
    try {
      await apiService.deleteRoom(id);
      loadData();
      setStatusMsg({ type: 'success', text: '✅ Deleted room successfully!' });
    } catch (e) {
      alert("Error: Server Offline.");
    }
  };

  const resetRoomForm = () => {
    setSelectedRoom(null);
    setRoomId('');
    setRoomName('');
    setRoomType('Classroom');
    setRoomCapacity('60 Seats');
    setRoomEquipment('');
    setRoomEvent('');
    setRoomStatus('Active');
    setRoomX(100);
    setRoomY(100);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 2000,
      background: 'rgba(0, 0, 0, 0.7)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="animate-scale-up" style={{
        width: '100%',
        maxWidth: '1200px',
        height: '92vh',
        maxHeight: '92vh',
        background: 'var(--colors-surface-card)',
        borderRadius: '16px',
        border: '1px solid var(--colors-hairline-strong)',
        boxShadow: 'var(--shadow-md)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '18px 24px',
          background: 'var(--colors-surface-soft)',
          borderBottom: '1px solid var(--colors-hairline)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--colors-primary)', color: 'var(--colors-on-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
              ⚙️
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--colors-ink)', fontFamily: 'var(--font-heading)' }}>
                CSJMU Campus Admin Console & GIS Manager
              </h3>
              <p style={{ fontSize: '11px', color: 'var(--colors-body)', margin: 0 }}>
                Manage campus map coordinates, room details, water purifiers telemetry & media assets
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'transparent', border: 'none', color: 'var(--colors-ink)', fontSize: '18px', cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>

        {/* LOGIN SCREEN OVERLAY */}
        {!isLoggedIn ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', background: 'var(--colors-canvas)' }}>
            <form onSubmit={handleLogin} style={{ width: '100%', maxWidth: '360px', padding: '24px', borderRadius: '16px', border: '1px solid var(--colors-hairline)', background: 'var(--colors-surface-card)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <Key size={32} style={{ color: 'var(--colors-ink)', marginBottom: '8px' }} />
                <h4 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 4px' }}>Admin Authorization</h4>
                <p style={{ fontSize: '12px', color: 'var(--colors-body)', margin: 0 }}>Log in with credentials to modify campus databases</p>
              </div>

              {loginError && (
                <div style={{ padding: '10px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #EF4444', color: '#EF4444', fontSize: '12px', borderRadius: '8px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <AlertCircle size={14} /> {loginError}
                </div>
              )}

              <div style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '11px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>USERNAME</label>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  required 
                  style={{ width: '100%', padding: '10px', background: 'var(--colors-surface-soft)', border: '1px solid var(--colors-hairline-strong)', color: 'var(--colors-ink)', borderRadius: '8px', fontSize: '13px', outline: 'none' }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '11px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>PASSWORD</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required 
                  style={{ width: '100%', padding: '10px', background: 'var(--colors-surface-soft)', border: '1px solid var(--colors-hairline-strong)', color: 'var(--colors-ink)', borderRadius: '8px', fontSize: '13px', outline: 'none' }}
                />
              </div>

              <button type="submit" className="ollama-btn-primary" style={{ width: '100%', height: '38px', borderRadius: '8px', fontSize: '13px', fontWeight: 600 }}>
                Authorize Access <ArrowRight size={14} />
              </button>
            </form>
          </div>
        ) : (
          /* DASHBOARD VIEW */
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            
            {/* Navigation Tabs bar */}
            <div style={{ display: 'flex', borderBottom: '1px solid var(--colors-hairline)', background: 'var(--colors-surface-soft)', padding: '0 24px' }}>
              {[
                { id: 'locations', label: '📍 Pins & GIS Info' },
                { id: 'rooms', label: '🏫 SBM Rooms list' },
                { id: 'watercoolers', label: '🚰 SBM Watercoolers' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: '14px 20px',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: activeTab === tab.id ? '2px solid var(--colors-primary)' : '2px solid transparent',
                    color: activeTab === tab.id ? 'var(--colors-ink)' : 'var(--colors-body)',
                    fontWeight: activeTab === tab.id ? 700 : 500,
                    fontSize: '13px',
                    cursor: 'pointer',
                    outline: 'none'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Status alerts */}
            {statusMsg && (
              <div style={{
                padding: '10px 24px',
                background: statusMsg.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                borderBottom: '1px solid var(--colors-hairline)',
                fontSize: '12px',
                color: statusMsg.type === 'error' ? '#EF4444' : '#10B981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {statusMsg.type === 'error' ? <AlertCircle size={14} /> : <CheckCircle size={14} />}
                  {statusMsg.text}
                </span>
                <button onClick={() => setStatusMsg(null)} style={{ background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer' }}>✕</button>
              </div>
            )}

            {/* TAB BODIES */}
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', background: 'var(--colors-canvas)' }}>
              
              {/* TAB 1: LOCATIONS */}
              {activeTab === 'locations' && (
                <div style={{ flex: 1, display: 'flex', height: '100%' }}>
                  {/* Left Form */}
                  <form onSubmit={handleSaveLocation} style={{ width: '400px', borderRight: '1px solid var(--colors-hairline)', padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px', overflowY: 'auto' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: 700, margin: 0 }}>
                      {selectedLocation ? '✏️ Edit Selected Pin' : '➕ Add Custom Pin'}
                    </h4>

                    <div>
                      <label style={{ fontSize: '10px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>LOCATION ID</label>
                      <input 
                        type="text" 
                        value={locId} 
                        onChange={(e) => setLocId(e.target.value)} 
                        placeholder="e.g. loc_senate" 
                        disabled={!!selectedLocation}
                        required
                        style={{ width: '100%', padding: '8px', background: 'var(--colors-surface-soft)', border: '1px solid var(--colors-hairline-strong)', color: 'var(--colors-ink)', borderRadius: '8px', fontSize: '12px' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '10px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>LOCATION NAME</label>
                      <input 
                        type="text" 
                        value={locName} 
                        onChange={(e) => setLocName(e.target.value)} 
                        placeholder="e.g. Senate Block Hall" 
                        required
                        style={{ width: '100%', padding: '8px', background: 'var(--colors-surface-soft)', border: '1px solid var(--colors-hairline-strong)', color: 'var(--colors-ink)', borderRadius: '8px', fontSize: '12px' }}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <div>
                        <label style={{ fontSize: '10px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>LATITUDE</label>
                        <input 
                          type="text" 
                          value={locLat} 
                          onChange={(e) => setLocLat(e.target.value)} 
                          placeholder="26.4970" 
                          required
                          style={{ width: '100%', padding: '8px', background: 'var(--colors-surface-soft)', border: '1px solid var(--colors-hairline-strong)', color: 'var(--colors-ink)', borderRadius: '8px', fontSize: '12px' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '10px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>LONGITUDE</label>
                        <input 
                          type="text" 
                          value={locLng} 
                          onChange={(e) => setLocLng(e.target.value)} 
                          placeholder="80.2666" 
                          required
                          style={{ width: '100%', padding: '8px', background: 'var(--colors-surface-soft)', border: '1px solid var(--colors-hairline-strong)', color: 'var(--colors-ink)', borderRadius: '8px', fontSize: '12px' }}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <div>
                        <label style={{ fontSize: '10px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>CATEGORY</label>
                        <select 
                          value={locCategory} 
                          onChange={(e) => setLocCategory(e.target.value)}
                          style={{ width: '100%', padding: '8px', background: 'var(--colors-surface-soft)', border: '1px solid var(--colors-hairline-strong)', color: 'var(--colors-ink)', borderRadius: '8px', fontSize: '12px' }}
                        >
                          <option value="Academic Block">Academic Block</option>
                          <option value="Summit Venue">Summit Venue</option>
                          <option value="Library Block">Library Block</option>
                          <option value="Facility">Facility</option>
                          <option value="Entrance">Entrance</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ fontSize: '10px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>FLOORS</label>
                        <input 
                          type="number" 
                          value={locFloors} 
                          onChange={(e) => setLocFloors(e.target.value)} 
                          min="1"
                          style={{ width: '100%', padding: '8px', background: 'var(--colors-surface-soft)', border: '1px solid var(--colors-hairline-strong)', color: 'var(--colors-ink)', borderRadius: '8px', fontSize: '12px' }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: '10px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>DESCRIPTION</label>
                      <textarea 
                        value={locDescription} 
                        onChange={(e) => setLocDescription(e.target.value)} 
                        rows="2"
                        placeholder="Details about building..."
                        style={{ width: '100%', padding: '8px', background: 'var(--colors-surface-soft)', border: '1px solid var(--colors-hairline-strong)', color: 'var(--colors-ink)', borderRadius: '8px', fontSize: '12px', resize: 'vertical' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '10px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>COVER PHOTO / 360 PANORAMA URL</label>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <input 
                          type="text" 
                          value={locCoverImage} 
                          onChange={(e) => setLocCoverImage(e.target.value)} 
                          placeholder="http://localhost:5000/uploads/..." 
                          style={{ flex: 1, padding: '8px', background: 'var(--colors-surface-soft)', border: '1px solid var(--colors-hairline-strong)', color: 'var(--colors-ink)', borderRadius: '8px', fontSize: '12px' }}
                        />
                        <label style={{ width: '36px', height: '36px', background: 'var(--colors-surface-dark)', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', cursor: 'pointer' }}>
                          <Upload size={16} />
                          <input type="file" onChange={handleFileUpload} accept="image/*" style={{ display: 'none' }} />
                        </label>
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: '10px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>INTRO VIDEO URL (YouTube/Direct)</label>
                      <input 
                        type="text" 
                        value={locVideoUrl} 
                        onChange={(e) => setLocVideoUrl(e.target.value)} 
                        placeholder="https://www.youtube.com/watch?v=..." 
                        style={{ width: '100%', padding: '8px', background: 'var(--colors-surface-soft)', border: '1px solid var(--colors-hairline-strong)', color: 'var(--colors-ink)', borderRadius: '8px', fontSize: '12px' }}
                      />
                    </div>

                    <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                      <button type="submit" className="ollama-btn-primary" style={{ flex: 1, height: '34px', borderRadius: '8px', fontSize: '12px' }}>
                        <Save size={14} /> Save Pin
                      </button>
                      <button type="button" onClick={resetLocationForm} className="ollama-btn-secondary" style={{ height: '34px', borderRadius: '8px', fontSize: '12px' }}>
                        Reset
                      </button>
                    </div>
                  </form>

                  {/* Right Panel: Mapped Pins Database (Top) + Interactive Map Plotter (Bottom) */}
                  <div style={{ flex: 1, padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto' }}>
                    
                    {/* 1. Mapped Pins Database Section */}
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <h4 style={{ fontSize: '14px', fontWeight: 700, margin: 0, color: 'var(--colors-ink)' }}>
                            📍 Mapped Pins Database
                          </h4>
                          <span style={{ background: 'var(--colors-surface-soft)', color: 'var(--colors-primary)', fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '9999px', border: '1px solid var(--colors-hairline)' }}>
                            {locations.length} Pins
                          </span>
                        </div>
                        <span style={{ fontSize: '11px', color: 'var(--colors-body)' }}>
                          Click any pin to edit details
                        </span>
                      </div>

                      <div style={{
                        maxHeight: '180px',
                        overflowY: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                        paddingRight: '4px'
                      }}>
                        {locations.map(loc => (
                          <div 
                            key={loc.id} 
                            style={{ 
                              padding: '10px 14px', 
                              borderRadius: '10px', 
                              border: selectedLocation?.id === loc.id ? '1.5px solid var(--colors-primary)' : '1px solid var(--colors-hairline)', 
                              background: selectedLocation?.id === loc.id ? 'var(--colors-surface-soft)' : 'var(--colors-surface-card)', 
                              display: 'flex', 
                              justifyContent: 'space-between', 
                              alignItems: 'center',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', cursor: 'pointer' }} onClick={() => handleEditLocation(loc)}>
                              {loc.cover_image ? (
                                <img src={loc.cover_image} alt={loc.name} style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} />
                              ) : (
                                <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'var(--colors-surface-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>
                                  📍
                                </div>
                              )}
                              <div>
                                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--colors-ink)' }}>
                                  {loc.name} <span style={{ fontSize: '11px', color: 'var(--colors-body)', fontWeight: 500 }}>({loc.code || loc.id})</span>
                                </div>
                                <div style={{ fontSize: '11px', color: 'var(--colors-body)', marginTop: '2px' }}>
                                  <span style={{ fontWeight: 600, color: 'var(--colors-primary)' }}>{loc.category}</span> • coords: {parseFloat(loc.lat).toFixed(4)}, {parseFloat(loc.lng).toFixed(4)}
                                </div>
                              </div>
                            </div>

                            <div style={{ display: 'flex', gap: '6px' }}>
                              <button 
                                type="button" 
                                onClick={() => handleEditLocation(loc)} 
                                className="ollama-btn-secondary" 
                                style={{ height: '28px', padding: '0 10px', fontSize: '11px', borderRadius: '6px' }}
                                title="Edit coordinates and info"
                              >
                                <Edit3 size={12} /> Edit
                              </button>
                              <button 
                                type="button" 
                                onClick={() => handleDeleteLocation(loc.id)} 
                                className="ollama-btn-secondary" 
                                style={{ height: '28px', padding: '0 10px', fontSize: '11px', borderRadius: '6px', borderColor: '#EF4444', color: '#EF4444' }}
                                title="Remove location pin"
                              >
                                <Trash2 size={12} /> Remove
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 2. Interactive Campus GIS Plotter Map (Bottom Section) */}
                    <div style={{ flex: 1, minHeight: '340px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Compass size={16} color="var(--colors-primary)" />
                          <h4 style={{ fontSize: '14px', fontWeight: 700, margin: 0, color: 'var(--colors-ink)' }}>
                            🗺️ Interactive Campus Map (Click to Plot Pin)
                          </h4>
                        </div>
                        <span style={{ fontSize: '11px', color: 'var(--colors-primary)', fontWeight: 600 }}>
                          Auto-fills Lat: {locLat} | Lng: {locLng}
                        </span>
                      </div>

                      <div style={{ flex: 1, minHeight: '300px' }}>
                        <AdminCampusMapPlotter
                          locations={locations}
                          selectedLat={locLat}
                          selectedLng={locLng}
                          onMapClick={handleMapClick}
                          onSelectLocation={handleEditLocation}
                        />
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* TAB 2: SBM ROOMS */}
              {activeTab === 'rooms' && (
                <div style={{ flex: 1, display: 'flex', height: '100%' }}>
                  {/* Left Form */}
                  <form onSubmit={handleSaveRoom} style={{ width: '400px', borderRight: '1px solid var(--colors-hairline)', padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px', overflowY: 'auto' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: 700, margin: 0 }}>
                      {selectedRoom ? '✏️ Edit Classroom Info' : '➕ Add New Room (SBM)'}
                    </h4>

                    <div>
                      <label style={{ fontSize: '10px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>ROOM ID (e.g. SBM-102)</label>
                      <input 
                        type="text" 
                        value={roomId} 
                        onChange={(e) => setRoomId(e.target.value)} 
                        placeholder="SBM-02" 
                        required
                        style={{ width: '100%', padding: '8px', background: 'var(--colors-surface-soft)', border: '1px solid var(--colors-hairline-strong)', color: 'var(--colors-ink)', borderRadius: '8px', fontSize: '12px' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '10px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>ROOM NAME & TITLE</label>
                      <input 
                        type="text" 
                        value={roomName} 
                        onChange={(e) => setRoomName(e.target.value)} 
                        placeholder="SBM-02: Smart ML Classroom" 
                        required
                        style={{ width: '100%', padding: '8px', background: 'var(--colors-surface-soft)', border: '1px solid var(--colors-hairline-strong)', color: 'var(--colors-ink)', borderRadius: '8px', fontSize: '12px' }}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <div>
                        <label style={{ fontSize: '10px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>TYPE</label>
                        <input 
                          type="text" 
                          value={roomType} 
                          onChange={(e) => setRoomType(e.target.value)} 
                          placeholder="GPU Lab" 
                          style={{ width: '100%', padding: '8px', background: 'var(--colors-surface-soft)', border: '1px solid var(--colors-hairline-strong)', color: 'var(--colors-ink)', borderRadius: '8px', fontSize: '12px' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '10px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>CAPACITY</label>
                        <input 
                          type="text" 
                          value={roomCapacity} 
                          onChange={(e) => setRoomCapacity(e.target.value)} 
                          placeholder="60 Seats" 
                          style={{ width: '100%', padding: '8px', background: 'var(--colors-surface-soft)', border: '1px solid var(--colors-hairline-strong)', color: 'var(--colors-ink)', borderRadius: '8px', fontSize: '12px' }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: '10px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>EQUIPMENT SPECS</label>
                      <input 
                        type="text" 
                        value={roomEquipment} 
                        onChange={(e) => setRoomEquipment(e.target.value)} 
                        placeholder="NVIDIA RTX GPUs, Dual Projector..." 
                        style={{ width: '100%', padding: '8px', background: 'var(--colors-surface-soft)', border: '1px solid var(--colors-hairline-strong)', color: 'var(--colors-ink)', borderRadius: '8px', fontSize: '12px' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '10px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>CURRENT EVENT / SESSION TITLE</label>
                      <input 
                        type="text" 
                        value={roomEvent} 
                        onChange={(e) => setRoomEvent(e.target.value)} 
                        placeholder="Keynote Speech / NLP Workshop" 
                        style={{ width: '100%', padding: '8px', background: 'var(--colors-surface-soft)', border: '1px solid var(--colors-hairline-strong)', color: 'var(--colors-ink)', borderRadius: '8px', fontSize: '12px' }}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <div>
                        <label style={{ fontSize: '10px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>COORDINATE X</label>
                        <input 
                          type="number" 
                          value={roomX} 
                          onChange={(e) => setRoomX(e.target.value)} 
                          style={{ width: '100%', padding: '8px', background: 'var(--colors-surface-soft)', border: '1px solid var(--colors-hairline-strong)', color: 'var(--colors-ink)', borderRadius: '8px', fontSize: '12px' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '10px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>COORDINATE Y</label>
                        <input 
                          type="number" 
                          value={roomY} 
                          onChange={(e) => setRoomY(e.target.value)} 
                          style={{ width: '100%', padding: '8px', background: 'var(--colors-surface-soft)', border: '1px solid var(--colors-hairline-strong)', color: 'var(--colors-ink)', borderRadius: '8px', fontSize: '12px' }}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                      <button type="submit" className="ollama-btn-primary" style={{ flex: 1, height: '34px', borderRadius: '8px', fontSize: '12px' }}>
                        <Save size={14} /> Save Room
                      </button>
                      <button type="button" onClick={resetRoomForm} className="ollama-btn-secondary" style={{ height: '34px', borderRadius: '8px', fontSize: '12px' }}>
                        Reset
                      </button>
                    </div>
                  </form>

                  {/* Right List */}
                  <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '16px' }}>Classrooms Database (SBM Ground Floor)</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {rooms.map(room => (
                        <div key={room.id} style={{ padding: '14px', borderRadius: '12px', border: '1px solid var(--colors-hairline)', background: 'var(--colors-surface-card)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ background: 'var(--colors-surface-dark)', color: '#FFF', fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '6px' }}>
                                {room.id}
                              </span>
                              <strong style={{ fontSize: '13px', color: 'var(--colors-ink)' }}>{room.name.split(':')[1] || room.name}</strong>
                            </div>
                            <div style={{ fontSize: '11px', color: 'var(--colors-body)', marginTop: '4px' }}>
                              Event: {room.current_event || 'No Active Session'} | Capacity: {room.capacity}
                            </div>
                          </div>

                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button onClick={() => {
                              setSelectedRoom(room);
                              setRoomId(room.id);
                              setRoomName(room.name);
                              setRoomType(room.type || 'Classroom');
                              setRoomCapacity(room.capacity || '');
                              setRoomEquipment(room.equipment || '');
                              setRoomEvent(room.current_event || '');
                              setRoomStatus(room.status || 'Active');
                              setRoomX(room.coord_x || 100);
                              setRoomY(room.coord_y || 100);
                            }} className="ollama-btn-secondary" style={{ height: '30px', padding: '0 10px', fontSize: '11px', borderRadius: '8px' }}>
                              <Edit3 size={12} /> Edit
                            </button>
                            <button onClick={() => handleDeleteRoom(room.id)} className="ollama-btn-secondary" style={{ height: '30px', padding: '0 10px', fontSize: '11px', borderRadius: '8px', borderColor: '#EF4444', color: '#EF4444' }}>
                              <Trash2 size={12} /> Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: WATERCOOLERS */}
              {activeTab === 'watercoolers' && (
                <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '16px' }}>🚰 Purifier Stations & Watercooler Network</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
                    {watercoolers.map(wc => (
                      <div key={wc.id} style={{ background: 'var(--colors-surface-soft)', border: '1px solid var(--colors-hairline-strong)', borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ height: '140px', background: 'var(--colors-surface-dark)', position: 'relative' }}>
                          {wc.image ? (
                            <img src={wc.image} alt={wc.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF' }}>
                              🚰 HD Purifier Preview Image
                            </div>
                          )}
                          <div style={{ position: 'absolute', top: '8px', left: '8px', background: 'rgba(0, 0, 0, 0.7)', color: '#FFF', fontSize: '10px', fontWeight: 700, padding: '3px 8px', borderRadius: '9999px' }}>
                            {wc.id}
                          </div>
                        </div>

                        <div style={{ padding: '14px', flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          <h5 style={{ fontSize: '13px', fontWeight: 700, margin: 0 }}>{wc.name}</h5>
                          
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', fontSize: '11px' }}>
                            <div style={{ background: 'var(--colors-canvas)', padding: '6px', borderRadius: '6px', border: '1px solid var(--colors-hairline)' }}>
                              <span style={{ color: 'var(--colors-body)', display: 'block', fontSize: '9px' }}>Temp</span>
                              <strong>{wc.temperature}</strong>
                            </div>
                            <div style={{ background: 'var(--colors-canvas)', padding: '6px', borderRadius: '6px', border: '1px solid var(--colors-hairline)' }}>
                              <span style={{ color: 'var(--colors-body)', display: 'block', fontSize: '9px' }}>Purity</span>
                              <strong style={{ color: '#10B981' }}>{wc.purity}</strong>
                            </div>
                          </div>

                          <div style={{ fontSize: '11px', color: 'var(--colors-body)' }}>
                            📍 {wc.location_description}
                          </div>

                          <button 
                            type="button" 
                            onClick={async () => {
                              const newTemp = prompt("Enter Water Temperature (°C):", wc.temperature);
                              const newPurity = prompt("Enter Water Purity (%):", wc.purity);
                              const newStatus = prompt("Enter Purifier Status:", wc.status);
                              if (newTemp !== null && newPurity !== null && newStatus !== null) {
                                try {
                                  await apiService.saveWatercooler({
                                    ...wc,
                                    temperature: newTemp,
                                    purity: newPurity,
                                    status: newStatus
                                  });
                                  loadData();
                                  setStatusMsg({ type: 'success', text: `✅ Updated watercooler telemetry for "${wc.id}" successfully!` });
                                } catch (e) {
                                  alert("Error: Server Offline.");
                                }
                              }
                            }}
                            className="ollama-btn-primary" 
                            style={{ height: '32px', width: '100%', borderRadius: '8px', fontSize: '11px', marginTop: '6px' }}
                          >
                            ✏️ Edit Telemetry Specs
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        )}
      </div>
    </div>
  );
}

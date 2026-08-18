# CSJMU AI Summit 2026 & Smart Campus Digital Twin Platform
## Comprehensive Technical Documentation & Project Manual

---

## 1. Executive Summary

The **CSJMU AI Summit 2026 & Smart Campus Digital Twin Platform** (`ai-summit`) is a web application created for Chhatrapati Shahu Ji Maharaj University (CSJMU), Kanpur, Uttar Pradesh.

The application combines high-resolution Google Satellite/Hybrid GIS mapping, interactive 2D/3D digital twin canvases, Dijkstra graph shortest-path road routing, real-time HTML5 GPS tracking, Web Speech voice navigation, persistent user pin plotting via `localStorage`, an AI Event Co-Pilot, emergency SOS dispatch tools, and a multi-floor **SBM Building (School of Business Management) Digital Twin & Watercoolers Blueprint Explorer**.

---

## 2. Core Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | React 19 (`^19.2.8`) | Declarative UI component tree & reactive state management |
| **Bundler & Build Tool** | Vite 8 (`^8.2.0`) | Instant HMR development server & optimized production bundle |
| **Map & GIS Engine** | Leaflet (`^1.9.4`) | Google Hybrid, Google Satellite, ESRI HD tile rendering & polygon layers |
| **Iconography** | Lucide React (`^1.28.0`) | Modern SVG UI icons |
| **Voice & Speech** | Native Web Speech API | `SpeechSynthesis` turn guidance & `SpeechRecognition` voice search |
| **Persistence** | Native Web LocalStorage API | Custom pin plotting, coordinate overrides, and bookmarking |
| **Styling** | Vanilla CSS / Design Tokens | High contrast themes, glassmorphism, responsive grids & CSS keyframes |

---

## 3. Project Architecture & Directory Structure

```
AI_SUMMIT/
├── PROJECT_DOCUMENTATION.md      # Comprehensive technical documentation & project manual
├── README.md                      # Quickstart guide
├── package.json                   # Root package metadata & scripts
├── vercel.json                    # Vercel deployment configuration
└── frontend/                      # React Single Page Application (SPA)
    ├── index.html                 # HTML5 entry with font preloads & responsive meta tags
    ├── package.json               # Dependencies & scripts
    ├── vite.config.js             # Vite bundler configuration
    ├── public/
    │   ├── csjm_logo.png          # CSJMU University emblem
    │   └── assets/
    │       └── buildings/
    │           ├── auditorium.jpg # Auditorium building 3D render
    │           ├── senate.jpg     # Senate Hall 3D render
    │           ├── uiet.jpg       # UIET Engineering 3D render
    │           ├── watercooler_ro.jpg        # HD RO water dispenser image
    │           └── watercooler_touchless.jpg # HD touchless water station image
    └── src/
        ├── main.jsx                # React root rendering entry point
        ├── App.jsx                 # Top-level state coordinator & view manager
        ├── App.css                 # Global application styles & glassmorphism utilities
        ├── index.css               # Design system tokens, dark/light theme definitions
        ├── components/             # UI Component Library
        │   ├── AIAssistantModal.jsx       # Conversational AI event assistant & campus co-pilot
        │   ├── AccessibilityModal.jsx     # High contrast, large font & wheelchair options
        │   ├── Admin360DashboardModal.jsx # Custom 360 panorama upload & hotspot manager
        │   ├── Building3DViewerModal.jsx  # Interactive 3D perspective mesh viewer modal
        │   ├── BuildingDetailDrawer.jsx   # Detailed building inspector & department drawer
        │   ├── BuildingPlotterModal.jsx   # Custom pin creation & GIS coordinate plotter modal
        │   ├── CampusLifeStatusModal.jsx  # Canteen live queue & library occupancy meter
        │   ├── CampusShuttleModal.jsx     # E-Rickshaw live campus shuttle tracker
        │   ├── CampusStreetViewModal.jsx  # 360° panoramic street view explorer
        │   ├── DigitalTwinMap.jsx         # Dual-mode map container (Canvas 2D/Google Satellite)
        │   ├── EditLocationModal.jsx      # Modal to update pin details & custom coordinates
        │   ├── EventSessionsModal.jsx     # Summit agenda, speaker profiles & track filter
        │   ├── GoogleCampusMap.jsx        # Leaflet Google Hybrid/Satellite map & route renderer
        │   ├── HeaderNavbar.jsx           # Top header navigation, theme switchers & quick actions
        │   ├── ManagePinsModal.jsx        # Location pin manager, filter, clear & restoration tool
        │   ├── NavigationBanner.jsx       # Top navigation step alert banner
        │   ├── NavigationSidebar.jsx      # Single Navigation Card Block & Embedded Mini-Map
        │   ├── ParkingFinderModal.jsx     # Real-time campus parking slot availability
        │   ├── SBMBuildingIndoorModal.jsx # SBM Digital Twin & Watercoolers Blueprint Explorer
        │   ├── SearchBarAndActions.jsx    # Shortened search bar & smart action pill drawer
        │   ├── SenateHallVerticalPanel.jsx# Multi-floor 2D blueprint panel for Senate Hall
        │   ├── SplashScreen.jsx           # Animated brand intro screen
        │   ├── StallDetailDrawer.jsx      # Startup stall info drawer with direct navigation link
        │   └── StartupExhibitionModal.jsx # 20+ AI startup catalog, domain filter & demo schedule
        ├── data/
        │   ├── auditoriumData.js   # Campus locations, stalls, sessions & SBM_INDOOR_DATA
        │   └── streetViewData.js   # 360 degree campus node panoramas
        ├── hooks/
        │   └── useLiveNavigationVoice.js  # HTML5 GPS tracking, Haversine metrics & voice guidance
        └── utils/
            ├── locationStore.js    # LocalStorage store for custom pins, overrides & event bus
            └── pathfinding.js      # Dijkstra graph routing engine & campus road network
```

---

## 4. Detailed Feature & Component Breakdown

### 4.1 SBM Building Digital Twin & Watercoolers Blueprint Explorer (`src/components/SBMBuildingIndoorModal.jsx`)
- **Multi-Floor SVG/Canvas Blueprint Engine**: Renders interactive vector floor plans for Ground Floor (L0), First Floor (L1), and Second Floor (L2) of the School of Business Management (SBM).
- **Watercoolers Network & Telemetry (With HD Images)**:
  - Tracks all water purifiers (RO + UV 5-stage systems, touchless digital refill stations, cold water fountains).
  - Displays real-time metrics: Water temperature (°C), purity percentage (%), capacity (L/hr), filter status, and eco bottle counters.
  - Features dedicated HD image previews for each water cooler station (`watercooler_ro.jpg` and `watercooler_touchless.jpg`).
- **Classrooms, Keynote Halls & GPU Labs Directory**:
  - **SBM-01**: AI Keynote & Inauguration Hall (250 Seats)
  - **SBM-02**: Smart Classroom - Machine Learning Lab (60 Seats)
  - **SBM-03**: MBA Lecture Theatre 1 (120 Seats)
  - **SBM-04**: Digital Twin & Robotics Demo Room (45 Seats)
  - **SBM-102**: Deep Learning & Data Science GPU Lab (60 RTX 4090 Workstations)
  - **SBM-103**: AI Summit Startup Pitch Arena (150 Seats)
  - **SBM-201**: Generative AI & NLP Incubator Lab (40 Innovators)
- **Animated Neon Corridor Pathways**:
  - Draws central marble walkways, side corridors, emergency fire exits, staircases, and elevator lobbies.
  - Includes an **Indoor Corridor Pathfinder** to calculate step-by-step indoor walking paths from entrance gates or elevators to target rooms or watercoolers.

### 4.2 Main Application Controller (`src/App.jsx`)
- **Central State Hub**: Holds active `currentLocation` (defaulted to CSJMU Campus GPS: `26.4970° N, 80.2666° E`), selected `destination`, and navigation state `navMode` (`'hidden'` | `'preview'` | `'active'`).
- **Layout Coordinator**: Manages state for modals including SBM Building Indoor Blueprint (`showSBMIndoorModal`), AI Assistant, Startup Exhibition, Summit Agenda, Parking Finder, E-Rickshaw Shuttle, and Emergency SOS.

### 4.3 Navigation Sidebar & Live Tracking (`src/components/NavigationSidebar.jsx`)
- **Single Card Architecture**: Floating card block (`width: 420px`) providing live turn-by-turn routing.
- **Header Banner**: Maneuver turn arrows, target destination, voice mute toggle, and exit controls.
- **Embedded Mini Map**: Real-time Leaflet tracking showing position arrow, royal blue route line, destination marker, and 1-click `Re-centre` button.

### 4.4 Google Satellite & GIS Map Canvas (`src/components/GoogleCampusMap.jsx`)
- **Leaflet Layer Control**: Supports Google Hybrid Satellite, Google Pure Satellite, Esri HD Satellite, and Google Roadmap views.
- **Department Overlays**: Renders color-coded polygons for UIET Engineering, Pharmacy, Law, Medical, Arts, MBA, Basic Sciences, and Senate Block.
- **Custom Location Overrides**: Reads user pins from `localStorage` and customizes markers.

### 4.5 Persistent Location Store (`src/utils/locationStore.js`)
- Uses browser `localStorage` keys (`csjmu_custom_plotted_buildings`, `csjmu_location_latlng_overrides`, `csjmu_deleted_location_ids`) with window custom events (`csjmu_locations_updated`) for real-time reactivity across all map layers.

### 4.6 Graph Routing & Pathfinding Engine (`src/utils/pathfinding.js`)
- **Dijkstra Shortest Path Algorithm**: Calculates shortest paths across campus road graph nodes (`CSJMU_ROAD_NODES`).
- **Haversine Geodesic Distance**: Computes distance in meters, step counts (`steps = meters / 0.75`), and walking duration.

---

## 5. Data Schemas & Models

### SBM Building Floor Schema (`SBM_INDOOR_DATA`)
```json
{
  "buildingName": "School of Business Management (SBM)",
  "totalFloors": 3,
  "floors": [
    {
      "id": "ground",
      "name": "Ground Floor (L0)",
      "corridorName": "Central Atrium & Main Entry Corridor",
      "corridorLengthMeters": 180,
      "rooms": [
        {
          "id": "SBM-01",
          "name": "SBM-01: AI Keynote & Inauguration Hall",
          "type": "Hall / Auditorium",
          "capacity": "250 Seats",
          "equipment": "Dual 4K Laser Projectors, Surround Sound",
          "currentEvent": "Opening Ceremony & GenAI Keynote",
          "floor": "Ground Floor",
          "coordinates": { "x": 120, "y": 140 },
          "status": "Active Session"
        }
      ],
      "waterCoolers": [
        {
          "id": "SBM-WC-01",
          "name": "SBM Water Cooler #1 (Central Atrium RO Station)",
          "type": "Heavy-Duty 5-Stage RO + UV Purifier",
          "temperature": "6.0°C (Ice-Cold)",
          "purity": "99.9% Purified",
          "capacity": "80 Litres/Hr",
          "status": "Operational • Active",
          "image": "/assets/buildings/watercooler_ro.jpg",
          "locationDescription": "Ground Floor Central Atrium near SBM-02 ML Lab Entrance",
          "coordinates": { "x": 390, "y": 220 },
          "features": ["Touchless Hydration", "Digital Temperature Screen", "Chilled Cold Taps"]
        }
      ]
    }
  ]
}
```

---

## 6. Setup, Build & Deployment Guide

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Commands

```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Install project dependencies
npm install

# 3. Start local HMR development server
npm run dev

# 4. Build production bundle
npm run build

# 5. Preview production build locally
npm run preview
```

---

## 7. User Workflow & Navigation Manual

1. **Exploring SBM Building Rooms & Watercoolers**:
   - Click the **"🏢 SBM Indoor & Watercoolers"** pill button in the top navbar or quick actions bar.
   - Switch between **Ground Floor (L0)**, **First Floor (L1)**, and **Second Floor (L2)** floor plans.
   - Click any room or watercooler marker to inspect HD photos, water purity %, room capacity, and active AI Summit events.
   - Use the **Watercoolers Tab** to view all purified water stations across the building.
   - Use the **Indoor Corridor Pathfinder** to generate room-to-room walking paths along central corridors.
2. **Outdoor Campus GPS Routing**:
   - Select any destination building or stall from the search bar.
   - Click **START LIVE NAVIGATION** to initiate real-time GPS tracking and Web Speech voice turn guidance.

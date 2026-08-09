# CSJMU AI Summit 2026 & Smart Campus Digital Twin Platform
## Comprehensive Technical Documentation & Project Manual

---

## 1. Executive Summary

The **CSJMU AI Summit 2026 & Smart Campus Digital Twin Platform** (`ai-summit`) is a web application designed for Chhatrapati Shahu Ji Maharaj University (CSJMU), Kanpur. 

The application combines high-resolution Google Satellite/Hybrid GIS mapping, interactive 2D/3D digital twin canvases, Dijkstra graph shortest-path road routing, real-time HTML5 GPS tracking, Web Speech voice navigation, persistent user pin plotting via `localStorage`, an AI Event Co-Pilot, and emergency SOS dispatch tools.

---

## 2. Core Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | React 19 (`^19.2.8`) | Declarative UI component tree & state management |
| **Bundler & Build Tool** | Vite 8 (`^8.2.0`) | Fast HMR development server & production bundler |
| **Map & GIS Engine** | Leaflet (`^1.9.4`) | Google Hybrid, Google Satellite, ESRI HD tile rendering & Leaflet layers |
| **Iconography** | Lucide React (`^1.28.0`) | Modern UI icons |
| **Voice & Speech** | Native Web Speech API | `SpeechSynthesis` voice turn guidance & `SpeechRecognition` voice search |
| **Persistence** | Native Web LocalStorage API | Persistent custom pin plotting, coordinate overrides, and bookmarking |
| **Styling** | Vanilla CSS / Design Tokens | High contrast themes, glassmorphism, responsive grids & animations |

---

## 3. Project Architecture & Directory Structure

```
AI_SUMMIT/
├── index.html                  # Main HTML entry with font preloads & responsive meta tags
├── package.json                # Project dependencies, build scripts & metadata
├── vite.config.js              # Vite bundler configuration & React plugin options
├── public/                     # Static public assets
└── src/
    ├── main.jsx                # React root rendering entry point
    ├── App.jsx                 # Top-level state coordinator & main application view manager
    ├── App.css                 # Global application styles & glassmorphism utilities
    ├── index.css               # Design system tokens, dark/light theme definitions
    ├── components/             # UI Components
    │   ├── AIAssistantModal.jsx       # Conversational AI event assistant & campus co-pilot
    │   ├── AccessibilityModal.jsx     # High contrast, large font & wheelchair options
    │   ├── BuildingDetailDrawer.jsx   # Detailed building inspector & department info drawer
    │   ├── BuildingPlotterModal.jsx   # Custom pin creation & GIS coordinate plotter modal
    │   ├── DigitalTwinMap.jsx         # Dual-mode map container (Canvas 2D/Google Satellite)
    │   ├── EditLocationModal.jsx      # Modal to update pin details & custom coordinates
    │   ├── EventSessionsModal.jsx     # Summit agenda, speaker profiles & track filter
    │   ├── GoogleCampusMap.jsx        # Leaflet Google Hybrid/Satellite map & route renderer
    │   ├── HeaderNavbar.jsx           # Top header navigation, theme switchers & quick actions
    │   ├── ManagePinsModal.jsx        # Location pin manager, filter, clear & restoration tool
    │   ├── NavigationSidebar.jsx      # Single Navigation Card Block & Embedded Mini-Map
    │   ├── SearchBarAndActions.jsx    # Shortened search bar & smart action pill drawer
    │   ├── SenateHallVerticalPanel.jsx# Multi-floor 2D blueprint panel for Senate Hall
    │   ├── SplashScreen.jsx           # Animated brand intro screen
    │   ├── StallDetailDrawer.jsx      # Startup stall info drawer with direct navigation link
    │   └── StartupExhibitionModal.jsx # 20+ AI startup catalog, domain filter & demo schedule
    ├── data/
    │   └── auditoriumData.js   # Campus locations, stalls, sessions & summit data
    ├── hooks/
    │   └── useLiveNavigationVoice.js  # HTML5 GPS tracking, Haversine metrics & voice guidance
    └── utils/
        ├── locationStore.js    # LocalStorage store for custom pins, overrides & event bus
        └── pathfinding.js      # Dijkstra graph routing engine & campus road network
```

---

## 4. Detailed Component & Module Breakdown

### 4.1 Main Application Controller (`src/App.jsx`)
- **Central State Hub**: Holds active `currentLocation` (defaulted to CSJMU Campus GPS: `26.4970° N, 80.2666° E`), selected `destination`, and navigation state `navMode` (`'hidden'` | `'preview'` | `'active'`).
- **Conditional Layout Management**: Auto-hides top search bar when live navigation (`navMode === 'active'`) is running to ensure unobstructed map view.
- **Global Modals**: Coordinates AI Assistant, Startup Exhibition, Summit Agenda, Manage Pins, Building Plotter, Accessibility, and Emergency SOS modals.

### 4.2 Single Navigation Card Block & Embedded Live Tracking Map (`src/components/NavigationSidebar.jsx`)
- **Single Card Architecture**: Consolidates turn-by-turn navigation into one floating card block (`width: 420px`, `top: 20px`, `left: 20px`, `bottom: 20px`).
- **Upper Part (Green Header Banner `#004D40` / `#044E44`)**:
  - Displays maneuver turn arrow icon, target destination (`towards [Destination Name]`), maneuver step preview (`Then ↰`), voice mute toggle `(🔊)`, and exit route `(X)` button.
  - Fixed at the top with `flexShrink: 0`.
- **Lower Part (White Body `#FFFFFF`)**:
  - **Embedded Mini Tracking Map (`EmbeddedMiniTrackingMap`)**: Embedded Leaflet satellite map showing real-time GPS user position arrow (`⬆`), solid royal blue route line (`#1D4ED8`), destination badge (`📍 Destination`), and 1-click `▲ Re-centre` button.
  - **Bold Green ETA & Clock Subtext**: Large green walking time (`11 min 🌿`), total distance (`808 m • ETA 13:36`), and step counter (`1077 steps`).
  - **Voice Navigation Toggle**: Integrated `VOICE ON` / `MUTED` pill button.
  - **Step-by-Step Directions Drawer**: Expandable turn guidance list.

### 4.3 Google Satellite & GIS Map Canvas (`src/components/GoogleCampusMap.jsx`)
- **Leaflet Integration**: Renders real-time Google Hybrid Satellite tiles (`mt0`, `mt1`, `mt2`, `mt3`), Esri HD imagery, and Google Roadmap views.
- **Department Polygon Overlays**: Displays color-coded polygons for UIET Engineering, Pharmacy, Law, Medical, Arts, MBA, Basic Sciences, and Senate Block.
- **Dynamic User Markers**: Renders user-plotted pins from `localStorage`, custom location overrides, and destination callout badges (`📍 Destination Name`).
- **Recenter Listener**: Listens to custom event `csjmu_recenter_map` to fly the Leaflet camera smoothly to user position at zoom level 19.

### 4.4 Search Bar & Action Controls (`src/components/SearchBarAndActions.jsx`)
- **Shortened & Centered Form**: Styled with `width: 560px` centered in the middle of the viewport.
- **Auto-Suggest Dropdown**: Searches user-pinned campus locations and buildings with instant navigation selection.
- **Voice Search Mic**: Integrates Web Speech Recognition for hands-free destination search.

### 4.5 Persistent Location Store (`src/utils/locationStore.js`)
- **LocalStorage Data Keys**:
  - `csjmu_custom_plotted_buildings`: Stores custom pins dropped by the user.
  - `csjmu_location_latlng_overrides`: Stores coordinate updates.
  - `csjmu_deleted_location_ids`: Tracks deleted pin IDs.
- **Event Bus Sync**: Dispatches `csjmu_locations_updated` window custom event upon any pin addition, deletion, or modification, triggering instant re-renders across all active map layers.

### 4.6 Graph Routing & Pathfinding Engine (`src/utils/pathfinding.js`)
- **Dijkstra Shortest Path Algorithm**: Computes road-snapped shortest paths across campus road graph nodes (`CSJMU_ROAD_NODES`).
- **Haversine Distance**: Computes exact geodesic distance in meters, estimated walking steps (`steps = meters / 0.75`), and ETA walk duration (`mins = meters / 75`).

### 4.7 Geolocation & Voice Guidance Hook (`src/hooks/useLiveNavigationVoice.js`)
- **HTML5 Geolocation**: Continuously monitors user GPS coordinates via `navigator.geolocation.watchPosition`.
- **Speech Synthesis**: Speaks turn-by-turn navigation instructions when navigation starts or steps advance.

---

## 5. Setup, Build & Deployment Instructions

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Commands

```bash
# 1. Install project dependencies
npm install

# 2. Start local HMR development server
npm run dev

# 3. Build production bundle
npm run build

# 4. Preview production build locally
npm run preview
```

---

## 6. Project Workings & User Flow Summary

1. **Clean Slate & Custom Pin Plotting**:
   - The user starts with a clean satellite map. Clicking **Pin Location** or clicking directly on the map drops a pin and saves it permanently to `localStorage`.
2. **Destination Selection & Route Preview**:
   - Selecting a destination from the search bar or clicking a pinned marker opens the Route Preview box with distance, walking time, and step metrics.
3. **Live Turn-by-Turn Navigation**:
   - Clicking **START LIVE NAVIGATION** opens the Single Navigation Card Block.
   - The top search bar automatically hides for an unobstructed map view.
   - The card displays the top green header banner, integrated live mini-map tracking your movement along the royal blue route line, green ETA, distance, voice toggle, and step guidance.

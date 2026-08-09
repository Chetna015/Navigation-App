# CSJMU AI Summit 2026 & Smart Campus Digital Twin Platform

An enterprise-grade, real-time 2D/3D indoor/outdoor satellite GIS mapping, wayfinding, and event intelligence application built for Chhatrapati Shahu Ji Maharaj University (CSJMU), Kanpur.

---

## 🌟 Key Features

- 🛰️ **Google Hybrid & Satellite GIS Engine**: Real-time Leaflet Google Hybrid Satellite, ESRI HD, and Roadmap tile views with department polygon boundaries.
- 🗺️ **Dual-Engine Digital Twin Canvas**: Interactive 2D/3D vector canvas for indoor auditoriums, stalls, stage setups, and multi-floor blueprints.
- 🚶 **Dijkstra Road Pathfinding**: Snaps routes to campus road networks with exact Haversine distance, step counts, and walking ETAs.
- 🧭 **Single Navigation Card Block**: Live turn-by-turn navigation card featuring a top dark-teal direction banner, green ETA (`11 min 🌿`), and an embedded live tracking mini satellite map.
- 📍 **Persistent Custom Pin Plotting**: Drop and manage custom location pins with instant `localStorage` persistence and cross-session saving.
- 🗣️ **Voice Navigation Co-Pilot**: Hands-free voice guidance powered by Web Speech Synthesis and Web Speech Recognition.
- 🤖 **AI Event Assistant**: Conversational AI co-pilot answering summit queries, recommending talks, and navigating to venues.
- 🚀 **Startup Exhibition & Summit Agenda**: Detailed catalog of 20+ AI startups, keynote speaker schedules, and track filters.
- 🚑 **Emergency SOS Dispatch**: 1-click emergency alert with instant routing to the nearest campus medical post.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, Vite 8, JavaScript (ES6+)
- **Mapping & GIS**: Leaflet 1.9.4, Google Satellite & Hybrid Tiles
- **Icons**: Lucide React
- **Voice / Audio**: Web Speech API (`SpeechSynthesis` & `SpeechRecognition`)
- **Persistence**: Web LocalStorage API & Custom Reactive Event Bus
- **Styling**: Vanilla CSS, Glassmorphism, Dark/Light & High Contrast Themes

---

## 🚀 Quick Start

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Build for production
npm run build
```

---

## 📄 Documentation

For full architecture details, component breakdown, Dijkstra routing specs, and LocalStorage data schemas, refer to [`PROJECT_DOCUMENTATION.md`](./PROJECT_DOCUMENTATION.md).

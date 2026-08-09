/**
 * CSJMU Smart Campus 360° Interactive Street View Graph Dataset
 * Maps physical campus coordinates to 360 equirectangular images & directional hotspots.
 */

import { haversineDistanceMeters } from '../utils/haversine';

export const FALLBACK_STREET_VIEW = {
  id: "fallback_default",
  name: "CSJMU Main Campus Grounds 360°",
  category: "Campus Grounds",
  lat: 26.4970,
  lng: 80.2666,
  panoramaUrl: "https://photo-sphere-viewer-data.netlify.app/assets/sphere.jpg",
  thumbnail: "https://photo-sphere-viewer-data.netlify.app/assets/sphere.jpg",
  description: "360-degree panoramic view of CSJMU Central Campus Grounds & Gateway.",
  hotspots: [
    {
      targetNodeId: "main_gate",
      pitch: -2,
      yaw: 0,
      text: "Head to CSJMU Main Gate 1"
    },
    {
      targetNodeId: "uiet_entrance",
      pitch: 5,
      yaw: 120,
      text: "Walk to UIET Engineering School"
    }
  ]
};

export const CAMPUS_STREET_VIEW_NODES = {
  main_gate: {
    id: "main_gate",
    name: "CSJMU Main Gate 1 (GT Road)",
    category: "Campus Gateway",
    lat: 26.4969,
    lng: 80.2666,
    panoramaUrl: "https://photo-sphere-viewer-data.netlify.app/assets/sphere.jpg",
    description: "360-degree panoramic view of Main Gate 1 entrance on GT Road.",
    hotspots: [
      {
        targetNodeId: "senate_hall",
        pitch: -2,
        yaw: 45,
        text: "Walk to Senate Hall Admin Complex"
      },
      {
        targetNodeId: "auditorium_arena",
        pitch: 2,
        yaw: 310,
        text: "Walk to Grand Auditorium Arena"
      }
    ]
  },

  senate_hall: {
    id: "senate_hall",
    name: "Senate Hall & Executive Complex",
    category: "Administrative Block",
    lat: 26.4965,
    lng: 80.2662,
    panoramaUrl: "https://photo-sphere-viewer-data.netlify.app/assets/sphere.jpg",
    description: "360-degree panoramic view of Senate Hall administrative lawns & Vice-Chancellor block.",
    hotspots: [
      {
        targetNodeId: "main_gate",
        pitch: 0,
        yaw: 225,
        text: "Return to Main Gate 1"
      },
      {
        targetNodeId: "auditorium_arena",
        pitch: 4,
        yaw: 20,
        text: "Walk towards Grand Auditorium"
      }
    ]
  },

  auditorium_arena: {
    id: "auditorium_arena",
    name: "CSJMU Grand Auditorium Arena",
    category: "AI Summit Venue",
    lat: 26.4983,
    lng: 80.2658,
    panoramaUrl: "https://photo-sphere-viewer-data.netlify.app/assets/sphere-cellar.jpg",
    description: "360-degree panoramic view of CSJMU Grand Auditorium main hall & AI Summit stage.",
    hotspots: [
      {
        targetNodeId: "senate_hall",
        pitch: -5,
        yaw: 200,
        text: "Walk to Senate Hall"
      },
      {
        targetNodeId: "central_library",
        pitch: 2,
        yaw: 45,
        text: "Walk to Central Library"
      },
      {
        targetNodeId: "uiet_entrance",
        pitch: 0,
        yaw: 90,
        text: "Walk to UIET Engineering School"
      }
    ]
  },

  central_library: {
    id: "central_library",
    name: "Central Library & Knowledge Hub",
    category: "Library Block",
    lat: 26.4990,
    lng: 80.2670,
    panoramaUrl: "https://photo-sphere-viewer-data.netlify.app/assets/sphere.jpg",
    description: "360-degree panoramic view of Central Library main courtyard and digital resource hall.",
    hotspots: [
      {
        targetNodeId: "auditorium_arena",
        pitch: -2,
        yaw: 225,
        text: "Return to Grand Auditorium"
      },
      {
        targetNodeId: "uiet_entrance",
        pitch: 3,
        yaw: 350,
        text: "Walk to UIET Engineering Entrance"
      }
    ]
  },

  uiet_entrance: {
    id: "uiet_entrance",
    name: "UIET School of Engineering Entrance",
    category: "Academic Block",
    lat: 26.5005,
    lng: 80.2675,
    panoramaUrl: "https://photo-sphere-viewer-data.netlify.app/assets/sphere.jpg",
    description: "360-degree panoramic view of UIET Engineering building entrance & AI labs foyer.",
    hotspots: [
      {
        targetNodeId: "central_library",
        pitch: -4,
        yaw: 170,
        text: "Walk to Central Library"
      },
      {
        targetNodeId: "auditorium_arena",
        pitch: 0,
        yaw: 270,
        text: "Walk to Grand Auditorium"
      }
    ]
  }
};

export const CAMPUS_STREET_VIEW_LOCATIONS = Object.values(CAMPUS_STREET_VIEW_NODES);

/**
 * Calculates Haversine distance and returns the nearest mapped 360° street view node
 */
export function getNearestStreetViewLocation(lat, lng) {
  if (!lat || !lng) return FALLBACK_STREET_VIEW;

  let minDistance = Infinity;
  let closestLocation = FALLBACK_STREET_VIEW;

  CAMPUS_STREET_VIEW_LOCATIONS.forEach((loc) => {
    const dist = haversineDistanceMeters(lat, lng, loc.lat, loc.lng);
    if (dist < minDistance) {
      minDistance = dist;
      closestLocation = { ...loc, distanceMeters: dist };
    }
  });

  if (minDistance <= 1000) {
    return closestLocation;
  }

  return { ...FALLBACK_STREET_VIEW, distanceMeters: Math.round(minDistance) };
}

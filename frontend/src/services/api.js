import { getApiBaseUrl } from '../utils/apiConfig';

const API_BASE = getApiBaseUrl();

export const apiService = {
  // Admin Authentication
  login: async (username, password) => {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    return res.json();
  },

  // File Upload (Cover photos, videos, 360 panoramas)
  uploadFile: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE}/api/upload`, {
      method: 'POST',
      body: formData
    });
    return res.json();
  },

  // Locations CRUD (GIS Map Pins)
  getLocations: async () => {
    const res = await fetch(`${API_BASE}/api/locations`);
    return res.json();
  },

  saveLocation: async (payload) => {
    const res = await fetch(`${API_BASE}/api/locations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  deleteLocation: async (id) => {
    const res = await fetch(`${API_BASE}/api/locations/${id}`, {
      method: 'DELETE'
    });
    return res.json();
  },

  // Rooms CRUD (SBM Classrooms)
  getRooms: async () => {
    const res = await fetch(`${API_BASE}/api/rooms`);
    return res.json();
  },

  saveRoom: async (payload) => {
    const res = await fetch(`${API_BASE}/api/rooms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  deleteRoom: async (id) => {
    const res = await fetch(`${API_BASE}/api/rooms/${id}`, {
      method: 'DELETE'
    });
    return res.json();
  },

  // Watercoolers CRUD (SBM telemetry)
  getWatercoolers: async () => {
    const res = await fetch(`${API_BASE}/api/watercoolers`);
    return res.json();
  },

  saveWatercooler: async (payload) => {
    const res = await fetch(`${API_BASE}/api/watercoolers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  deleteWatercooler: async (id) => {
    const res = await fetch(`${API_BASE}/api/watercoolers/${id}`, {
      method: 'DELETE'
    });
    return res.json();
  }
};

// Location Overrides & Coordinate Management Utility
import { MAP_LOCATIONS } from '../data/auditoriumData';
import { DEFAULT_CAMPUS_BUILDINGS, getStoredPlottedBuildings } from './pathfinding';

const STORAGE_KEY = 'csjmu_location_latlng_overrides';

/**
 * Retrieve all custom location coordinate overrides stored in LocalStorage
 */
export function getLocationOverrides() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch (e) {
    console.error("Failed to parse location overrides from LocalStorage", e);
    return {};
  }
}

/**
 * Save an updated location override (Lat, Lng, Name, Category, etc.)
 */
export function saveLocationOverride(id, updatedData) {
  const existing = getLocationOverrides();
  existing[id] = {
    ...existing[id],
    ...updatedData,
    updatedAt: new Date().toISOString()
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
    // Dispatch window custom event so all listeners/maps reload coordinates in real-time
    window.dispatchEvent(new CustomEvent('csjmu_locations_updated', { detail: existing }));
  } catch (e) {
    console.error("Failed to save location override to LocalStorage", e);
  }

  return existing[id];
}

/**
 * Reset a single location back to default coordinates
 */
export function resetLocationOverride(id) {
  const existing = getLocationOverrides();
  delete existing[id];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
    window.dispatchEvent(new CustomEvent('csjmu_locations_updated', { detail: existing }));
  } catch (e) {
    console.error("Failed to reset location override", e);
  }
}

/**
 * Reset ALL location overrides
 */
export function resetAllLocationOverrides() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent('csjmu_locations_updated', { detail: {} }));
  } catch (e) {
    console.error("Failed to reset all location overrides", e);
  }
}

const DELETED_KEY = 'csjmu_deleted_location_ids';

/**
 * Retrieve list of location IDs marked as removed/deleted by user
 */
export function getDeletedLocationIds() {
  try {
    const raw = localStorage.getItem(DELETED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

/**
 * Mark a location as removed/deleted
 */
export function hideOrDeleteLocation(id) {
  const deleted = getDeletedLocationIds();
  if (!deleted.includes(id)) {
    deleted.push(id);
    try {
      localStorage.setItem(DELETED_KEY, JSON.stringify(deleted));
      window.dispatchEvent(new CustomEvent('csjmu_locations_updated', { detail: { deleted } }));
    } catch (e) {
      console.error(e);
    }
  }
}

/**
 * Restore all deleted locations
 */
export function restoreAllDeletedLocations() {
  try {
    localStorage.removeItem(DELETED_KEY);
    window.dispatchEvent(new CustomEvent('csjmu_locations_updated', { detail: {} }));
  } catch (e) {
    console.error(e);
  }
}

/**
 * Get merged Campus Buildings object using default buildings, user custom pins, and location overrides, minus deleted locations.
 * Ensures duplicate named locations are merged into a single unique pinpoint.
 */
export function getMergedCampusBuildings() {
  const overrides = getLocationOverrides();
  const custom = getStoredPlottedBuildings();
  const deleted = getDeletedLocationIds();

  const rawList = [];

  (MAP_LOCATIONS || []).forEach(loc => {
    if (loc && loc.id) {
      rawList.push({ ...loc });
    }
  });

  Object.values(DEFAULT_CAMPUS_BUILDINGS || {}).forEach(loc => {
    if (loc && loc.id) {
      rawList.push({ ...loc });
    }
  });

  Object.values(custom || {}).forEach(loc => {
    if (loc && loc.id) {
      rawList.push({ ...loc, isCustom: true });
    }
  });

  const buildings = {};
  const seenNames = new Set();

  rawList.forEach(loc => {
    if (!loc || !loc.name) return;
    const norm = loc.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (seenNames.has(norm)) return; // skip duplicate name
    seenNames.add(norm);

    let finalLoc = { ...loc };
    if (overrides && overrides[loc.id]) {
      finalLoc = { ...finalLoc, ...overrides[loc.id] };
    }
    buildings[loc.id] = finalLoc;
  });

  (deleted || []).forEach(id => {
    delete buildings[id];
  });

  return buildings;
}

/**
 * Get merged MAP_LOCATIONS array using default locations, custom pins, and overrides, minus deleted locations.
 * Automatically deduplicates locations sharing the same name.
 */
export function getMergedMapLocations() {
  const allBuildings = Object.values(getMergedCampusBuildings());
  const seenNames = new Set();
  const deduplicated = [];

  for (const loc of allBuildings) {
    if (!loc || !loc.name) continue;
    // Normalize name e.g. "Girls Hostel" -> "girlshostel"
    const norm = loc.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (!seenNames.has(norm)) {
      seenNames.add(norm);
      deduplicated.push(loc);
    }
  }

  return deduplicated;
}

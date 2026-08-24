/**
 * Haversine Formula Utility for CSJMU Campus GPS Distance Calculations
 */

/**
 * Calculates distance in meters between two geographical coordinates (lat/lng)
 */
export function haversineDistanceMeters(lat1, lon1, lat2, lon2) {
  if (lat1 === undefined || lon1 === undefined || lat2 === undefined || lon2 === undefined) {
    return Infinity;
  }
  const R = 6371000; // Earth radius in meters
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

/**
 * Estimates realistic road network pedestrian walking distance in meters (~1.25x road factor)
 */
export function estimateWalkingDistanceMeters(lat1, lon1, lat2, lon2) {
  const directMeters = haversineDistanceMeters(lat1, lon1, lat2, lon2);
  if (!isFinite(directMeters) || directMeters <= 0) return 0;
  if (directMeters <= 30) return directMeters;
  return Math.round(directMeters * 1.25);
}

/**
 * Finds the nearest 360° street view node from a dictionary/list of nodes given lat/lng
 */
export function findNearestStreetViewNode(lat, lng, nodesList = [], fallbackNode = null) {
  if (!lat || !lng || !nodesList || nodesList.length === 0) {
    return fallbackNode;
  }

  let minDistance = Infinity;
  let nearestNode = fallbackNode || nodesList[0];

  nodesList.forEach((node) => {
    const dist = haversineDistanceMeters(lat, lng, node.lat, node.lng);
    if (dist < minDistance) {
      minDistance = dist;
      nearestNode = { ...node, distanceMeters: dist };
    }
  });

  return nearestNode;
}

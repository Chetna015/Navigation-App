import { describe, it, expect } from 'vitest';
import { haversineDistanceMeters, estimateWalkingDistanceMeters, findNearestStreetViewNode } from './haversine';

describe('Haversine Distance Calculations', () => {
  it('correctly calculates geographical distance between SBM Gate and Auditorium Entrance', () => {
    // SBM Entrance: 26.503022, 80.266371
    // Auditorium Entrance: 26.50410, 80.26830
    const distance = haversineDistanceMeters(26.503022, 80.266371, 26.50410, 80.26830);
    
    // Checked distance is roughly 228 meters
    expect(distance).toBeGreaterThan(210);
    expect(distance).toBeLessThan(250);
  });

  it('returns Infinity when coordinate arguments are missing', () => {
    expect(haversineDistanceMeters(26.5, 80.2)).toBe(Infinity);
  });

  it('returns 0 for identical points', () => {
    expect(haversineDistanceMeters(26.5, 80.2, 26.5, 80.2)).toBe(0);
  });
});

describe('Pedestrian Walking Estimation', () => {
  it('estimates realistic walking distance using road scaling factor', () => {
    const directMeters = haversineDistanceMeters(26.503022, 80.266371, 26.50410, 80.26830);
    const estimatedWalk = estimateWalkingDistanceMeters(26.503022, 80.266371, 26.50410, 80.26830);
    
    expect(estimatedWalk).toBe(Math.round(directMeters * 1.25));
  });

  it('does not scale short distances (<30 meters)', () => {
    const direct = haversineDistanceMeters(26.50300, 80.26637, 26.50310, 80.26637);
    const walk = estimateWalkingDistanceMeters(26.50300, 80.26637, 26.50310, 80.26637);
    
    if (direct <= 30) {
      expect(walk).toBe(direct);
    }
  });
});

describe('Nearest 360° Node Locator', () => {
  it('finds the closest photographic node from a set of target nodes', () => {
    const nodes = [
      { id: 'node_1', lat: 26.5000, lng: 80.2600 },
      { id: 'node_2', lat: 26.5020, lng: 80.2640 },
      { id: 'node_3', lat: 26.5050, lng: 80.2680 }
    ];
    
    // Closest to SBM (26.5030, 80.2663) should be node_3 or node_2
    const nearest = findNearestStreetViewNode(26.5030, 80.2663, nodes);
    expect(nearest.id).toBe('node_2');
  });
});

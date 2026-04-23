import type { Coordinates, SafetyScore, RiskFactor } from '../types';

// Distance calculation (Haversine formula)
export function calculateDistance(
  coord1: Coordinates,
  coord2: Coordinates
): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (coord1.latitude * Math.PI) / 180;
  const φ2 = (coord2.latitude * Math.PI) / 180;
  const Δφ = ((coord2.latitude - coord1.latitude) * Math.PI) / 180;
  const Δλ = ((coord2.longitude - coord1.longitude) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}

// Format distance
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)}m`;
  }
  return `${(meters / 1000).toFixed(1)}km`;
}

// Format duration
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

// Calculate safety score
export function calculateSafetyScore(
  roadQuality: number,
  traffic: number,
  weather: number,
  contextual: number
): SafetyScore {
  const overall = Math.round(
    roadQuality * 0.4 + traffic * 0.2 + weather * 0.2 + contextual * 0.2
  );

  return {
    overall,
    roadQuality,
    traffic,
    weather,
    contextual,
  };
}

// Get risk color
export function getRiskColor(score: number): string {
  if (score >= 80) return '#10B981'; // Green - Safe
  if (score >= 60) return '#F59E0B'; // Amber - Moderate
  return '#EF4444'; // Red - High risk
}

// Get risk level text
export function getRiskLevel(score: number): 'low' | 'medium' | 'high' {
  if (score >= 80) return 'low';
  if (score >= 60) return 'medium';
  return 'high';
}

// Check if location is in Chennai
export function isInChennai(lat: number, lng: number): boolean {
  // Chennai approximate bounds
  const bounds = {
    north: 13.2,
    south: 12.9,
    east: 80.4,
    west: 80.1,
  };

  return (
    lat >= bounds.south &&
    lat <= bounds.north &&
    lng >= bounds.west &&
    lng <= bounds.east
  );
}

// Get current time context
export function getTimeContext(): {
  isRushHour: boolean;
  isSchoolHours: boolean;
  isNight: boolean;
} {
  const hour = new Date().getHours();

  return {
    isRushHour: (hour >= 8 && hour <= 10) || (hour >= 17 && hour <= 19),
    isSchoolHours: hour >= 7 && hour <= 16,
    isNight: hour >= 22 || hour <= 5,
  };
}

// Generate unique ID
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Debounce function
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Local storage helpers
export const storage = {
  set(key: string, value: any) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Storage set error:', error);
    }
  },

  get(key: string) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Storage get error:', error);
      return null;
    }
  },

  remove(key: string) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Storage remove error:', error);
    }
  },

  clear() {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Storage clear error:', error);
    }
  },
};
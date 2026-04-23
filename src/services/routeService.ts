import { mapboxService } from './mapbox';
import { weatherService } from './weather';
import { getPotholesInArea } from '../data/potholes';
import { calculateSafetyScore, getTimeContext } from '../utils';
import type { Route, Coordinates, SafetyScore } from '../types';

export const routeService = {
  async calculateRoutes(
    start: Coordinates,
    end: Coordinates
  ): Promise<Route[]> {
    try {
      // Get base route from mapping service
      const baseRoute = await mapboxService.getDirections(
        [start.longitude, start.latitude],
        [end.longitude, end.latitude]
      );

      if (!baseRoute) {
        throw new Error('Could not calculate route');
      }

      // Get weather data
      const weather = await weatherService.getCurrentWeather(
        start.latitude,
        start.longitude
      );

      // Calculate 3 route variants with different priorities
      const routes = await Promise.all([
        calculateSafestRoute(start, end, baseRoute, weather),
        calculateBalancedRoute(start, end, baseRoute, weather),
        calculateFastestRoute(start, end, baseRoute, weather),
      ]);

      return routes;
    } catch (error) {
      console.error('Route calculation error:', error);
      throw error;
    }
  },
};

// Calculate safest route (prioritizes safety over speed)
async function calculateSafestRoute(
  start: Coordinates,
  end: Coordinates,
  baseRoute: any,
  weather: any
): Promise<Route> {
  const distance = baseRoute.distance;
  const duration = baseRoute.duration;

  // Get potholes along route (5km radius)
  const potholes = getPotholesInArea(
    start.latitude,
    start.longitude,
    5
  );

  // Calculate safety factors
  const roadQuality = calculateRoadQualitySafest(potholes, distance);
  // Get real traffic data
const traffic = await mapboxService.getTrafficData([
  start.longitude,
  start.latitude,
]);
  const weatherScore = weather ? getWeatherScore(weather) : 85;
  const contextual = getContextualScore();

  const safetyScore = calculateSafetyScore(
    roadQuality,
    traffic,
    weatherScore,
    contextual
  );

  return {
    id: 'route-safest',
    startLocation: start,
    endLocation: end,
    distance: distance * 1.15, // Safest route may be 15% longer
    duration: duration * 1.2, // Takes 20% more time
    safetyScore: safetyScore.overall,
    routeType: 'safest',
    geometry: baseRoute.geometry,
    steps: [],
    riskFactors: [],
    potholes: potholes,
    createdAt: new Date().toISOString(),
  };
}

// Calculate balanced route (balance between safety and speed)
async function calculateBalancedRoute(
  start: Coordinates,
  end: Coordinates,
  baseRoute: any,
  weather: any
): Promise<Route> {
  const distance = baseRoute.distance;
  const duration = baseRoute.duration;

  const potholes = getPotholesInArea(start.latitude, start.longitude, 5);

  const roadQuality = calculateRoadQualityBalanced(potholes, distance);
  const traffic = await mapboxService.getTrafficData([
  start.longitude,
  start.latitude,
]);
  const weatherScore = weather ? getWeatherScore(weather) : 75;
  const contextual = getContextualScore();

  const safetyScore = calculateSafetyScore(
    roadQuality,
    traffic,
    weatherScore,
    contextual
  );

  return {
    id: 'route-balanced',
    startLocation: start,
    endLocation: end,
    distance: distance * 1.05, // 5% longer than fastest
    duration: duration * 1.1, // 10% more time
    safetyScore: safetyScore.overall,
    routeType: 'balanced',
    geometry: baseRoute.geometry,
    steps: [],
    riskFactors: [],
    potholes: potholes,
    createdAt: new Date().toISOString(),
  };
}

// Calculate fastest route (prioritizes speed)
async function calculateFastestRoute(
  start: Coordinates,
  end: Coordinates,
  baseRoute: any,
  weather: any
): Promise<Route> {
  const distance = baseRoute.distance;
  const duration = baseRoute.duration;

  const potholes = getPotholesInArea(start.latitude, start.longitude, 5);

  const roadQuality = calculateRoadQualityFastest(potholes, distance);
 const traffic = await mapboxService.getTrafficData([
  start.longitude,
  start.latitude,
]);
  const weatherScore = weather ? getWeatherScore(weather) : 70;
  const contextual = getContextualScore();

  const safetyScore = calculateSafetyScore(
    roadQuality,
    traffic,
    weatherScore,
    contextual
  );

  return {
    id: 'route-fastest',
    startLocation: start,
    endLocation: end,
    distance: distance,
    duration: duration,
    safetyScore: safetyScore.overall,
    routeType: 'fastest',
    geometry: baseRoute.geometry,
    steps: [],
    riskFactors: [],
    potholes: potholes,
    createdAt: new Date().toISOString(),
  };
}

// Road quality calculation for safest route
function calculateRoadQualitySafest(potholes: any[], distance: number): number {
  const potholeCount = potholes.length;
  const distanceKm = distance / 1000;
  const density = potholeCount / distanceKm;

  // Safest route avoids potholes aggressively
  if (density === 0) return 100;
  if (density < 0.3) return 95;
  if (density < 0.5) return 88;
  if (density < 1.0) return 75;
  if (density < 2.0) return 60;
  return 45;
}

// Road quality calculation for balanced route
function calculateRoadQualityBalanced(potholes: any[], distance: number): number {
  const potholeCount = potholes.length;
  const distanceKm = distance / 1000;
  const density = potholeCount / distanceKm;

  if (density === 0) return 95;
  if (density < 0.5) return 85;
  if (density < 1.0) return 70;
  if (density < 2.0) return 55;
  return 40;
}

// Road quality calculation for fastest route
function calculateRoadQualityFastest(potholes: any[], distance: number): number {
  const potholeCount = potholes.length;
  const distanceKm = distance / 1000;
  const density = potholeCount / distanceKm;

  // Fastest route tolerates more potholes
  if (density === 0) return 90;
  if (density < 1.0) return 75;
  if (density < 2.0) return 60;
  if (density < 3.0) return 45;
  return 30;
}

// Get weather risk score
function getWeatherScore(weather: any): number {
  const riskLevel = weather.riskLevel;

  if (riskLevel === 'low') return 90;
  if (riskLevel === 'medium') return 65;
  return 35; // high risk
}

// Get contextual score based on time and location
function getContextualScore(): number {
  const context = getTimeContext();

  let score = 85; // Base score

  if (context.isRushHour) score -= 15;
  if (context.isSchoolHours) score -= 10;
  if (context.isNight) score -= 20;

  return Math.max(score, 30);
}
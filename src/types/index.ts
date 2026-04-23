// User Types
export interface User {
  id: string;
  email?: string;
  phone?: string;
  name: string;
  profilePhoto?: string;
  emergencyContacts: EmergencyContact[];
  preferences: UserPreferences;
  createdAt: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
}

export interface UserPreferences {
  language: 'en' | 'ta' | 'hi';
  voiceSpeed: number;
  voiceVolume: number;
  voiceGender: 'male' | 'female';
  mapTheme: 'light' | 'dark' | 'satellite';
  showTrafficLayer: boolean;
  safetyPreference: 'safest' | 'balanced' | 'fastest';
  avoidPotholes: boolean;
  avoidSchoolZones: boolean;
  avoidMarkets: boolean;
}

// Location Types
export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Location extends Coordinates {
  address?: string;
  placeName?: string;
}

// Route Types
export interface Route {
  id: string;
  startLocation: Location;
  endLocation: Location;
  distance: number; // in meters
  duration: number; // in seconds
  safetyScore: number; // 0-100
  routeType: 'safest' | 'balanced' | 'fastest';
  geometry: any; // GeoJSON
  steps: RouteStep[];
  riskFactors: RiskFactor[];
  potholes: Pothole[];
  createdAt: string;
}

export interface RouteStep {
  instruction: string;
  distance: number;
  duration: number;
  coordinates: Coordinates;
}

// Safety Types
export interface RiskFactor {
  type: 'pothole' | 'traffic' | 'weather' | 'school' | 'market';
  severity: 'low' | 'medium' | 'high';
  location: Coordinates;
  description: string;
  timestamp?: string;
}

export interface Pothole {
  id: string;
  location: Coordinates;
  severity: 'low' | 'medium' | 'high';
  reportedBy?: string;
  reportedAt: string;
  verified: boolean;
}

export interface SafetyScore {
  overall: number;
  roadQuality: number;
  traffic: number;
  weather: number;
  contextual: number;
}

// Weather Types
export interface Weather {
  condition: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  visibility: number;
  riskLevel: 'low' | 'medium' | 'high';
  lastUpdated: string;
}

// Navigation Types
export interface NavigationState {
  isNavigating: boolean;
  currentRoute: Route | null;
  currentLocation: Coordinates | null;
  nextInstruction: string;
  distanceToNextTurn: number;
  eta: string;
}

// App State Types
export interface AppState {
  isLoading: boolean;
  error: string | null;
  isOnline: boolean;
}
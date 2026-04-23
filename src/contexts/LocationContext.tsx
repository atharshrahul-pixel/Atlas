import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Coordinates } from '../types';

interface LocationContextType {
  currentLocation: Coordinates | null;
  loading: boolean;
  error: string | null;
  requestLocation: () => void;
  watchLocation: () => void;
  stopWatching: () => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLocation, setCurrentLocation] = useState<Coordinates | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [watchId, setWatchId] = useState<number | null>(null);

  const handleSuccess = (position: GeolocationPosition) => {
    setCurrentLocation({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    });
    setLoading(false);
    setError(null);
  };

  const handleError = (err: GeolocationPositionError) => {
    console.log('Location denied, using Chennai default coordinates');
    // Use Chennai default coordinates when location is denied
    setCurrentLocation({
      latitude: 13.0827,
      longitude: 80.2707,
    });
    setError(null); // Clear error since we have fallback
    setLoading(false);
  };

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    });
  };

  const watchLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setLoading(true);
    const id = navigator.geolocation.watchPosition(handleSuccess, handleError, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    });
    setWatchId(id);
  };

  const stopWatching = () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
  };

  useEffect(() => {
    // Request location on mount
    requestLocation();

    return () => {
      stopWatching();
    };
  }, []);

  return (
    <LocationContext.Provider
      value={{
        currentLocation,
        loading,
        error,
        requestLocation,
        watchLocation,
        stopWatching,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within LocationProvider');
  }
  return context;
};
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useLocation as useUserLocation } from '../contexts/LocationContext';
import { routeService } from '../services/routeService';
import RouteCard from '../components/common/RouteCard';
import { ArrowLeft, Loader, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Route, Coordinates } from '../types';

const RoutePlanning: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const { currentLocation } = useUserLocation();

  const [routes, setRoutes] = useState<Route[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [loading, setLoading] = useState(false);
  const [destination, setDestination] = useState<Coordinates | null>(null);
  const [destinationName, setDestinationName] = useState('');

  useEffect(() => {
    // Get destination from navigation state
    const state = location.state as any;
    if (state?.destination) {
      setDestination(state.destination);
      setDestinationName(state.destinationName || 'Selected Location');
      calculateRoutes(state.destination);
    }
  }, [location.state]);

  const calculateRoutes = async (dest: Coordinates) => {
    if (!currentLocation) {
      toast.error('Current location not available');
      return;
    }

    setLoading(true);
    try {
      const calculatedRoutes = await routeService.calculateRoutes(
        currentLocation,
        dest
      );
      setRoutes(calculatedRoutes);
      // Auto-select safest route
      setSelectedRoute(calculatedRoutes.find(r => r.routeType === 'safest') || calculatedRoutes[0]);
      toast.success('Routes calculated successfully!');
    } catch (error) {
      console.error('Route calculation error:', error);
      toast.error('Failed to calculate routes');
    } finally {
      setLoading(false);
    }
  };

  const handleStartNavigation = () => {
    if (!selectedRoute) {
      toast.error('Please select a route');
      return;
    }

    navigate('/navigate', {
      state: {
        route: selectedRoute,
        destination: destination,
        destinationName: destinationName,
      },
    });
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md p-4">
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={handleBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900">Plan Your Route</h1>
            <p className="text-sm text-gray-600">Choose the safest path</p>
          </div>
        </div>

        {/* Destination Info */}
        {destination && (
          <div className="bg-primary-50 border border-primary-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <MapPin className="w-5 h-5 text-primary-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-primary-900">Destination</p>
                <p className="text-sm text-primary-700">{destinationName}</p>
                <p className="text-xs text-primary-600 mt-1">
                  {destination.latitude.toFixed(4)}, {destination.longitude.toFixed(4)}
                </p>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full">
            <Loader className="w-12 h-12 text-primary animate-spin mb-4" />
            <p className="text-gray-600">Calculating safest routes...</p>
            <p className="text-sm text-gray-500 mt-2">Analyzing road conditions & weather</p>
          </div>
        ) : routes.length > 0 ? (
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h2 className="font-semibold text-gray-900 mb-2">
                {routes.length} Routes Available
              </h2>
              <p className="text-sm text-gray-600">
                Select your preferred route based on safety score
              </p>
            </div>

            {routes.map((route) => (
              <RouteCard
                key={route.id}
                route={route}
                selected={selectedRoute?.id === route.id}
                onSelect={() => setSelectedRoute(route)}
              />
            ))}

            {/* Safety Score Legend */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-3">Safety Score Guide</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white font-bold text-sm">
                    70+
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Safe Route</p>
                    <p className="text-xs text-gray-600">Good road conditions, low risk</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-white font-bold text-sm">
                    40
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Moderate Risk</p>
                    <p className="text-xs text-gray-600">Some hazards, drive carefully</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-danger flex items-center justify-center text-white font-bold text-sm">
                    0
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">High Risk</p>
                    <p className="text-xs text-gray-600">Dangerous conditions, avoid if possible</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <MapPin className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Destination Selected</h3>
            <p className="text-sm text-gray-600">
              Search for a destination on the home screen to calculate routes
            </p>
          </div>
        )}
      </div>

      {/* Bottom Action Button */}
      {selectedRoute && !loading && (
        <div className="bg-white border-t border-gray-200 p-4 shadow-lg">
          <button
            onClick={handleStartNavigation}
            className="w-full bg-primary text-white py-4 rounded-lg font-semibold text-lg hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
          >
            <MapPin className="w-5 h-5" />
            Start Navigation
          </button>
        </div>
      )}
    </div>
  );
};

export default RoutePlanning;
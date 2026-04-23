import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useLocation } from '../contexts/LocationContext';
import { mapboxService } from '../services/mapbox';
import { chennaiPotholes } from '../data/potholes';
import WeatherWidget from '../components/common/WeatherWidget';
import { Search, Menu, Navigation, AlertCircle, MapPin, AlertTriangle } from 'lucide-react';
import L from 'leaflet';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { currentLocation, loading: locationLoading, error: locationError } = useLocation();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPotholes, setShowPotholes] = useState(false);
  const currentMarker = useRef<L.Marker | null>(null);
  const potholeMarkers = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Initialize Leaflet map
    map.current = mapboxService.createMap(mapContainer.current, {
      center: [13.0827, 80.2707], // Chennai
      zoom: 12,
    }) as L.Map;

    // Add potholes to map
    if (showPotholes) {
      addPotholesToMap();
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (map.current && currentLocation) {
      // Fly to current location
      map.current.flyTo(
        [currentLocation.latitude, currentLocation.longitude],
        15,
        { duration: 1.5 }
      );

      // Remove old marker if exists
      if (currentMarker.current) {
        currentMarker.current.remove();
      }

      // Add new marker for current location
      currentMarker.current = L.marker([currentLocation.latitude, currentLocation.longitude], {
        icon: L.divIcon({
          className: 'current-location-marker',
          html: `
            <div style="
              background-color: #10B981; 
              width: 20px; 
              height: 20px; 
              border-radius: 50%; 
              border: 3px solid white; 
              box-shadow: 0 0 10px rgba(16, 185, 129, 0.5);
              animation: pulse 2s infinite;
            "></div>
          `,
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        }),
      }).addTo(map.current);

      // Add popup
      currentMarker.current.bindPopup(
        `<b>${t('home.currentLocation')}</b><br>Chennai`
      ).openPopup();
    }
  }, [currentLocation, t]);

  useEffect(() => {
    if (map.current) {
      if (showPotholes) {
        addPotholesToMap();
      } else {
        removePotholesFromMap();
      }
    }
  }, [showPotholes]);

  // Add global function for navigation
  useEffect(() => {
    (window as any).navigateToDestination = (lat: number, lng: number, name: string) => {
      navigate('/route/plan', {
        state: {
          destination: { latitude: lat, longitude: lng },
          destinationName: name,
        },
      });
    };

    return () => {
      delete (window as any).navigateToDestination;
    };
  }, [navigate]);

  const addPotholesToMap = () => {
    if (!map.current) return;

    // Clear existing pothole markers
    removePotholesFromMap();

    // Add pothole markers
    chennaiPotholes.forEach((pothole) => {
      const color = getPotholeColor(pothole.severity);
      
      const marker = L.marker(
        [pothole.location.latitude, pothole.location.longitude],
        {
          icon: L.divIcon({
            className: 'pothole-marker',
            html: `
              <div style="
                background-color: ${color}; 
                width: 16px; 
                height: 16px; 
                border-radius: 50%; 
                border: 2px solid white; 
                box-shadow: 0 2px 5px rgba(0,0,0,0.3);
                cursor: pointer;
              "></div>
            `,
            iconSize: [16, 16],
            iconAnchor: [8, 8],
          }),
        }
      );

      marker.bindPopup(`
        <div style="padding: 5px;">
          <b style="color: ${color};">⚠️ Pothole Warning</b><br>
          <span style="font-size: 12px;">Severity: ${pothole.severity.toUpperCase()}</span><br>
          <span style="font-size: 11px; color: #666;">Reported: ${new Date(pothole.reportedAt).toLocaleDateString()}</span>
        </div>
      `);

      marker.addTo(map.current!);
      potholeMarkers.current.push(marker);
    });
  };

  const removePotholesFromMap = () => {
    potholeMarkers.current.forEach((marker) => marker.remove());
    potholeMarkers.current = [];
  };

  const getPotholeColor = (severity: string): string => {
    switch (severity) {
      case 'high':
        return '#EF4444'; // Red
      case 'medium':
        return '#F59E0B'; // Amber
      case 'low':
        return '#FCD34D'; // Yellow
      default:
        return '#EF4444';
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    console.log('Searching for:', searchQuery);
    const results = await mapboxService.searchPlaces(searchQuery);
    
    if (results.length > 0 && map.current) {
      const firstResult = results[0];
      const [lng, lat] = firstResult.center;
      
      // Fly to search result
      map.current.flyTo([lat, lng], 15, { duration: 1.5 });
      
      // Add marker with "Get Directions" button
      const marker = L.marker([lat, lng]).addTo(map.current);
      marker.bindPopup(`
        <div style="padding: 10px;">
          <b>${firstResult.place_name}</b><br>
          <button 
            onclick="window.navigateToDestination(${lat}, ${lng}, '${firstResult.place_name.replace(/'/g, "\\'")}')"
            style="
              margin-top: 8px;
              padding: 8px 16px;
              background-color: #1E40AF;
              color: white;
              border: none;
              border-radius: 6px;
              cursor: pointer;
              font-weight: 600;
              width: 100%;
            "
          >
            Get Directions
          </button>
        </div>
      `).openPopup();
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-md z-10 p-4">
        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Menu className="w-6 h-6 text-gray-700" />
          </button>

          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('home.searchPlaceholder')}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </form>
        </div>

        {/* Location Status & Pothole Toggle */}
        <div className="mt-3 flex items-center justify-between">
          {currentLocation && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4 text-accent" />
              <span>
                {currentLocation.latitude.toFixed(4)}, {currentLocation.longitude.toFixed(4)}
              </span>
            </div>
          )}

          <button
            onClick={() => setShowPotholes(!showPotholes)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              showPotholes
                ? 'bg-danger-100 text-danger-700 border border-danger-300'
                : 'bg-gray-100 text-gray-600 border border-gray-300'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Potholes ({chennaiPotholes.length})</span>
          </button>
        </div>

        {/* Weather Widget */}
        {currentLocation && (
          <div className="mt-3">
            <WeatherWidget 
              latitude={currentLocation.latitude} 
              longitude={currentLocation.longitude} 
            />
          </div>
        )}
      </header>

      {/* Location Error Alert */}
      {locationError && (
        <div className="bg-danger-50 border-l-4 border-danger p-4 m-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-danger" />
            <div>
              <p className="text-danger-700 font-medium">Location Access Needed</p>
              <p className="text-danger-600 text-sm">{locationError}</p>
            </div>
          </div>
        </div>
      )}

      {/* Pothole Info Banner */}
      {showPotholes && (
        <div className="bg-secondary-50 border-l-4 border-secondary px-4 py-2 mx-4 mt-2">
          <div className="flex items-center gap-2 text-sm">
            <AlertTriangle className="w-4 h-4 text-secondary-700" />
            <p className="text-secondary-700">
              <span className="font-medium">{chennaiPotholes.length} potholes</span> detected in Chennai area
            </p>
          </div>
        </div>
      )}

      {/* Map Container */}
      <div ref={mapContainer} className="flex-1 relative">
        {locationLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-[1000]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">{t('common.loading')}</p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <nav className="bg-white border-t border-gray-200 px-6 py-3 shadow-lg">
        <div className="flex justify-around items-center">
          <NavButton icon={<Navigation />} label={t('navigation.home')} active />
          <NavButton icon={<Search />} label={t('navigation.routes')} />
          <NavButton icon={<AlertCircle />} label={t('navigation.safety')} />
          <NavButton icon={<Menu />} label={t('navigation.profile')} />
        </div>
      </nav>
    </div>
  );
};

interface NavButtonProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

const NavButton: React.FC<NavButtonProps> = ({ icon, label, active }) => {
  return (
    <button
      className={`flex flex-col items-center gap-1 py-2 px-4 rounded-lg transition-colors ${
        active ? 'text-primary bg-primary-50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
      }`}
    >
      <div className="w-6 h-6">{icon}</div>
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
};

export default Home;
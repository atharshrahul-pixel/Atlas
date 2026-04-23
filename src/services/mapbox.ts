import L from 'leaflet';

// Fix for default marker icons in Leaflet
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

export const mapboxService = {
  // Initialize map with Leaflet
  createMap(container: string | HTMLElement, options: any = {}) {
    const mapElement = typeof container === 'string' 
      ? document.getElementById(container) 
      : container;

    if (!mapElement) return null;

    // Create Leaflet map
    const map = L.map(mapElement, {
      center: options.center || [13.0827, 80.2707], // Chennai
      zoom: options.zoom || 12,
      zoomControl: true,
    });

    // Add OpenStreetMap tiles (Free!)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    return map;
  },

  // Search places (basic implementation)
  async searchPlaces(query: string) {
    try {
      // Using Nominatim (OpenStreetMap's free geocoding service)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query + ', Chennai, India'
        )}&limit=5`
      );
      const data = await response.json();
      
      return data.map((item: any) => ({
        place_name: item.display_name,
        center: [parseFloat(item.lon), parseFloat(item.lat)],
        geometry: {
          coordinates: [parseFloat(item.lon), parseFloat(item.lat)],
        },
      }));
    } catch (error) {
      console.error('Search error:', error);
      return [];
    }
  },

  // Get directions (basic implementation)
  async getDirections(start: [number, number], end: [number, number]) {
    // For now, return a simple straight line
    // Later we can integrate OSRM (Open Source Routing Machine) for real routing
    return {
      geometry: {
        coordinates: [start, end],
      },
      distance: calculateDistance(start, end),
      duration: calculateDistance(start, end) / 10, // rough estimate
      steps: [],
    };
  },

  // Reverse geocoding
  async getAddress(lng: number, lat: number) {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      return data.display_name || 'Unknown location';
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return 'Unknown location';
    }
  },

  // Add marker to map
  addMarker(map: L.Map, coordinates: [number, number], color: string = '#EF4444') {
    if (!map) return null;
    
    const marker = L.marker([coordinates[1], coordinates[0]], {
      icon: L.divIcon({
        className: 'custom-marker',
        html: `<div style="background-color: ${color}; width: 25px; height: 25px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>`,
        iconSize: [25, 25],
        iconAnchor: [12, 24],
      }),
    });
    
    marker.addTo(map);
    return marker;
  },

  // Add popup to map
  addPopup(map: L.Map, coordinates: [number, number], content: string) {
    if (!map) return null;
    
    const popup = L.popup()
      .setLatLng([coordinates[1], coordinates[0]])
      .setContent(content)
      .openOn(map);
    
    return popup;
  },

  // Get traffic congestion data
  async getTrafficData(coordinates: [number, number]): Promise<number> {
    try {
      // Using OpenStreetMap's Overpass API to check road density/type
      // This gives us a proxy for traffic conditions
      const [lng, lat] = coordinates;
      const radius = 500; // 500 meters around point

      const query = `
        [out:json];
        (
          way["highway"](around:${radius},${lat},${lng});
        );
        out body;
      `;

      const response = await fetch(
        'https://overpass-api.de/api/interpreter',
        {
          method: 'POST',
          body: query,
        }
      );

      const data = await response.json();
      
      // Analyze road types to estimate traffic
      return analyzeTrafficFromRoads(data.elements);
    } catch (error) {
      console.error('Traffic data error:', error);
      return 75; // Default moderate traffic
    }
  },
};

// Helper function to calculate distance
function calculateDistance(coord1: [number, number], coord2: [number, number]): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (coord1[1] * Math.PI) / 180;
  const φ2 = (coord2[1] * Math.PI) / 180;
  const Δφ = ((coord2[1] - coord1[1]) * Math.PI) / 180;
  const Δλ = ((coord2[0] - coord1[0]) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

// Analyze road types to estimate traffic levels
function analyzeTrafficFromRoads(roads: any[]): number {
  if (!roads || roads.length === 0) return 75;

  let trafficScore = 85; // Base score
  const hour = new Date().getHours();

  // Count different road types
  const roadTypes = {
    motorway: 0,
    trunk: 0,
    primary: 0,
    secondary: 0,
    residential: 0,
  };

  roads.forEach((road) => {
    const highway = road.tags?.highway;
    if (highway) {
      if (highway.includes('motorway')) roadTypes.motorway++;
      else if (highway.includes('trunk')) roadTypes.trunk++;
      else if (highway.includes('primary')) roadTypes.primary++;
      else if (highway.includes('secondary')) roadTypes.secondary++;
      else if (highway.includes('residential')) roadTypes.residential++;
    }
  });

  // Major roads = more traffic
  const majorRoads = roadTypes.motorway + roadTypes.trunk + roadTypes.primary;
  
  if (majorRoads > 5) {
    trafficScore -= 20; // Heavy traffic area
  } else if (majorRoads > 2) {
    trafficScore -= 10; // Moderate traffic
  }

  // Rush hour penalties (8-10 AM, 5-8 PM)
  const isRushHour = (hour >= 8 && hour <= 10) || (hour >= 17 && hour <= 20);
  if (isRushHour) {
    trafficScore -= 15;
  }

  // Weekend bonus (less traffic)
  const isWeekend = new Date().getDay() === 0 || new Date().getDay() === 6;
  if (isWeekend) {
    trafficScore += 10;
  }

  return Math.max(Math.min(trafficScore, 100), 30);
}

export default mapboxService;
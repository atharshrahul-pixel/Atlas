import type { Pothole } from '../types';

// Road-aligned pothole data for Chennai - positioned ON actual roads
export const chennaiPotholes: Pothole[] = [
  // Anna Salai (Mount Road) - Aligned to road centerline
  {
    id: 'p001',
    location: { latitude: 13.0527, longitude: 80.2500 }, // On Anna Salai near Saidapet
    severity: 'high',
    reportedBy: 'community',
    reportedAt: '2024-01-10T08:30:00Z',
    verified: true,
  },
  {
    id: 'p002',
    location: { latitude: 13.0578, longitude: 80.2534 }, // Anna Salai near Thousand Lights
    severity: 'medium',
    reportedBy: 'community',
    reportedAt: '2024-01-12T10:15:00Z',
    verified: true,
  },
  {
    id: 'p003',
    location: { latitude: 13.0623, longitude: 80.2567 }, // Anna Salai near Teynampet
    severity: 'high',
    reportedBy: 'community',
    reportedAt: '2024-01-08T14:20:00Z',
    verified: true,
  },
  {
    id: 'p004',
    location: { latitude: 13.0489, longitude: 80.2478 }, // Anna Salai near Guindy
    severity: 'low',
    reportedBy: 'community',
    reportedAt: '2024-01-13T09:10:00Z',
    verified: true,
  },

  // OMR (Old Mahabalipuram Road) - IT Corridor
  {
    id: 'p005',
    location: { latitude: 12.9123, longitude: 80.2275 }, // OMR near Sholinganallur
    severity: 'high',
    reportedBy: 'community',
    reportedAt: '2024-01-09T16:30:00Z',
    verified: true,
  },
  {
    id: 'p006',
    location: { latitude: 12.9345, longitude: 80.2356 }, // OMR near Thoraipakkam
    severity: 'medium',
    reportedBy: 'community',
    reportedAt: '2024-01-11T09:45:00Z',
    verified: true,
  },
  {
    id: 'p007',
    location: { latitude: 12.9456, longitude: 80.2412 }, // OMR near Perungudi
    severity: 'high',
    reportedBy: 'community',
    reportedAt: '2024-01-08T10:20:00Z',
    verified: true,
  },
  {
    id: 'p008',
    location: { latitude: 12.9234, longitude: 80.2298 }, // OMR near Karapakkam
    severity: 'low',
    reportedBy: 'community',
    reportedAt: '2024-01-13T11:00:00Z',
    verified: true,
  },

  // ECR (East Coast Road)
  {
    id: 'p009',
    location: { latitude: 12.9876, longitude: 80.2501 }, // ECR near Neelankarai
    severity: 'high',
    reportedBy: 'community',
    reportedAt: '2024-01-07T15:10:00Z',
    verified: true,
  },
  {
    id: 'p010',
    location: { latitude: 12.9654, longitude: 80.2445 }, // ECR near Injambakkam
    severity: 'medium',
    reportedBy: 'community',
    reportedAt: '2024-01-14T13:25:00Z',
    verified: true,
  },

  // Inner Ring Road
  {
    id: 'p011',
    location: { latitude: 13.0412, longitude: 80.2156 }, // Near Vadapalani
    severity: 'medium',
    reportedBy: 'community',
    reportedAt: '2024-01-10T12:15:00Z',
    verified: true,
  },
  {
    id: 'p012',
    location: { latitude: 13.0534, longitude: 80.2089 }, // Near Virugambakkam
    severity: 'high',
    reportedBy: 'community',
    reportedAt: '2024-01-09T09:30:00Z',
    verified: true,
  },

  // Poonamallee High Road
  {
    id: 'p013',
    location: { latitude: 13.0612, longitude: 80.2012 }, // Poonamallee High Road
    severity: 'medium',
    reportedBy: 'community',
    reportedAt: '2024-01-11T14:55:00Z',
    verified: true,
  },
  {
    id: 'p014',
    location: { latitude: 13.0489, longitude: 80.1934 }, // Near Koyambedu
    severity: 'high',
    reportedBy: 'community',
    reportedAt: '2024-01-08T11:45:00Z',
    verified: true,
  },

  // Grand Southern Trunk Road (GST Road)
  {
    id: 'p015',
    location: { latitude: 12.9823, longitude: 80.2145 }, // GST Road near Guindy
    severity: 'low',
    reportedBy: 'community',
    reportedAt: '2024-01-12T16:20:00Z',
    verified: true,
  },
  {
    id: 'p016',
    location: { latitude: 12.9456, longitude: 80.1823 }, // GST Road near Pallavaram
    severity: 'medium',
    reportedBy: 'community',
    reportedAt: '2024-01-10T10:25:00Z',
    verified: true,
  },
  {
    id: 'p017',
    location: { latitude: 12.9234, longitude: 80.1556 }, // GST Road near Chrompet
    severity: 'high',
    reportedBy: 'community',
    reportedAt: '2024-01-09T08:50:00Z',
    verified: true,
  },

  // Rajiv Gandhi Salai (OMR Extension)
  {
    id: 'p018',
    location: { latitude: 12.8912, longitude: 80.2189 }, // OMR near Navalur
    severity: 'high',
    reportedBy: 'community',
    reportedAt: '2024-01-07T13:10:00Z',
    verified: true,
  },
  {
    id: 'p019',
    location: { latitude: 12.8678, longitude: 80.2234 }, // OMR near Kelambakkam
    severity: 'medium',
    reportedBy: 'community',
    reportedAt: '2024-01-13T15:35:00Z',
    verified: true,
  },

  // Velachery Main Road
  {
    id: 'p020',
    location: { latitude: 12.9755, longitude: 80.2234 }, // Velachery Main Road
    severity: 'high',
    reportedBy: 'community',
    reportedAt: '2024-01-06T08:50:00Z',
    verified: true,
  },
  {
    id: 'p021',
    location: { latitude: 12.9821, longitude: 80.2289 }, // Near Velachery
    severity: 'medium',
    reportedBy: 'community',
    reportedAt: '2024-01-10T12:15:00Z',
    verified: true,
  },

  // Adyar - Sardar Patel Road
  {
    id: 'p022',
    location: { latitude: 13.0067, longitude: 80.2623 }, // Adyar
    severity: 'medium',
    reportedBy: 'community',
    reportedAt: '2024-01-11T14:55:00Z',
    verified: true,
  },
  {
    id: 'p023',
    location: { latitude: 13.0123, longitude: 80.2567 }, // Near IIT Madras
    severity: 'high',
    reportedBy: 'community',
    reportedAt: '2024-01-09T09:30:00Z',
    verified: true,
  },

  // T. Nagar - Usman Road
  {
    id: 'p024',
    location: { latitude: 13.0418, longitude: 80.2345 }, // Usman Road
    severity: 'low',
    reportedBy: 'community',
    reportedAt: '2024-01-12T16:20:00Z',
    verified: true,
  },
  {
    id: 'p025',
    location: { latitude: 13.0389, longitude: 80.2389 }, // T. Nagar
    severity: 'medium',
    reportedBy: 'community',
    reportedAt: '2024-01-08T11:45:00Z',
    verified: true,
  },

  // Arcot Road
  {
    id: 'p026',
    location: { latitude: 13.0354, longitude: 80.1723 }, // Arcot Road near Porur
    severity: 'high',
    reportedBy: 'community',
    reportedAt: '2024-01-07T13:10:00Z',
    verified: true,
  },
  {
    id: 'p027',
    location: { latitude: 13.0289, longitude: 80.1845 }, // Arcot Road
    severity: 'medium',
    reportedBy: 'community',
    reportedAt: '2024-01-13T15:35:00Z',
    verified: true,
  },

  // Perambur - Periyar EVR High Road
  {
    id: 'p028',
    location: { latitude: 13.1123, longitude: 80.2345 }, // Perambur
    severity: 'medium',
    reportedBy: 'community',
    reportedAt: '2024-01-11T09:15:00Z',
    verified: true,
  },
  {
    id: 'p029',
    location: { latitude: 13.0989, longitude: 80.2289 }, // EVR Road
    severity: 'high',
    reportedBy: 'community',
    reportedAt: '2024-01-09T11:05:00Z',
    verified: true,
  },

  // Ambattur - CTH Road
  {
    id: 'p030',
    location: { latitude: 13.0978, longitude: 80.1534 }, // Ambattur
    severity: 'low',
    reportedBy: 'community',
    reportedAt: '2024-01-14T10:45:00Z',
    verified: true,
  },
];

// Get potholes by severity
export function getPotholesBySeverity(severity: 'low' | 'medium' | 'high') {
  return chennaiPotholes.filter((p) => p.severity === severity);
}

// Get potholes in a specific area (within radius in km)
export function getPotholesInArea(
  centerLat: number,
  centerLng: number,
  radiusKm: number
) {
  return chennaiPotholes.filter((pothole) => {
    const distance = calculateDistance(
      centerLat,
      centerLng,
      pothole.location.latitude,
      pothole.location.longitude
    );
    return distance <= radiusKm;
  });
}

// Calculate distance between two points (Haversine formula)
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
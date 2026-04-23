import React from 'react';
import { Shield, Clock, Navigation as NavigationIcon, AlertTriangle, Activity } from 'lucide-react';
import { formatDistance, formatDuration, getRiskColor, getRiskLevel } from '../../utils';
import type { Route } from '../../types';

interface RouteCardProps {
  route: Route;
  selected?: boolean;
  onSelect: () => void;
}

const RouteCard: React.FC<RouteCardProps> = ({ route, selected, onSelect }) => {
  const riskLevel = getRiskLevel(route.safetyScore);
  const riskColor = getRiskColor(route.safetyScore);

  return (
    <button
      onClick={onSelect}
      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
        selected
          ? 'border-primary bg-primary-50 shadow-lg'
          : 'border-gray-200 bg-white hover:border-primary-300 hover:shadow-md'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Shield
            className="w-5 h-5"
            style={{ color: riskColor }}
            fill={riskColor}
          />
          <h3 className="font-semibold text-gray-900 capitalize">
            {route.routeType} Route
          </h3>
        </div>
        <div
          className="px-3 py-1 rounded-full text-sm font-bold"
          style={{
            backgroundColor: `${riskColor}20`,
            color: riskColor,
          }}
        >
          {route.safetyScore}/100
        </div>
      </div>

      {/* Stats - Now with 3 columns including Traffic */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="flex items-center gap-2">
          <NavigationIcon className="w-4 h-4 text-gray-500" />
          <div>
            <p className="text-xs text-gray-500">Distance</p>
            <p className="text-sm font-medium text-gray-900">
              {formatDistance(route.distance)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-500" />
          <div>
            <p className="text-xs text-gray-500">Duration</p>
            <p className="text-sm font-medium text-gray-900">
              {formatDuration(route.duration)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-gray-500" />
          <div>
            <p className="text-xs text-gray-500">Traffic</p>
            <p className="text-sm font-medium text-gray-900">
              {getTrafficLevel(route.safetyScore)}
            </p>
          </div>
        </div>
      </div>

      {/* Risk Info */}
      {route.potholes && route.potholes.length > 0 && (
        <div className="flex items-center gap-2 p-2 bg-secondary-50 rounded text-xs">
          <AlertTriangle className="w-3 h-3 text-secondary-600" />
          <span className="text-secondary-700">
            {route.potholes.length} pothole{route.potholes.length > 1 ? 's' : ''} detected
          </span>
        </div>
      )}

      {/* Risk Badge */}
      {riskLevel !== 'low' && (
        <div className={`mt-2 text-xs font-medium ${
          riskLevel === 'high' ? 'text-danger-700' : 'text-secondary-700'
        }`}>
          {riskLevel === 'high' ? '⚠️ High Risk Route' : '⚡ Moderate Risk'}
        </div>
      )}

      {/* Recommendation Badge */}
      {route.routeType === 'safest' && (
        <div className="mt-2 flex items-center gap-1 text-xs font-medium text-accent-700">
          <Shield className="w-3 h-3" />
          <span>Recommended</span>
        </div>
      )}

      {selected && (
        <div className="mt-3 pt-3 border-t border-primary-200">
          <p className="text-sm font-medium text-primary-700">
            ✓ Selected - Tap "Start Navigation" to begin
          </p>
        </div>
      )}
    </button>
  );
};

// Helper function to get traffic level text
function getTrafficLevel(score: number): string {
  if (score >= 80) return 'Light';
  if (score >= 60) return 'Moderate';
  return 'Heavy';
}

export default RouteCard;
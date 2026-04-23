import React, { useEffect, useState } from 'react';
import { weatherService } from '../../services/weather';
import { Cloud, CloudRain, Sun, Wind, Droplets, Eye, AlertTriangle } from 'lucide-react';
import type { Weather } from '../../types';

interface WeatherWidgetProps {
  latitude: number;
  longitude: number;
}

const WeatherWidget: React.FC<WeatherWidgetProps> = ({ latitude, longitude }) => {
  const [weather, setWeather] = useState<Weather | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchWeather();
    // Refresh weather every 10 minutes
    const interval = setInterval(fetchWeather, 600000);
    return () => clearInterval(interval);
  }, [latitude, longitude]);

  const fetchWeather = async () => {
    try {
      setLoading(true);
      const data = await weatherService.getCurrentWeather(latitude, longitude);
      if (data) {
        setWeather(data);
        setError(null);
      } else {
        setError('Weather data unavailable');
      }
    } catch (err) {
      setError('Failed to fetch weather');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 animate-pulse">
        <div className="h-20 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4">
        <p className="text-sm text-gray-500">Weather unavailable</p>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-md p-4 border-l-4 ${getRiskBorderColor(weather.riskLevel)}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {getWeatherIcon(weather.condition)}
          <div>
            <h3 className="font-semibold text-gray-900">{weather.condition}</h3>
            <p className="text-xs text-gray-500">Chennai</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-gray-900">{weather.temperature}°C</p>
        </div>
      </div>

      {/* Weather Details */}
      <div className="grid grid-cols-3 gap-3 mb-3">
        <div className="flex items-center gap-1">
          <Droplets className="w-4 h-4 text-blue-500" />
          <div>
            <p className="text-xs text-gray-500">Humidity</p>
            <p className="text-sm font-medium">{weather.humidity}%</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Wind className="w-4 h-4 text-gray-500" />
          <div>
            <p className="text-xs text-gray-500">Wind</p>
            <p className="text-sm font-medium">{weather.windSpeed} m/s</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Eye className="w-4 h-4 text-gray-500" />
          <div>
            <p className="text-xs text-gray-500">Visibility</p>
            <p className="text-sm font-medium">{weather.visibility} km</p>
          </div>
        </div>
      </div>

      {/* Risk Alert */}
      {weather.riskLevel !== 'low' && (
        <div className={`flex items-center gap-2 p-2 rounded ${getRiskBgColor(weather.riskLevel)}`}>
          <AlertTriangle className={`w-4 h-4 ${getRiskTextColor(weather.riskLevel)}`} />
          <p className={`text-xs font-medium ${getRiskTextColor(weather.riskLevel)}`}>
            {weather.riskLevel === 'high' ? 'High weather risk - Drive carefully' : 'Moderate weather conditions'}
          </p>
        </div>
      )}

      {/* Last Updated */}
      <p className="text-xs text-gray-400 mt-2 text-center">
        Updated: {new Date(weather.lastUpdated).toLocaleTimeString('en-IN', { 
          hour: '2-digit', 
          minute: '2-digit' 
        })}
      </p>
    </div>
  );
};

// Helper functions
function getWeatherIcon(condition: string) {
  const conditionLower = condition.toLowerCase();
  
  if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) {
    return <CloudRain className="w-8 h-8 text-blue-500" />;
  }
  if (conditionLower.includes('cloud')) {
    return <Cloud className="w-8 h-8 text-gray-500" />;
  }
  return <Sun className="w-8 h-8 text-yellow-500" />;
}

function getRiskBorderColor(risk: 'low' | 'medium' | 'high'): string {
  switch (risk) {
    case 'high':
      return 'border-danger';
    case 'medium':
      return 'border-secondary';
    default:
      return 'border-accent';
  }
}

function getRiskBgColor(risk: 'low' | 'medium' | 'high'): string {
  switch (risk) {
    case 'high':
      return 'bg-danger-50';
    case 'medium':
      return 'bg-secondary-50';
    default:
      return 'bg-accent-50';
  }
}

function getRiskTextColor(risk: 'low' | 'medium' | 'high'): string {
  switch (risk) {
    case 'high':
      return 'text-danger-700';
    case 'medium':
      return 'text-secondary-700';
    default:
      return 'text-accent-700';
  }
}

export default WeatherWidget;
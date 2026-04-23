import axios from 'axios';
import type { Weather } from '../types';

const WEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || '';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const weatherService = {
  async getCurrentWeather(lat: number, lon: number): Promise<Weather | null> {
    try {
      const response = await axios.get(`${BASE_URL}/weather`, {
        params: {
          lat,
          lon,
          appid: WEATHER_API_KEY,
          units: 'metric',
        },
      });

      const data = response.data;
      
      // Calculate risk level based on weather conditions
      const riskLevel = calculateWeatherRisk(data);

      return {
        condition: data.weather[0].main,
        temperature: Math.round(data.main.temp),
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        visibility: data.visibility / 1000, // Convert to km
        riskLevel,
        lastUpdated: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Weather fetch error:', error);
      return null;
    }
  },

  async getWeatherForecast(lat: number, lon: number) {
    try {
      const response = await axios.get(`${BASE_URL}/forecast`, {
        params: {
          lat,
          lon,
          appid: WEATHER_API_KEY,
          units: 'metric',
          cnt: 8, // 24 hours (3-hour intervals)
        },
      });
      return response.data.list;
    } catch (error) {
      console.error('Forecast fetch error:', error);
      return [];
    }
  },
};

function calculateWeatherRisk(weatherData: any): 'low' | 'medium' | 'high' {
  const condition = weatherData.weather[0].main.toLowerCase();
  const visibility = weatherData.visibility;
  const windSpeed = weatherData.wind.speed;

  // High risk conditions
  if (
    condition.includes('rain') ||
    condition.includes('storm') ||
    condition.includes('fog') ||
    visibility < 1000 ||
    windSpeed > 15
  ) {
    return 'high';
  }

  // Medium risk conditions
  if (
    condition.includes('cloud') ||
    condition.includes('mist') ||
    visibility < 3000 ||
    windSpeed > 10
  ) {
    return 'medium';
  }

  // Low risk - clear conditions
  return 'low';
}

export default weatherService;
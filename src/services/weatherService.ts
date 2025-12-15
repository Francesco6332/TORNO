import { WEATHER_API_KEY, WEATHER_API_URL, CACHE_DURATION } from '@/config/constants';
import { cacheManager } from '@/utils/cache';
import type { WeatherData } from '@/types';

const getCacheKey = (lat: number, lng: number) => `weather_${lat}_${lng}`;

export const weatherService = {
  async getWeather(lat: number, lng: number): Promise<WeatherData> {
    const cacheKey = getCacheKey(lat, lng);
    const cached = cacheManager.get<WeatherData>(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      const response = await fetch(
        `${WEATHER_API_URL}/weather?lat=${lat}&lon=${lng}&appid=${WEATHER_API_KEY}&units=metric&lang=it`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }

      const data = await response.json();
      
      const weatherData: WeatherData = {
        temp: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        humidity: data.main.humidity,
        windSpeed: data.wind?.speed || 0,
        windDirection: data.wind?.deg || 0,
        conditions: data.weather[0]?.description || '',
        icon: data.weather[0]?.icon || '',
        visibility: data.visibility ? data.visibility / 1000 : 10, // convert to km
      };

      cacheManager.set(cacheKey, weatherData, CACHE_DURATION.WEATHER);
      return weatherData;
    } catch (error) {
      console.error('Error fetching weather:', error);
      throw error;
    }
  },

  async getWeatherBatch(coordinates: Array<{ lat: number; lng: number }>): Promise<Map<string, WeatherData>> {
    // Fetch all weather data in parallel
    const promises = coordinates.map(async ({ lat, lng }) => {
      try {
        const weather = await this.getWeather(lat, lng);
        return { key: `${lat}_${lng}`, weather };
      } catch (error) {
        console.error(`Error fetching weather for ${lat}, ${lng}:`, error);
        return null;
      }
    });

    const results = await Promise.all(promises);
    const weatherMap = new Map<string, WeatherData>();

    results.forEach(result => {
      if (result) {
        weatherMap.set(result.key, result.weather);
      }
    });

    return weatherMap;
  },
};


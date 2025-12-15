import { useQuery } from '@tanstack/react-query';
import { weatherService } from '@/services/weatherService';
import type { WeatherData } from '@/types';

export const useWeather = (lat: number, lng: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['weather', lat, lng],
    queryFn: () => weatherService.getWeather(lat, lng),
    enabled: enabled && !!lat && !!lng,
    staleTime: 60 * 60 * 1000, // 1 hour
  });
};

export const useWeatherBatch = (coordinates: Array<{ lat: number; lng: number }>) => {
  return useQuery({
    queryKey: ['weather', 'batch', coordinates],
    queryFn: () => weatherService.getWeatherBatch(coordinates),
    enabled: coordinates.length > 0,
    staleTime: 60 * 60 * 1000, // 1 hour
  });
};


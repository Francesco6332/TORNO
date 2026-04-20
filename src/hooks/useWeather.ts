import { useQuery } from '@tanstack/react-query';
import { weatherService } from '@/services/weatherService';
import type { Language } from '@/i18n/translations';

export const useWeather = (
  lat: number,
  lng: number,
  enabled: boolean = true,
  language: Language = 'it'
) => {
  return useQuery({
    queryKey: ['weather', language, lat, lng],
    queryFn: () => weatherService.getWeather(lat, lng, language),
    enabled: enabled && !!lat && !!lng,
    staleTime: 60 * 60 * 1000, // 1 hour
  });
};

export const useWeatherBatch = (
  coordinates: Array<{ lat: number; lng: number }>,
  language: Language = 'it'
) => {
  return useQuery({
    queryKey: ['weather', 'batch', language, coordinates],
    queryFn: () => weatherService.getWeatherBatch(coordinates, language),
    enabled: coordinates.length > 0,
    staleTime: 60 * 60 * 1000, // 1 hour
  });
};

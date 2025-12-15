import { Cloud, Droplets, Wind, Eye } from 'lucide-react';
import { useWeather } from '@/hooks/useWeather';
import type { WeatherData } from '@/types';

interface WeatherWidgetProps {
  lat: number;
  lng: number;
  className?: string;
}

export default function WeatherWidget({ lat, lng, className = '' }: WeatherWidgetProps) {
  const { data: weather, isLoading, error } = useWeather(lat, lng);

  if (isLoading) {
    return (
      <div className={`bg-dark-800 rounded-lg p-4 ${className}`}>
        <div className="animate-pulse space-y-2">
          <div className="h-4 bg-dark-700 rounded w-1/2"></div>
          <div className="h-8 bg-dark-700 rounded w-1/3"></div>
        </div>
      </div>
    );
  }

  if (error || !weather) {
    return null;
  }

  const getWeatherIcon = (icon: string) => {
    return `https://openweathermap.org/img/wn/${icon}@2x.png`;
  };

  return (
    <div className={`bg-dark-800 rounded-lg p-4 border border-dark-700 ${className}`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="text-sm font-medium text-gray-400 mb-1">Meteo</h4>
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-white">{weather.temp}°</span>
            <span className="text-sm text-gray-400">C</span>
          </div>
          <p className="text-xs text-gray-500 capitalize mt-1">{weather.conditions}</p>
        </div>
        {weather.icon && (
          <img
            src={getWeatherIcon(weather.icon)}
            alt={weather.conditions}
            className="w-12 h-12"
          />
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-dark-700">
        <div className="flex items-center space-x-2 text-xs text-gray-400">
          <Wind className="w-4 h-4 text-primary-500" />
          <span>{weather.windSpeed} m/s</span>
        </div>
        <div className="flex items-center space-x-2 text-xs text-gray-400">
          <Droplets className="w-4 h-4 text-primary-500" />
          <span>{weather.humidity}%</span>
        </div>
        <div className="flex items-center space-x-2 text-xs text-gray-400">
          <Eye className="w-4 h-4 text-primary-500" />
          <span>{weather.visibility} km</span>
        </div>
        <div className="flex items-center space-x-2 text-xs text-gray-400">
          <Cloud className="w-4 h-4 text-primary-500" />
          <span>Percepita {weather.feelsLike}°</span>
        </div>
      </div>
    </div>
  );
}


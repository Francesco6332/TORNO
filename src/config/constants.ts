export const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY || '';
export const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5';

export const DIFFICULTY_LEVELS = {
  EASY: { value: 'easy', label: 'Facile', color: 'green', icon: '🟢' },
  MEDIUM: { value: 'medium', label: 'Medio', color: 'yellow', icon: '🟡' },
  HARD: { value: 'hard', label: 'Difficile', color: 'orange', icon: '🟠' },
  EXPERT: { value: 'expert', label: 'Esperto', color: 'red', icon: '🔴' },
} as const;

export const VEHICLE_TYPES = {
  MOTORCYCLE: 'motorcycle',
  CAR: 'car',
  BOTH: 'both',
} as const;

export const STORAGE_KEYS = {
  FAVORITES: 'torno_favorites',
  RECENT_VIEWS: 'torno_recent_views',
  USER_PREFERENCES: 'torno_user_preferences',
} as const;

export const CACHE_DURATION = {
  WEATHER: 60 * 60 * 1000, // 1 hour
  PASSI: 30 * 60 * 1000, // 30 minutes
  MAP_TILES: 7 * 24 * 60 * 60 * 1000, // 7 days
} as const;


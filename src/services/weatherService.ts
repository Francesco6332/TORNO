import { WEATHER_API_KEY, WEATHER_API_URL, CACHE_DURATION } from '@/config/constants';
import { cacheManager } from '@/utils/cache';
import type { WeatherData } from '@/types';
import type { Language } from '@/i18n/translations';

const getCacheKey = (lat: number, lng: number, language: Language) => `weather_${language}_${lat}_${lng}`;
const OPEN_METEO_API_URL = 'https://api.open-meteo.com/v1';

const weatherCodeLabels: Record<Language, Record<number, string>> = {
  it: {
    0: 'sereno',
    1: 'prevalentemente sereno',
    2: 'parzialmente nuvoloso',
    3: 'coperto',
    45: 'nebbia',
    48: 'nebbia con brina',
    51: 'pioviggine leggera',
    53: 'pioviggine',
    55: 'pioviggine intensa',
    56: 'pioviggine gelata leggera',
    57: 'pioviggine gelata intensa',
    61: 'pioggia leggera',
    63: 'pioggia',
    65: 'pioggia intensa',
    66: 'pioggia gelata leggera',
    67: 'pioggia gelata intensa',
    71: 'neve leggera',
    73: 'neve',
    75: 'neve intensa',
    77: 'granelli di neve',
    80: 'rovesci leggeri',
    81: 'rovesci',
    82: 'rovesci intensi',
    85: 'rovesci di neve leggeri',
    86: 'rovesci di neve intensi',
    95: 'temporale',
    96: 'temporale con grandine leggera',
    99: 'temporale con grandine intensa',
  },
  en: {
    0: 'clear sky',
    1: 'mainly clear',
    2: 'partly cloudy',
    3: 'overcast',
    45: 'fog',
    48: 'depositing rime fog',
    51: 'light drizzle',
    53: 'drizzle',
    55: 'dense drizzle',
    56: 'light freezing drizzle',
    57: 'dense freezing drizzle',
    61: 'light rain',
    63: 'rain',
    65: 'heavy rain',
    66: 'light freezing rain',
    67: 'heavy freezing rain',
    71: 'light snow',
    73: 'snow',
    75: 'heavy snow',
    77: 'snow grains',
    80: 'light showers',
    81: 'showers',
    82: 'heavy showers',
    85: 'light snow showers',
    86: 'heavy snow showers',
    95: 'thunderstorm',
    96: 'thunderstorm with light hail',
    99: 'thunderstorm with heavy hail',
  },
};

const fetchOpenWeather = async (lat: number, lng: number, language: Language): Promise<WeatherData> => {
  const response = await fetch(
    `${WEATHER_API_URL}/weather?lat=${lat}&lon=${lng}&appid=${WEATHER_API_KEY}&units=metric&lang=${language}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch OpenWeather data');
  }

  const data = await response.json();

  return {
    temp: Math.round(data.main.temp),
    feelsLike: Math.round(data.main.feels_like),
    humidity: data.main.humidity,
    windSpeed: data.wind?.speed || 0,
    windDirection: data.wind?.deg || 0,
    conditions: data.weather[0]?.description || '',
    icon: data.weather[0]?.icon || '',
    visibility: data.visibility ? data.visibility / 1000 : 10,
  };
};

const fetchOpenMeteo = async (lat: number, lng: number, language: Language): Promise<WeatherData> => {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lng),
    current: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'weather_code',
      'wind_speed_10m',
      'wind_direction_10m',
      'visibility',
    ].join(','),
    wind_speed_unit: 'ms',
    timezone: 'auto',
  });

  const response = await fetch(`${OPEN_METEO_API_URL}/forecast?${params.toString()}`);

  if (!response.ok) {
    throw new Error('Failed to fetch Open-Meteo data');
  }

  const data = await response.json();
  const current = data.current;
  const weatherCode = Number(current?.weather_code);

  if (!current) {
    throw new Error('Open-Meteo response is missing current weather');
  }

  return {
    temp: Math.round(current.temperature_2m),
    feelsLike: Math.round(current.apparent_temperature ?? current.temperature_2m),
    humidity: Math.round(current.relative_humidity_2m ?? 0),
    windSpeed: Number((current.wind_speed_10m ?? 0).toFixed(1)),
    windDirection: Math.round(current.wind_direction_10m ?? 0),
    conditions: weatherCodeLabels[language][weatherCode] || weatherCodeLabels.it[weatherCode] || '',
    icon: '',
    visibility: current.visibility ? Math.round(current.visibility / 1000) : 0,
  };
};

export const weatherService = {
  async getWeather(lat: number, lng: number, language: Language = 'it'): Promise<WeatherData> {
    const cacheKey = getCacheKey(lat, lng, language);
    const cached = cacheManager.get<WeatherData>(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      const weatherData = WEATHER_API_KEY
        ? await fetchOpenWeather(lat, lng, language)
        : await fetchOpenMeteo(lat, lng, language);

      cacheManager.set(cacheKey, weatherData, CACHE_DURATION.WEATHER);
      return weatherData;
    } catch (primaryError) {
      if (WEATHER_API_KEY) {
        try {
          const weatherData = await fetchOpenMeteo(lat, lng, language);
          cacheManager.set(cacheKey, weatherData, CACHE_DURATION.WEATHER);
          return weatherData;
        } catch (fallbackError) {
          console.error('Error fetching weather:', primaryError, fallbackError);
          throw fallbackError;
        }
      }

      console.error('Error fetching weather:', primaryError);
      throw primaryError;
    }
  },

  async getWeatherBatch(
    coordinates: Array<{ lat: number; lng: number }>,
    language: Language = 'it'
  ): Promise<Map<string, WeatherData>> {
    // Fetch all weather data in parallel
    const promises = coordinates.map(async ({ lat, lng }) => {
      try {
        const weather = await this.getWeather(lat, lng, language);
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

export type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'expert';
export type VehicleType = 'motorcycle' | 'car' | 'both';

export interface Passo {
  id: string;
  name: string;
  region: string;
  elevation: number; // metri
  difficulty: DifficultyLevel;
  vehicleType: VehicleType;
  coordinates: {
    lat: number;
    lng: number;
  };
  description: string;
  length?: number; // km
  maxGradient?: number; // percentuale
  surface?: string;
  images?: string[];
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface WeatherData {
  temp: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  conditions: string;
  icon: string;
  visibility: number;
}

export interface User {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  preferences?: {
    vehicleType?: VehicleType;
    favoriteRegions?: string[];
  };
}

export interface UserPreferences {
  vehicleType?: VehicleType;
  favoriteRegions?: string[];
  theme?: 'light' | 'dark';
}


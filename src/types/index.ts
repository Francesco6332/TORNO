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
  createdBy?: User;
  upvotedBy?: string[];
  upvoteCount?: number;
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

export interface Itinerary {
  id: string;
  title: string;
  description: string;
  region: string;
  difficulty: DifficultyLevel;
  vehicleType: VehicleType;
  passi: Passo[];
  totalLength: number; // km
  totalElevationGain: number; // metri
  estimatedTime: number; // ore
  images?: string[];
  tags?: string[];
  createdBy: User;
  upvotedBy?: string[];
  upvoteCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface NewPassoInput {
  name: string;
  region: string;
  elevation: number;
  difficulty: DifficultyLevel;
  vehicleType: VehicleType;
  coordinates: {
    lat: number;
    lng: number;
  };
  description: string;
  length?: number;
  maxGradient?: number;
  surface?: string;
  images?: string[];
  tags?: string[];
  createdBy: User;
}

export interface NewItineraryInput {
  title: string;
  description: string;
  region: string;
  difficulty: DifficultyLevel;
  vehicleType: VehicleType;
  passi: Passo[];
  totalLength: number;
  totalElevationGain: number;
  estimatedTime: number;
  images?: string[];
  tags?: string[];
  createdBy: User;
}

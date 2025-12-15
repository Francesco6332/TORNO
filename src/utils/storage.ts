import { STORAGE_KEYS } from '@/config/constants';
import type { UserPreferences } from '@/types';

export const storage = {
  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error reading from localStorage key "${key}":`, error);
      return null;
    }
  },

  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing to localStorage key "${key}":`, error);
    }
  },

  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  },

  clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  },
};

export const favoritesStorage = {
  get(): string[] {
    return storage.get<string[]>(STORAGE_KEYS.FAVORITES) || [];
  },

  add(passoId: string): void {
    const favorites = this.get();
    if (!favorites.includes(passoId)) {
      storage.set(STORAGE_KEYS.FAVORITES, [...favorites, passoId]);
    }
  },

  remove(passoId: string): void {
    const favorites = this.get();
    storage.set(STORAGE_KEYS.FAVORITES, favorites.filter(id => id !== passoId));
  },

  has(passoId: string): boolean {
    return this.get().includes(passoId);
  },
};

export const recentViewsStorage = {
  get(): string[] {
    return storage.get<string[]>(STORAGE_KEYS.RECENT_VIEWS) || [];
  },

  add(passoId: string, maxItems: number = 10): void {
    const recent = this.get();
    const filtered = recent.filter(id => id !== passoId);
    const updated = [passoId, ...filtered].slice(0, maxItems);
    storage.set(STORAGE_KEYS.RECENT_VIEWS, updated);
  },
};

export const preferencesStorage = {
  get(): UserPreferences {
    return storage.get<UserPreferences>(STORAGE_KEYS.USER_PREFERENCES) || {};
  },

  set(preferences: UserPreferences): void {
    storage.set(STORAGE_KEYS.USER_PREFERENCES, preferences);
  },

  update(updates: Partial<UserPreferences>): void {
    const current = this.get();
    this.set({ ...current, ...updates });
  },
};


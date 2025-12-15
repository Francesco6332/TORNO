import { getImageUrl } from '@/config/digitalOcean';

/**
 * Ottiene l'URL completo di un'immagine
 * Supporta sia Digital Ocean Spaces che Firebase Storage
 */
export const getImageUrlSafe = (path: string | undefined | null): string => {
  if (!path) {
    return '/placeholder-mountain.jpg'; // Fallback image
  }

  // Se è già un URL completo, restituiscilo
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  // Altrimenti usa Digital Ocean Spaces o Firebase Storage
  return getImageUrl(path);
};

/**
 * Precarica un'immagine per migliorare le performance
 */
export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
};

/**
 * Precarica multiple immagini in parallelo
 */
export const preloadImages = async (sources: string[]): Promise<void> => {
  await Promise.all(sources.map(src => preloadImage(src).catch(() => {})));
};


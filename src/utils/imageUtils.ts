import { getImageUrl } from '@/config/digitalOcean';
import type { Passo } from '@/types';

/**
 * Genera il path dell'immagine basandosi sul nome del passo
 * Formato: passi/nomepasso-pass
 * Esempio: "Passo Falzarego" -> "passi/falzarego-pass"
 */
export const generatePassoImagePath = (passoName: string): string => {
  // Rimuovi prefissi comuni
  let name = passoName
    .replace(/^Passo\s+(del|dello|della|di|dei|degli)\s+/i, '')
    .replace(/^Passo\s+/i, '')
    .trim();

  // Converti in lowercase e sostituisci spazi con trattini
  name = name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, ''); // Rimuovi accenti

  return `passi/${name}-pass`;
};

/**
 * Ottiene l'URL dell'immagine per un passo
 * Se il passo ha immagini esplicite, usa quelle
 * Altrimenti genera automaticamente il path basandosi sul nome
 */
export const getPassoImageUrl = (passo: Passo): string | null => {
  // Se ci sono immagini esplicite, usa la prima
  if (passo.images && passo.images.length > 0 && passo.images[0]) {
    const imagePath = passo.images[0];
    
    // Se è già un URL completo, restituiscilo
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    // Altrimenti costruisci l'URL con Digital Ocean Spaces
    const fullUrl = getImageUrl(imagePath);
    if (import.meta.env.DEV) {
      console.log(`🖼️ Immagine per ${passo.name}:`, { imagePath, fullUrl });
    }
    return fullUrl;
  }

  // Genera automaticamente il path basandosi sul nome
  const autoPath = generatePassoImagePath(passo.name);
  const fullUrl = getImageUrl(autoPath);
  if (import.meta.env.DEV) {
    console.log(`🖼️ Immagine auto-generata per ${passo.name}:`, { autoPath, fullUrl });
  }
  return fullUrl;
};

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


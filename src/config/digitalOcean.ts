// Digital Ocean Spaces Configuration
// Per usare Digital Ocean Spaces invece di Firebase Storage:
// 1. Crea uno Space su Digital Ocean
// 2. Configura CORS per permettere l'accesso dal tuo dominio
// 3. Usa questa configurazione per caricare le immagini

export const DO_SPACES_CONFIG = {
  endpoint: import.meta.env.VITE_DO_SPACES_ENDPOINT || '',
  bucket: import.meta.env.VITE_DO_SPACES_BUCKET || '',
  region: import.meta.env.VITE_DO_SPACES_REGION || 'nyc3',
  cdnEndpoint: import.meta.env.VITE_DO_SPACES_CDN_ENDPOINT || '',
};

export const getImageUrl = (path: string): string => {
  if (DO_SPACES_CONFIG.cdnEndpoint) {
    return `${DO_SPACES_CONFIG.cdnEndpoint}/${path}`;
  }
  if (DO_SPACES_CONFIG.endpoint && DO_SPACES_CONFIG.bucket) {
    return `https://${DO_SPACES_CONFIG.bucket}.${DO_SPACES_CONFIG.region}.digitaloceanspaces.com/${path}`;
  }
  // Fallback a Firebase Storage se configurato
  return path;
};


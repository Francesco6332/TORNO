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

// Debug: verifica la configurazione (solo in sviluppo)
if (import.meta.env.DEV) {
  const hasConfig = DO_SPACES_CONFIG.bucket || DO_SPACES_CONFIG.endpoint || DO_SPACES_CONFIG.cdnEndpoint;
  if (!hasConfig) {
    console.warn('⚠️ Digital Ocean Spaces non configurato');
    console.warn('   Aggiungi nel file .env:');
    console.warn('   VITE_DO_SPACES_BUCKET=your-bucket-name');
    console.warn('   VITE_DO_SPACES_REGION=nyc3');
    console.warn('   VITE_DO_SPACES_CDN_ENDPOINT=https://your-cdn-endpoint.com (opzionale)');
  }
}

export const getImageUrl = (path: string): string => {
  // Se è già un URL completo, restituiscilo
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  // Usa CDN se configurato
  if (DO_SPACES_CONFIG.cdnEndpoint) {
    // Rimuovi lo slash iniziale se presente per evitare doppi slash
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return `${DO_SPACES_CONFIG.cdnEndpoint}/${cleanPath}`;
  }

  // Usa endpoint diretto se bucket e region sono configurati
  if (DO_SPACES_CONFIG.bucket && DO_SPACES_CONFIG.region) {
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return `https://${DO_SPACES_CONFIG.bucket}.${DO_SPACES_CONFIG.region}.digitaloceanspaces.com/${cleanPath}`;
  }

  // Se endpoint è configurato direttamente
  if (DO_SPACES_CONFIG.endpoint) {
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return `${DO_SPACES_CONFIG.endpoint}/${cleanPath}`;
  }

  // Fallback: restituisce il path originale (potrebbe non funzionare senza configurazione)
  console.warn('⚠️ Digital Ocean Spaces non configurato. Le immagini potrebbero non caricarsi correttamente.');
  console.warn('   Configura VITE_DO_SPACES_BUCKET e VITE_DO_SPACES_REGION nel file .env');
  return path;
};


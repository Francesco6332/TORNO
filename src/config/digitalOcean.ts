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
    console.warn('   VITE_DO_SPACES_BUCKET=torno');
    console.warn('   VITE_DO_SPACES_REGION=nyc3 (o la tua regione)');
    console.warn('   VITE_DO_SPACES_CDN_ENDPOINT=https://torno.nyc3.cdn.digitaloceanspaces.com (opzionale)');
  } else {
    console.log('✅ Digital Ocean Spaces configurato:', {
      bucket: DO_SPACES_CONFIG.bucket || 'non configurato',
      region: DO_SPACES_CONFIG.region,
      cdn: DO_SPACES_CONFIG.cdnEndpoint ? 'abilitato' : 'disabilitato',
    });
  }
}

export const getImageUrl = (path: string): string => {
  // Se è già un URL completo, restituiscilo
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  // Rimuovi lo slash iniziale se presente
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;

  // Usa endpoint diretto se bucket e region sono configurati (evita problemi CORB con CDN)
  // Il CDN può avere problemi con file senza estensione
  if (DO_SPACES_CONFIG.bucket && DO_SPACES_CONFIG.region) {
    return `https://${DO_SPACES_CONFIG.bucket}.${DO_SPACES_CONFIG.region}.digitaloceanspaces.com/${cleanPath}`;
  }

  // Usa CDN se configurato (solo se endpoint diretto non disponibile)
  if (DO_SPACES_CONFIG.cdnEndpoint) {
    return `${DO_SPACES_CONFIG.cdnEndpoint}/${cleanPath}`;
  }

  // Se endpoint è configurato direttamente
  if (DO_SPACES_CONFIG.endpoint) {
    return `${DO_SPACES_CONFIG.endpoint}/${cleanPath}`;
  }

  // Fallback: restituisce il path originale (potrebbe non funzionare senza configurazione)
  console.warn('⚠️ Digital Ocean Spaces non configurato. Le immagini potrebbero non caricarsi correttamente.');
  console.warn('   Configura VITE_DO_SPACES_BUCKET e VITE_DO_SPACES_REGION nel file .env');
  return path;
};


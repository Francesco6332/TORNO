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

const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'webp', 'png'];

const trimTrailingSlash = (value: string): string => value.replace(/\/+$/, '');

const normalizeEndpoint = (value: string): string => {
  const endpoint = trimTrailingSlash(value.trim());

  if (!endpoint) {
    return '';
  }

  return endpoint.startsWith('http://') || endpoint.startsWith('https://')
    ? endpoint
    : `https://${endpoint}`;
};

const cleanObjectPath = (path: string): string => {
  return path
    .trim()
    .replace(/^\/+/, '')
    .split('/')
    .filter(Boolean)
    .map((segment) => encodeURIComponent(segment))
    .join('/');
};

const hasImageExtension = (path: string): boolean => {
  return /\.(avif|gif|jpe?g|png|svg|webp)(\?.*)?$/i.test(path);
};

const getSpacesBaseUrl = (): string => {
  const cdnEndpoint = normalizeEndpoint(DO_SPACES_CONFIG.cdnEndpoint);

  if (cdnEndpoint) {
    return cdnEndpoint;
  }

  const endpoint = normalizeEndpoint(DO_SPACES_CONFIG.endpoint);

  if (endpoint) {
    return DO_SPACES_CONFIG.bucket && !endpoint.includes(DO_SPACES_CONFIG.bucket)
      ? `${endpoint}/${DO_SPACES_CONFIG.bucket}`
      : endpoint;
  }

  if (DO_SPACES_CONFIG.bucket && DO_SPACES_CONFIG.region) {
    return `https://${DO_SPACES_CONFIG.bucket}.${DO_SPACES_CONFIG.region}.digitaloceanspaces.com`;
  }

  return '';
};

export const getImageUrl = (path: string): string => {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  const baseUrl = getSpacesBaseUrl();
  const cleanPath = cleanObjectPath(path);

  return baseUrl && cleanPath ? `${baseUrl}/${cleanPath}` : '';
};

export const getImageUrlCandidates = (path: string): string[] => {
  const primaryUrl = getImageUrl(path);

  if (!primaryUrl || path.startsWith('http://') || path.startsWith('https://') || hasImageExtension(path)) {
    return primaryUrl ? [primaryUrl] : [];
  }

  return [
    primaryUrl,
    ...IMAGE_EXTENSIONS
      .map((extension) => getImageUrl(`${path}.${extension}`))
      .filter(Boolean),
  ];
};

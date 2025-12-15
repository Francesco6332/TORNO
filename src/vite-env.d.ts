/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FIREBASE_API_KEY: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN: string;
  readonly VITE_FIREBASE_PROJECT_ID: string;
  readonly VITE_FIREBASE_STORAGE_BUCKET: string;
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string;
  readonly VITE_FIREBASE_APP_ID: string;
  readonly VITE_WEATHER_API_KEY: string;
  readonly VITE_DO_SPACES_ENDPOINT?: string;
  readonly VITE_DO_SPACES_BUCKET?: string;
  readonly VITE_DO_SPACES_REGION?: string;
  readonly VITE_DO_SPACES_CDN_ENDPOINT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}


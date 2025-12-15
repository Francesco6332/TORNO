# TORNØ - Passi di Montagna

Un'applicazione web moderna per scoprire e esplorare i passi di montagna per motociclisti e automobilisti.

## 🚀 Caratteristiche

- **React + TypeScript** - Stack moderno e type-safe
- **TanStack Query** - Gestione efficiente delle chiamate API con caching
- **Firebase** - Database e autenticazione
- **Mappe Interattive** - Leaflet con OpenStreetMap (gratuito)
- **Meteo in Tempo Reale** - OpenWeatherMap API (gratuito)
- **Design Responsive** - Ottimizzato per mobile, tablet e desktop
- **Performance Ottimizzate** - Caching, localStorage, chiamate parallele, minificazione
- **PWA Ready** - Installabile come app mobile

## 🛠️ Stack Tecnologico

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: TanStack Query + Zustand
- **Routing**: React Router v6
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Storage**: Digital Ocean Spaces (configurabile)
- **Maps**: Leaflet + OpenStreetMap
- **Weather**: OpenWeatherMap API
- **Deployment**: Vercel

## 📦 Installazione

1. Clona il repository:
```bash
git clone <repository-url>
cd torno
```

2. Installa le dipendenze:
```bash
npm install
```

3. Configura le variabili d'ambiente:
```bash
cp .env.example .env
```

Modifica il file `.env` con le tue credenziali:
- Firebase: Crea un progetto su [Firebase Console](https://console.firebase.google.com/)
- OpenWeatherMap: Ottieni una API key gratuita su [OpenWeatherMap](https://openweathermap.org/api)

4. Avvia il server di sviluppo:
```bash
npm run dev
```

## 🔥 Configurazione Firebase

1. Crea un nuovo progetto su [Firebase Console](https://console.firebase.google.com/)
2. Abilita Authentication (Email/Password e Google)
3. Crea un database Firestore
4. Copia le credenziali nel file `.env`

### Struttura Firestore

Crea una collezione chiamata `passi` con documenti nel seguente formato:

```typescript
{
  name: string;
  region: string;
  elevation: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  vehicleType: 'motorcycle' | 'car' | 'both';
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
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

## 🌐 Deployment

### Vercel

1. Installa Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

Oppure connetti il repository GitHub direttamente su [Vercel Dashboard](https://vercel.com/)

### Digital Ocean Spaces (Storage)

Per configurare Digital Ocean Spaces per le immagini:

1. Crea uno Space su Digital Ocean
2. Configura CORS per permettere l'accesso dal tuo dominio
3. Aggiorna `src/config/firebase.ts` per usare Digital Ocean Spaces invece di Firebase Storage

## 📱 Funzionalità

- ✅ Esplorazione passi di montagna
- ✅ Filtri per difficoltà e tipo veicolo
- ✅ Ricerca testuale
- ✅ Mappa interattiva
- ✅ Meteo in tempo reale per ogni passo
- ✅ Preferiti salvati in localStorage
- ✅ Cronologia visualizzazioni recenti
- ✅ Autenticazione utente
- ✅ Design responsive

## 🎨 Design

Il design richiama il mondo motociclistico e automobilistico con:
- Colori scuri e accenti rossi/arancioni
- Tipografia bold e moderna
- Animazioni fluide
- Icone intuitive

## ⚡ Performance

- **Code Splitting**: Chunk separati per vendor, router, query, firebase, maps
- **Caching**: TanStack Query + Cache Manager personalizzato
- **localStorage**: Preferiti e cronologia salvati localmente
- **Lazy Loading**: Immagini e componenti caricati on-demand
- **Minificazione**: Terser con rimozione console.log
- **PWA**: Service Worker per caching offline

## 📄 Licenza

MIT

## 👥 Contributi

I contributi sono benvenuti! Apri una issue o una pull request.


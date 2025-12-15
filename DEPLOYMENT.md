# Guida al Deployment di TORNØ

## 🚀 Deployment su Vercel

### Metodo 1: Dashboard Vercel (Consigliato)

1. Vai su [vercel.com](https://vercel.com) e accedi
2. Clicca su "Add New Project"
3. Connetti il tuo repository GitHub/GitLab/Bitbucket
4. Vercel rileverà automaticamente Vite
5. Aggiungi le variabili d'ambiente nella sezione "Environment Variables":
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
   - `VITE_WEATHER_API_KEY`
6. Clicca "Deploy"

### Metodo 2: Vercel CLI

```bash
# Installa Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Per production
vercel --prod
```

## 🌊 Configurazione Digital Ocean Spaces

### 1. Crea uno Space

1. Accedi a [Digital Ocean](https://www.digitalocean.com/)
2. Vai su "Spaces" nel menu
3. Clicca "Create a Space"
4. Scegli:
   - **Datacenter region**: Scegli la regione più vicina ai tuoi utenti
   - **CDN**: Abilita per migliori performance
   - **Name**: Scegli un nome univoco (es: `torno-images`)

### 2. Configura CORS

1. Vai nelle impostazioni del tuo Space
2. Vai su "Settings" > "CORS Configurations"
3. Aggiungi questa configurazione:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
    "AllowedOrigins": [
      "https://your-domain.vercel.app",
      "http://localhost:5173"
    ],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]
```

### 3. Ottieni le credenziali

1. Vai su "API" > "Spaces Keys"
2. Genera una nuova chiave
3. Salva:
   - Access Key
   - Secret Key
   - Endpoint URL

### 4. Configura nel progetto

Aggiungi queste variabili d'ambiente in Vercel:

```
VITE_DO_SPACES_ENDPOINT=https://your-region.digitaloceanspaces.com
VITE_DO_SPACES_BUCKET=your-space-name
VITE_DO_SPACES_REGION=nyc3
VITE_DO_SPACES_CDN_ENDPOINT=https://your-space-name.nyc3.cdn.digitaloceanspaces.com
```

### 5. Upload immagini

Per caricare immagini nello Space, puoi usare:

- **Digital Ocean CLI**: `doctl`
- **S3-compatible tools**: AWS CLI, Cyberduck, etc.
- **API**: Usa le librerie AWS SDK compatibili

Esempio con AWS CLI:

```bash
aws configure --profile do
# Endpoint: https://nyc3.digitaloceanspaces.com
# Access Key: your_access_key
# Secret Key: your_secret_key

aws s3 cp image.jpg s3://your-space-name/passi/passo-id/image.jpg --endpoint-url=https://nyc3.digitaloceanspaces.com --profile do
```

## 🔥 Configurazione Firebase

### 1. Crea un progetto Firebase

1. Vai su [Firebase Console](https://console.firebase.google.com/)
2. Clicca "Add Project"
3. Segui la procedura guidata

### 2. Abilita Authentication

1. Vai su "Authentication" > "Get Started"
2. Abilita "Google" come provider di autenticazione
3. Configura il provider Google con il tuo Client ID e Client Secret (opzionale, Firebase gestisce automaticamente)

### 3. Crea Firestore Database

1. Vai su "Firestore Database" > "Create Database"
2. Scegli "Start in test mode" (per sviluppo)
3. Scegli la regione più vicina

### 4. Configura Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /passi/{passoId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 5. Aggiungi i dati iniziali

Crea una collezione `passi` e aggiungi alcuni documenti di esempio usando la struttura definita nel README.

## 🌤️ Configurazione OpenWeatherMap

1. Vai su [OpenWeatherMap](https://openweathermap.org/api)
2. Crea un account gratuito
3. Vai su "API Keys"
4. Genera una nuova API key
5. Aggiungi `VITE_WEATHER_API_KEY` nelle variabili d'ambiente

**Nota**: Il piano gratuito permette 60 chiamate/minuto e 1,000,000 chiamate/mese.

## ✅ Checklist Pre-Deployment

- [ ] Variabili d'ambiente configurate in Vercel
- [ ] Firebase Authentication configurato
- [ ] Firestore Database creato con security rules
- [ ] OpenWeatherMap API key ottenuta
- [ ] Digital Ocean Space creato (opzionale)
- [ ] CORS configurato per Digital Ocean Spaces
- [ ] Dati iniziali aggiunti a Firestore
- [ ] Test locale completato (`npm run dev`)
- [ ] Build di produzione testata (`npm run build`)

## 🐛 Troubleshooting

### Errori di CORS
- Verifica che le origini siano corrette nelle configurazioni CORS
- Assicurati che il dominio Vercel sia aggiunto alle allowed origins

### Errori di autenticazione Firebase
- Verifica che il dominio sia aggiunto nelle "Authorized domains" in Firebase Console
- Controlla che le variabili d'ambiente siano corrette

### Immagini non caricate
- Verifica che le URL delle immagini siano corrette
- Controlla i permessi dello Space Digital Ocean
- Verifica la configurazione CDN

### Meteo non funziona
- Verifica che l'API key di OpenWeatherMap sia valida
- Controlla i limiti del piano gratuito
- Verifica che le coordinate siano corrette


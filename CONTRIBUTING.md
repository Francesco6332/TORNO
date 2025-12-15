# Guida ai Contributi

Grazie per il tuo interesse a contribuire a TORNØ! 🏍️

## 🚀 Setup Sviluppo

1. **Fork** il repository
2. **Clona** il tuo fork:
   ```bash
   git clone https://github.com/tuo-username/torno.git
   cd torno
   ```

3. **Installa** le dipendenze:
   ```bash
   npm install
   ```

4. **Configura** le variabili d'ambiente:
   ```bash
   cp env.example .env
   ```
   Modifica `.env` con le tue credenziali di sviluppo.

5. **Avvia** il server di sviluppo:
   ```bash
   npm run dev
   ```

## 📝 Convenzioni di Codice

### TypeScript
- Usa TypeScript per tutto il codice
- Definisci sempre i tipi esplicitamente
- Evita `any`, usa `unknown` se necessario

### Styling
- Usa Tailwind CSS per lo styling
- Segui il design system esistente
- Mantieni la coerenza con il tema motociclistico/automobilistico

### Componenti
- Usa functional components con hooks
- Mantieni i componenti piccoli e focalizzati
- Usa `clsx` per gestire le classi condizionali

### Performance
- Usa `React.memo` per componenti pesanti
- Implementa lazy loading dove appropriato
- Ottimizza le immagini con `loading="lazy"`

## 🔄 Processo di Contribuzione

1. **Crea** un branch per la tua feature:
   ```bash
   git checkout -b feature/nome-feature
   ```

2. **Fai** le tue modifiche

3. **Testa** localmente:
   ```bash
   npm run build
   npm run preview
   ```

4. **Commit** le modifiche:
   ```bash
   git commit -m "feat: aggiungi nuova funzionalità"
   ```

5. **Push** al tuo fork:
   ```bash
   git push origin feature/nome-feature
   ```

6. **Apri** una Pull Request su GitHub

## 📋 Checklist PR

- [ ] Il codice segue le convenzioni del progetto
- [ ] I test passano (se applicabili)
- [ ] La build è senza errori
- [ ] La documentazione è aggiornata
- [ ] Le modifiche sono responsive
- [ ] Le performance sono ottimizzate

## 🐛 Segnalazione Bug

Quando segnali un bug, includi:
- Descrizione chiara del problema
- Passi per riprodurre
- Comportamento atteso vs. comportamento attuale
- Screenshot (se applicabile)
- Informazioni sull'ambiente (browser, OS, versione)

## ✨ Suggerimenti Feature

Le feature requests sono benvenute! Per favore:
- Descrivi la feature in dettaglio
- Spiega perché sarebbe utile
- Suggerisci un'implementazione (se possibile)

## 📚 Risorse

- [React Docs](https://react.dev/)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [TanStack Query Docs](https://tanstack.com/query/latest)
- [Firebase Docs](https://firebase.google.com/docs)

Grazie per il tuo contributo! 🎉


// Esempio di script per popolare Firestore con dati iniziali
// Questo file mostra la struttura dei dati da inserire
// Per usarlo, installa firebase-admin e crea uno script Node.js

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Inizializza Firebase Admin (richiede service account)
// initializeApp({
//   credential: cert(serviceAccount),
// });

// const db = getFirestore();

export const examplePassi = [
  {
    name: 'Passo dello Stelvio',
    region: 'Lombardia',
    elevation: 2757,
    difficulty: 'expert' as const,
    vehicleType: 'both' as const,
    coordinates: {
      lat: 46.5281,
      lng: 10.4517,
    },
    description: 'Il passo dello Stelvio è uno dei passi più famosi e spettacolari delle Alpi. Con i suoi 48 tornanti, offre panorami mozzafiato e una guida impegnativa.',
    length: 24.3,
    maxGradient: 14,
    surface: 'asfalto',
    images: [],
    tags: ['panoramico', 'tornanti', 'famoso'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Passo del Gavia',
    region: 'Lombardia',
    elevation: 2621,
    difficulty: 'hard' as const,
    vehicleType: 'both' as const,
    coordinates: {
      lat: 46.3444,
      lng: 10.4889,
    },
    description: 'Passo di montagna situato nelle Alpi Retiche, caratterizzato da strade strette e panorami spettacolari.',
    length: 17.2,
    maxGradient: 16,
    surface: 'asfalto',
    images: [],
    tags: ['panoramico', 'stretto'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Passo del Mortirolo',
    region: 'Lombardia',
    elevation: 1852,
    difficulty: 'expert' as const,
    vehicleType: 'motorcycle' as const,
    coordinates: {
      lat: 46.2333,
      lng: 10.2667,
    },
    description: 'Uno dei passi più duri d\'Europa, famoso per le sue pendenze estreme e i tornanti stretti. Perfetto per motociclisti esperti.',
    length: 12.4,
    maxGradient: 18,
    surface: 'asfalto',
    images: [],
    tags: ['difficile', 'tornanti', 'moto'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Passo del Brennero',
    region: 'Trentino-Alto Adige',
    elevation: 1374,
    difficulty: 'easy' as const,
    vehicleType: 'both' as const,
    coordinates: {
      lat: 47.0039,
      lng: 11.5056,
    },
    description: 'Passo principale per attraversare le Alpi, ampio e ben mantenuto. Adatto a tutti i tipi di veicoli.',
    length: 35.0,
    maxGradient: 8,
    surface: 'asfalto',
    images: [],
    tags: ['facile', 'principale', 'ampio'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Esempio di funzione per inserire i dati:
// async function seedData() {
//   const batch = db.batch();
//   examplePassi.forEach((passo) => {
//     const ref = db.collection('passi').doc();
//     batch.set(ref, passo);
//   });
//   await batch.commit();
//   console.log('Dati inseriti con successo!');
// }


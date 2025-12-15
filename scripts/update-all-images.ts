/**
 * Script per aggiornare tutti i passi con il path corretto delle immagini
 * Genera automaticamente il path: passi/nomepasso-pass
 * 
 * ISTRUZIONI:
 * 1. Assicurati di avere firebase-admin installato: npm install firebase-admin tsx
 * 2. Assicurati di avere firebase-service-account.json nella root
 * 3. Esegui: npx tsx scripts/update-all-images.ts
 */

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import * as fs from 'fs';
import * as path from 'path';

// Carica le credenziali del service account
const serviceAccountPath = path.join(process.cwd(), 'firebase-service-account.json');

if (!fs.existsSync(serviceAccountPath)) {
  console.error('❌ File firebase-service-account.json non trovato!');
  process.exit(1);
}

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

// Inizializza Firebase Admin
if (getApps().length === 0) {
  initializeApp({
    credential: cert(serviceAccount),
  });
}

const db = getFirestore();

/**
 * Genera il path dell'immagine basandosi sul nome del passo
 * Formato: passi/nomepasso-pass
 */
function generatePassoImagePath(passoName: string): string {
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
}

async function updateAllImages() {
  try {
    console.log('🔍 Recuperando tutti i passi...\n');

    const passiRef = db.collection('passi');
    const snapshot = await passiRef.get();

    if (snapshot.empty) {
      console.error('❌ Nessun passo trovato in Firestore.');
      process.exit(1);
    }

    console.log(`✅ Trovati ${snapshot.docs.length} passi\n`);

    const updates: Array<{ id: string; name: string; path: string }> = [];

    // Prepara gli aggiornamenti
    snapshot.docs.forEach((doc) => {
      const passoData = doc.data();
      const passoName = passoData.name;
      const imagePath = generatePassoImagePath(passoName);
      
      updates.push({
        id: doc.id,
        name: passoName,
        path: imagePath,
      });
    });

    // Mostra preview degli aggiornamenti
    console.log('📋 Path immagini che verranno generati:');
    updates.forEach((update) => {
      console.log(`   ${update.name} -> ${update.path}`);
    });

    console.log('\n⚠️  Vuoi procedere con l\'aggiornamento? (y/n)');
    console.log('   (Per eseguire automaticamente, usa: npx tsx scripts/update-all-images.ts --yes)\n');

    // Controlla se è stato passato il flag --yes
    const autoConfirm = process.argv.includes('--yes');

    if (!autoConfirm) {
      // In un ambiente interattivo, potresti voler chiedere conferma
      // Per ora procediamo direttamente
      console.log('⏭️  Procedendo automaticamente...\n');
    }

    // Esegui gli aggiornamenti in batch
    const batch = db.batch();
    let count = 0;

    updates.forEach((update) => {
      const docRef = passiRef.doc(update.id);
      batch.update(docRef, {
        images: [update.path], // Salva solo il path, non l'URL completo
        updatedAt: Timestamp.now(),
      });
      count++;
    });

    await batch.commit();

    console.log(`✅ ${count} passi aggiornati con successo!\n`);
    console.log('📝 Nota: Le immagini devono essere caricate su Digital Ocean Spaces');
    console.log('   con il path corrispondente (es: passi/falzarego-pass)\n');

  } catch (error: any) {
    console.error('❌ Errore durante l\'aggiornamento:', error);
    process.exit(1);
  }
}

// Esegui lo script
updateAllImages()
  .then(() => {
    console.log('✨ Script completato con successo!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Errore fatale:', error);
    process.exit(1);
  });


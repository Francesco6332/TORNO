import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { CACHE_DURATION } from '@/config/constants';
import { cacheManager } from '@/utils/cache';
import { removeUndefinedValues } from '@/utils/firestoreUtils';
import type { DifficultyLevel, NewPassoInput, Passo, VehicleType } from '@/types';

const COLLECTION_NAME = 'passi';
const CACHE_KEY_ALL = 'passi_all';
const CACHE_KEY_DETAIL = 'passo_detail_';
const collectionRef = collection(db, COLLECTION_NAME);

const clearPassiCache = (id?: string) => {
  cacheManager.remove(CACHE_KEY_ALL);
  if (id) {
    cacheManager.remove(`${CACHE_KEY_DETAIL}${id}`);
  }
};

export const passiService = {
  async getAll(): Promise<Passo[]> {
    const cached = cacheManager.get<Passo[]>(CACHE_KEY_ALL);
    if (cached) {
      return cached;
    }

    try {
      const q = query(collectionRef, orderBy('name'));
      const querySnapshot = await getDocs(q);
      
      const passi: Passo[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as Passo[];

      cacheManager.set(CACHE_KEY_ALL, passi, CACHE_DURATION.PASSI);
      return passi;
    } catch (error) {
      console.error('Error fetching passi:', error);
      throw error;
    }
  },

  async getById(id: string): Promise<Passo | null> {
    const cacheKey = `${CACHE_KEY_DETAIL}${id}`;
    const cached = cacheManager.get<Passo>(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return null;
      }

      const passo: Passo = {
        id: docSnap.id,
        ...docSnap.data(),
        createdAt: docSnap.data().createdAt?.toDate() || new Date(),
        updatedAt: docSnap.data().updatedAt?.toDate() || new Date(),
      } as Passo;

      cacheManager.set(cacheKey, passo, CACHE_DURATION.PASSI);
      return passo;
    } catch (error) {
      console.error('Error fetching passo:', error);
      throw error;
    }
  },

  async create(input: NewPassoInput): Promise<string> {
    const docRef = await addDoc(collectionRef, {
      ...removeUndefinedValues(input),
      upvotedBy: [],
      upvoteCount: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    clearPassiCache();
    return docRef.id;
  },

  async toggleUpvote(id: string, userId: string): Promise<{ upvotedBy: string[]; upvoteCount: number }> {
    const docRef = doc(db, COLLECTION_NAME, id);

    const result = await runTransaction(db, async (transaction) => {
      const snapshot = await transaction.get(docRef);

      if (!snapshot.exists()) {
        throw new Error('Passo not found');
      }

      const data = snapshot.data();
      const currentUpvotedBy = Array.isArray(data.upvotedBy) ? data.upvotedBy as string[] : [];
      const hasUpvoted = currentUpvotedBy.includes(userId);
      const upvotedBy = hasUpvoted
        ? currentUpvotedBy.filter((id) => id !== userId)
        : [...currentUpvotedBy, userId];

      transaction.update(docRef, {
        upvotedBy,
        upvoteCount: upvotedBy.length,
        updatedAt: serverTimestamp(),
      });

      return { upvotedBy, upvoteCount: upvotedBy.length };
    });

    clearPassiCache(id);
    return result;
  },

  async getByDifficulty(difficulty: DifficultyLevel): Promise<Passo[]> {
    const allPassi = await this.getAll();
    return allPassi.filter(p => p.difficulty === difficulty);
  },

  async getByVehicleType(vehicleType: VehicleType): Promise<Passo[]> {
    const allPassi = await this.getAll();
    return allPassi.filter(p => p.vehicleType === vehicleType || p.vehicleType === 'both');
  },

  async getByRegion(region: string): Promise<Passo[]> {
    const allPassi = await this.getAll();
    return allPassi.filter(p => p.region.toLowerCase() === region.toLowerCase());
  },

  async search(query: string): Promise<Passo[]> {
    const allPassi = await this.getAll();
    const lowerQuery = query.toLowerCase();
    
    return allPassi.filter(p => 
      p.name.toLowerCase().includes(lowerQuery) ||
      p.region.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery) ||
      p.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  },
};

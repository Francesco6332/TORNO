import { collection, getDocs, doc, getDoc, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { CACHE_DURATION } from '@/config/constants';
import { cacheManager } from '@/utils/cache';
import type { Passo, DifficultyLevel, VehicleType } from '@/types';

const COLLECTION_NAME = 'passi';
const CACHE_KEY_ALL = 'passi_all';
const CACHE_KEY_DETAIL = 'passo_detail_';

export const passiService = {
  async getAll(): Promise<Passo[]> {
    const cached = cacheManager.get<Passo[]>(CACHE_KEY_ALL);
    if (cached) {
      return cached;
    }

    try {
      const q = query(collection(db, COLLECTION_NAME), orderBy('name'));
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


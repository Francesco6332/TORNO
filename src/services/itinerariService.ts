import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import type { Itinerary, NewItineraryInput } from '@/types';

const COLLECTION = 'itinerari';
const collectionRef = collection(db, COLLECTION);

const toDate = (value: unknown): Date => {
  if (value instanceof Date) {
    return value;
  }

  if (value && typeof value === 'object' && 'toDate' in value && typeof value.toDate === 'function') {
    return value.toDate();
  }

  return new Date();
};

const normalizeItinerary = (id: string, data: Record<string, unknown>): Itinerary => ({
  ...(data as Omit<Itinerary, 'id' | 'createdAt' | 'updatedAt'>),
  id,
  createdAt: toDate(data.createdAt),
  updatedAt: toDate(data.updatedAt),
});

export const itinerariService = {
  async getAll(): Promise<Itinerary[]> {
    const snapshot = await getDocs(collectionRef);
    return snapshot.docs
      .map((document) => normalizeItinerary(document.id, document.data()))
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  },

  async getById(id: string): Promise<Itinerary | null> {
    const snapshot = await getDoc(doc(db, COLLECTION, id));
    if (!snapshot.exists()) return null;
    return normalizeItinerary(snapshot.id, snapshot.data());
  },

  async create(input: NewItineraryInput): Promise<string> {
    const docRef = await addDoc(collectionRef, {
      ...input,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return docRef.id;
  },

  async search(searchText: string): Promise<Itinerary[]> {
    const snapshot = await getDocs(collectionRef);
    const lowerQuery = searchText.toLowerCase();

    return snapshot.docs
      .map((document) => normalizeItinerary(document.id, document.data()))
      .filter(
        (itinerary) =>
          itinerary.title.toLowerCase().includes(lowerQuery) ||
          itinerary.description.toLowerCase().includes(lowerQuery) ||
          itinerary.region.toLowerCase().includes(lowerQuery) ||
          itinerary.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery))
      );
  },
};

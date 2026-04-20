import { collection, getDocs, getDoc, doc } from "firebase/firestore";
import { db } from "../config/firebase";
import { Itinerary } from "../types";

const COLLECTION = 'itinerari';

export const itinerariService = {
    async getAll(): Promise<Itinerary[]>{
        const snapshot = await getDocs(collection(db, COLLECTION));
        return snapshot.docs.map(doc=>({
            id: doc.id,
            ...doc.data()
        } as Itinerary));
    },

    async getById(id: string): Promise<Itinerary | null> {
        const snapshot = await getDoc(doc(db, COLLECTION, id));
        if (!snapshot.exists()) return null;
        return {
            id: snapshot.id,
            ...snapshot.data()
        } as Itinerary;
    },

    async search(query: string): Promise<Itinerary[]> {
        const snapshot = await getDocs(collection(db, COLLECTION));
        const lowerQuery = query.toLowerCase();
        return snapshot.docs.map(d => ({
            id: d.id,
            ...d.data()
         } as Itinerary)).filter(i => i.title.toLowerCase().includes(lowerQuery) || i.description.toLowerCase().includes(lowerQuery));

    }
}

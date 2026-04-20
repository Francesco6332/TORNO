import {useQuery} from '@tanstack/react-query';
import { itinerariService } from '@/services/itinerariService';

export function useItinerari() {
    return useQuery({
        queryKey: ['itinerari'],
        queryFn: itinerariService.getAll,
    });
}

export function useItinerario(id: string) {
    return useQuery({
        queryKey: ['itinerari', id],
        queryFn: () => itinerariService.getById(id),
        enabled: !!id, // evita la query se id è falsy
    });
}

export function useSearchItinerari(searchQuery: string) {
    return useQuery({
        queryKey: ['itinerari', 'search', searchQuery],
        queryFn: () => itinerariService.search(searchQuery),
        enabled: searchQuery.length > 2, // esegue la query solo se la lunghezza è maggiore di 2
    });
}

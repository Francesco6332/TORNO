import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { itinerariService } from '@/services/itinerariService';
import type { NewItineraryInput } from '@/types';

export function useItinerari() {
  return useQuery({
    queryKey: ['itinerari'],
    queryFn: () => itinerariService.getAll(),
  });
}

export function useItinerario(id: string) {
  return useQuery({
    queryKey: ['itinerari', id],
    queryFn: () => itinerariService.getById(id),
    enabled: !!id,
  });
}

export function useSearchItinerari(searchQuery: string) {
  return useQuery({
    queryKey: ['itinerari', 'search', searchQuery],
    queryFn: () => itinerariService.search(searchQuery),
    enabled: searchQuery.length > 2,
  });
}

export function useCreateItinerary() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: NewItineraryInput) => itinerariService.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['itinerari'] });
    },
  });
}

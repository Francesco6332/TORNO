import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { passiService } from '@/services/passiService';
import type { DifficultyLevel, NewPassoInput, VehicleType } from '@/types';

export const usePassi = () => {
  return useQuery({
    queryKey: ['passi'],
    queryFn: () => passiService.getAll(),
  });
};

export const usePasso = (id: string) => {
  return useQuery({
    queryKey: ['passo', id],
    queryFn: () => passiService.getById(id),
    enabled: !!id,
  });
};

export const usePassiByDifficulty = (difficulty: DifficultyLevel) => {
  return useQuery({
    queryKey: ['passi', 'difficulty', difficulty],
    queryFn: () => passiService.getByDifficulty(difficulty),
  });
};

export const usePassiByVehicleType = (vehicleType: VehicleType) => {
  return useQuery({
    queryKey: ['passi', 'vehicle', vehicleType],
    queryFn: () => passiService.getByVehicleType(vehicleType),
  });
};

export const useSearchPassi = (searchQuery: string) => {
  return useQuery({
    queryKey: ['passi', 'search', searchQuery],
    queryFn: () => passiService.search(searchQuery),
    enabled: searchQuery.length > 2,
  });
};

export const useCreatePasso = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: NewPassoInput) => passiService.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['passi'] });
    },
  });
};

export const useTogglePassoUpvote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ passoId, userId }: { passoId: string; userId: string }) =>
      passiService.toggleUpvote(passoId, userId),
    onSuccess: (_result, variables) => {
      queryClient.invalidateQueries({ queryKey: ['passi'] });
      queryClient.invalidateQueries({ queryKey: ['passo', variables.passoId] });
    },
  });
};

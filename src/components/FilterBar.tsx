import { DIFFICULTY_LEVELS, VEHICLE_TYPES } from '@/config/constants';
import { Filter, X } from 'lucide-react';
import type { DifficultyLevel, VehicleType } from '@/types';
import clsx from 'clsx';

interface FilterBarProps {
  selectedDifficulty?: DifficultyLevel | null;
  selectedVehicleType?: VehicleType | null;
  onDifficultyChange: (difficulty: DifficultyLevel | null) => void;
  onVehicleTypeChange: (vehicleType: VehicleType | null) => void;
  onClearFilters: () => void;
}

export default function FilterBar({
  selectedDifficulty,
  selectedVehicleType,
  onDifficultyChange,
  onVehicleTypeChange,
  onClearFilters,
}: FilterBarProps) {
  const hasActiveFilters = selectedDifficulty || selectedVehicleType;

  return (
    <div className="bg-dark-800 rounded-lg p-4 border border-dark-700">
      <div className="flex items-center space-x-4 mb-4">
        <Filter className="w-5 h-5 text-primary-500" />
        <h3 className="text-lg font-display text-white">Filtri</h3>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="ml-auto flex items-center space-x-1 text-sm text-gray-400 hover:text-primary-500 transition-colors"
          >
            <X className="w-4 h-4" />
            <span>Rimuovi filtri</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Difficulty Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Difficoltà
          </label>
          <div className="flex flex-wrap gap-2">
            {Object.values(DIFFICULTY_LEVELS).map((level) => (
              <button
                key={level.value}
                onClick={() =>
                  onDifficultyChange(
                    selectedDifficulty === level.value ? null : (level.value as DifficultyLevel)
                  )
                }
                className={clsx(
                  'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                  selectedDifficulty === level.value
                    ? {
                        'bg-green-900/30 text-green-400 border border-green-700': level.color === 'green',
                        'bg-yellow-900/30 text-yellow-400 border border-yellow-700': level.color === 'yellow',
                        'bg-orange-900/30 text-orange-400 border border-orange-700': level.color === 'orange',
                        'bg-red-900/30 text-red-400 border border-red-700': level.color === 'red',
                      }
                    : 'bg-dark-700 text-gray-400 hover:bg-dark-600 border border-dark-600'
                )}
              >
                {level.icon} {level.label}
              </button>
            ))}
          </div>
        </div>

        {/* Vehicle Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Tipo Veicolo
          </label>
          <div className="flex flex-wrap gap-2">
            {Object.entries(VEHICLE_TYPES).map(([key, value]) => (
              <button
                key={value}
                onClick={() =>
                  onVehicleTypeChange(
                    selectedVehicleType === value ? null : (value as VehicleType)
                  )
                }
                className={clsx(
                  'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                  selectedVehicleType === value
                    ? 'bg-primary-900/30 text-primary-400 border border-primary-700'
                    : 'bg-dark-700 text-gray-400 hover:bg-dark-600 border border-dark-600'
                )}
              >
                {value === 'motorcycle' ? '🏍️ Moto' : value === 'car' ? '🚗 Auto' : '🚗🏍️ Entrambi'}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


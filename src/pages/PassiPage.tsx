import { useState, useMemo } from 'react';
import { usePassi, useSearchPassi } from '@/hooks/usePassi';
import PassoCard from '@/components/PassoCard';
import FilterBar from '@/components/FilterBar';
import SearchBar from '@/components/SearchBar';
import Map from '@/components/Map';
import type { DifficultyLevel, VehicleType } from '@/types';

export default function PassiPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | null>(null);
  const [selectedVehicleType, setSelectedVehicleType] = useState<VehicleType | null>(null);
  const [showMap, setShowMap] = useState(false);

  const { data: allPassi = [], isLoading } = usePassi();
  const { data: searchResults = [] } = useSearchPassi(searchQuery);

  const filteredPassi = useMemo(() => {
    let passi = searchQuery.length > 2 ? searchResults : allPassi;

    if (selectedDifficulty) {
      passi = passi.filter(p => p.difficulty === selectedDifficulty);
    }

    if (selectedVehicleType) {
      passi = passi.filter(p => p.vehicleType === selectedVehicleType || p.vehicleType === 'both');
    }

    return passi;
  }, [allPassi, searchResults, searchQuery, selectedDifficulty, selectedVehicleType]);

  const handleClearFilters = () => {
    setSelectedDifficulty(null);
    setSelectedVehicleType(null);
    setSearchQuery('');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-display text-white mb-4">
          Passi di Montagna
        </h1>
        <p className="text-gray-400">
          Esplora {allPassi.length} passi disponibili per motociclisti e automobilisti
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <SearchBar onSearch={setSearchQuery} />
        <FilterBar
          selectedDifficulty={selectedDifficulty}
          selectedVehicleType={selectedVehicleType}
          onDifficultyChange={setSelectedDifficulty}
          onVehicleTypeChange={setSelectedVehicleType}
          onClearFilters={handleClearFilters}
        />
      </div>

      {/* Toggle Map View */}
      <div className="mb-6 flex justify-end">
        <button
          onClick={() => setShowMap(!showMap)}
          className="px-4 py-2 bg-dark-800 hover:bg-dark-700 text-white rounded-lg border border-dark-700 transition-colors text-sm font-medium"
        >
          {showMap ? 'Mostra Lista' : 'Mostra Mappa'}
        </button>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-dark-800 rounded-lg h-64 animate-pulse" />
          ))}
        </div>
      ) : filteredPassi.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg mb-2">Nessun passo trovato</p>
          <p className="text-gray-500 text-sm">
            Prova a modificare i filtri o la ricerca
          </p>
        </div>
      ) : showMap ? (
        <div className="h-[600px] mb-6">
          <Map passi={filteredPassi} />
        </div>
      ) : (
        <>
          <div className="mb-4 text-sm text-gray-400">
            Trovati {filteredPassi.length} passi
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPassi.map((passo) => (
              <PassoCard key={passo.id} passo={passo} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}


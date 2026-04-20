import { useState, useMemo } from 'react';
import { usePassi, useSearchPassi } from '@/hooks/usePassi';
import PassoCard from '@/components/PassoCard';
import FilterBar from '@/components/FilterBar';
import SearchBar from '@/components/SearchBar';
import Map from '@/components/Map';
import { Map as MapIcon, List } from 'lucide-react';
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
    if (selectedDifficulty) passi = passi.filter(p => p.difficulty === selectedDifficulty);
    if (selectedVehicleType) passi = passi.filter(p => p.vehicleType === selectedVehicleType || p.vehicleType === 'both');
    return passi;
  }, [allPassi, searchResults, searchQuery, selectedDifficulty, selectedVehicleType]);

  const handleClearFilters = () => {
    setSelectedDifficulty(null);
    setSelectedVehicleType(null);
    setSearchQuery('');
  };

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Page header */}
      <div className="mb-10">
        <h1 className="text-5xl md:text-6xl font-display text-white mb-3">
          Passi di Montagna
        </h1>
        <p className="text-gray-400">
          Esplora {allPassi.length} passi disponibili per motociclisti e automobilisti
        </p>
      </div>

      {/* Search + Filters — glass panel */}
      <div className="glass-card rounded-2xl p-5 mb-8 space-y-4">
        <SearchBar onSearch={setSearchQuery} />
        <FilterBar
          selectedDifficulty={selectedDifficulty}
          selectedVehicleType={selectedVehicleType}
          onDifficultyChange={setSelectedDifficulty}
          onVehicleTypeChange={setSelectedVehicleType}
          onClearFilters={handleClearFilters}
        />
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-sm text-gray-500">
          {filteredPassi.length} {filteredPassi.length === 1 ? 'passo' : 'passi'} trovati
        </span>
        <button
          onClick={() => setShowMap(!showMap)}
          className="btn-secondary inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-gray-300"
        >
          {showMap ? (
            <><List className="w-4 h-4" /> Lista</>
          ) : (
            <><MapIcon className="w-4 h-4" /> Mappa</>
          )}
        </button>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="glass-card rounded-2xl h-72 animate-pulse" />
          ))}
        </div>
      ) : filteredPassi.length === 0 ? (
        <div className="glass-card rounded-2xl p-16 text-center">
          <p className="text-gray-300 text-lg mb-2">Nessun passo trovato</p>
          <p className="text-gray-500 text-sm">
            Prova a modificare i filtri o la ricerca
          </p>
        </div>
      ) : showMap ? (
        <div className="glass-card rounded-2xl p-1.5">
          <div className="h-[600px] rounded-xl overflow-hidden w-full">
            <Map passi={filteredPassi} className="w-full h-full" />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPassi.map((passo) => (
            <PassoCard key={passo.id} passo={passo} />
          ))}
        </div>
      )}
    </div>
  );
}
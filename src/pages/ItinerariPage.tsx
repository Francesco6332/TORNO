import { useMemo, useState } from 'react';
import { useItinerari, useSearchItinerari } from '@/hooks/useItinerari';
import ItinerarioCard from '@/components/ItinerarioCard';
import FilterBar from '@/components/FilterBar';
import SearchBar from '@/components/SearchBar';
import Map from '@/components/Map';
import { Map as MapIcon, List } from 'lucide-react';
import type { DifficultyLevel, VehicleType } from '@/types';
import { useTranslation } from '@/i18n/useTranslation';
import clsx from 'clsx';

export default function ItinerariPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | null>(null);
    const [selectedVehicleType, setSelectedVehicleType] = useState<VehicleType | null>(null);
    const [showMap, setShowMap] = useState(false);

    const { data: allItinerari = [], isLoading } = useItinerari();
    const { data: searchResults = [] } = useSearchItinerari(searchQuery);
    const { t } = useTranslation();

    const filteredItinerari = useMemo(() => {
        let itinerari = searchQuery.length > 2 ? searchResults : allItinerari;
        if (selectedDifficulty) {
            itinerari = itinerari.filter((itinerary) => itinerary.difficulty === selectedDifficulty);
        }
        if (selectedVehicleType) {
            itinerari = itinerari.filter(
                (itinerary) =>
                    itinerary.vehicleType === selectedVehicleType || itinerary.vehicleType === 'both'
            );
        }
        return itinerari;
    }, [allItinerari, searchResults, searchQuery, selectedDifficulty, selectedVehicleType]);

    const handleClearFilters = () => {
        setSelectedDifficulty(null);
        setSelectedVehicleType(null);
        setSearchQuery('');
    };
    const resultsKey =
        filteredItinerari.length === 1 ? 'itinerari.results.one' : 'itinerari.results.other';

    return (
        <div className="container mx-auto px-4 py-10">
            {/* Page header */}
            <div className="mb-10">
                <h1 className="text-5xl md:text-6xl font-display text-white mb-3">
                    {t('itinerari.title')}
                </h1>
                <p className="text-gray-400">
                    {t('itinerari.subtitle', { count: allItinerari.length })}
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
                    {t(resultsKey, { count: filteredItinerari.length })}
                </span>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowMap(true)}
                        className={clsx(
                            'flex items-center gap-1 px-3 py-1 rounded-full text-sm transition-all duration-200',
                            showMap ? 'bg-primary-600/90 text-white shadow-lg shadow-primary-900/40' : 'bg-black/40 text-gray-300 hover:text-primary-400 hover:bg-black/60 border border-white/10'
                        )}
                    >
                        <MapIcon className="w-4 h-4" />
                        {t('itinerari.showMap')}
                    </button>
                    <button
                        onClick={() => setShowMap(false)}
                        className={clsx(
                            'flex items-center gap-1 px-3 py-1 rounded-full text-sm transition-all duration-200',
                            !showMap ? 'bg-primary-600/90 text-white shadow-lg shadow-primary-900/40' : 'bg-black/40 text-gray-300 hover:text-primary-400 hover:bg-black/60 border border-white/10'
                        )}
                    >
                        <List className="w-4 h-4" />
                        {t('itinerari.showList')}
                    </button>
                </div>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, index) => (
                        <div key={index} className="glass-card rounded-2xl h-72 animate-pulse" />
                    ))}
                </div>
            ) : filteredItinerari.length === 0 ? (
                <div className="glass-card rounded-2xl p-16 text-center">
                    <p className="text-gray-300 text-lg mb-2">{t('itinerari.emptyTitle')}</p>
                    <p className="text-gray-500 text-sm">{t('itinerari.emptyText')}</p>
                </div>
            ) : showMap ? (
                <div className="h-[600px]">
                    <Map itineraries={filteredItinerari} />
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredItinerari.map((itinerary) => (
                        <ItinerarioCard key={itinerary.id} itinerary={itinerary} />
                    ))}
                </div>
            )}
        </div>
    );
}

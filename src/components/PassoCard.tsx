import { Link } from 'react-router-dom';
import { MapPin, TrendingUp, Gauge } from 'lucide-react';
import { DIFFICULTY_LEVELS } from '@/config/constants';
import { favoritesStorage } from '@/utils/storage';
import { Heart } from 'lucide-react';
import { useState } from 'react';
import type { Passo } from '@/types';
import clsx from 'clsx';

interface PassoCardProps {
  passo: Passo;
}

export default function PassoCard({ passo }: PassoCardProps) {
  const [isFavorite, setIsFavorite] = useState(favoritesStorage.has(passo.id));
  const difficulty = DIFFICULTY_LEVELS[passo.difficulty.toUpperCase() as keyof typeof DIFFICULTY_LEVELS];

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isFavorite) {
      favoritesStorage.remove(passo.id);
    } else {
      favoritesStorage.add(passo.id);
    }
    setIsFavorite(!isFavorite);
  };

  return (
    <Link
      to={`/passi/${passo.id}`}
      className="group block bg-dark-800 rounded-lg overflow-hidden border border-dark-700 hover:border-primary-600 transition-all duration-300 hover:shadow-lg hover:shadow-primary-900/20"
    >
      <div className="relative h-48 bg-gradient-to-br from-dark-700 to-dark-900 overflow-hidden">
        {passo.images && passo.images[0] ? (
          <img
            src={passo.images[0]}
            alt={passo.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <MapPin className="w-16 h-16 text-dark-600" />
          </div>
        )}
        <div className="absolute inset-0 gradient-overlay"></div>
        <button
          onClick={toggleFavorite}
          className={clsx(
            "absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-colors",
            isFavorite
              ? "bg-primary-600 text-white"
              : "bg-dark-900/50 text-gray-400 hover:text-primary-500"
          )}
        >
          <Heart className={clsx("w-5 h-5", isFavorite && "fill-current")} />
        </button>
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-xl font-display text-white text-shadow mb-1">
            {passo.name}
          </h3>
          <div className="flex items-center space-x-2 text-sm text-gray-200">
            <MapPin className="w-4 h-4" />
            <span>{passo.region}</span>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className={clsx(
              "px-2 py-1 rounded text-xs font-semibold",
              difficulty.color === 'green' && "bg-green-900/30 text-green-400",
              difficulty.color === 'yellow' && "bg-yellow-900/30 text-yellow-400",
              difficulty.color === 'orange' && "bg-orange-900/30 text-orange-400",
              difficulty.color === 'red' && "bg-red-900/30 text-red-400",
            )}>
              {difficulty.icon} {difficulty.label}
            </span>
            <span className="px-2 py-1 rounded text-xs font-medium bg-dark-700 text-gray-400">
              {passo.vehicleType === 'both' ? 'Moto/Auto' : passo.vehicleType === 'motorcycle' ? 'Moto' : 'Auto'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center space-x-2 text-gray-400">
            <TrendingUp className="w-4 h-4 text-primary-500" />
            <span>{passo.elevation.toLocaleString()} m</span>
          </div>
          {passo.length && (
            <div className="flex items-center space-x-2 text-gray-400">
              <Gauge className="w-4 h-4 text-primary-500" />
              <span>{passo.length} km</span>
            </div>
          )}
        </div>

        {passo.description && (
          <p className="mt-3 text-sm text-gray-400 line-clamp-2">
            {passo.description}
          </p>
        )}
      </div>
    </Link>
  );
}


import { Link } from 'react-router-dom';
import { MapPin, TrendingUp, Gauge } from 'lucide-react';
import { DIFFICULTY_LEVELS } from '@/config/constants';
import { favoritesStorage } from '@/utils/storage';
import { Heart } from 'lucide-react';
import { useState } from 'react';
import type { Passo } from '@/types';
import clsx from 'clsx';
import { getPassoImageUrlCandidates } from '@/utils/imageUtils';

interface PassoCardProps {
  passo: Passo;
}

export default function PassoCard({ passo }: PassoCardProps) {
  const [isFavorite, setIsFavorite] = useState(favoritesStorage.has(passo.id));
  const [imageError, setImageError] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const difficulty = DIFFICULTY_LEVELS[passo.difficulty.toUpperCase() as keyof typeof DIFFICULTY_LEVELS];

  const imageUrls = getPassoImageUrlCandidates(passo);
  const imageUrl = imageUrls[imageIndex];

  const handleImageError = () => {
    if (imageIndex < imageUrls.length - 1) {
      setImageIndex((current) => current + 1);
      return;
    }
    setImageError(true);
  };

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
      className="group block glass-card rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5"
    >
      {/* Image */}
      <div className="relative h-48 bg-gradient-to-br from-dark-800 to-dark-950 overflow-hidden">
        {imageUrl && imageUrl.length > 0 && !imageError ? (
          <>
            <img
              src={imageUrl}
              alt={passo.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
              onError={handleImageError}
            />
            <div className="absolute inset-0 gradient-overlay pointer-events-none" />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <MapPin className="w-14 h-14 text-white/10" />
          </div>
        )}

        {/* Favorite button */}
        <button
          onClick={toggleFavorite}
          className={clsx(
            'absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all duration-200',
            isFavorite
              ? 'bg-primary-600/90 text-white shadow-lg shadow-primary-900/40'
              : 'bg-black/40 text-gray-300 hover:text-primary-400 hover:bg-black/60 border border-white/10'
          )}
        >
          <Heart className={clsx('w-4 h-4', isFavorite && 'fill-current')} />
        </button>

        {/* Name overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-xl font-display text-white text-shadow mb-0.5">
            {passo.name}
          </h3>
          <div className="flex items-center gap-1.5 text-xs text-gray-300/80">
            <MapPin className="w-3 h-3" />
            <span>{passo.region}</span>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="p-4 bg-black/20">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={clsx(
              'px-2.5 py-0.5 rounded-full text-xs font-semibold',
              difficulty.color === 'green' && 'bg-green-500/15 text-green-400 border border-green-500/20',
              difficulty.color === 'yellow' && 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/20',
              difficulty.color === 'orange' && 'bg-orange-500/15 text-orange-400 border border-orange-500/20',
              difficulty.color === 'red' && 'bg-red-500/15 text-red-400 border border-red-500/20',
            )}>
              {difficulty.icon} {difficulty.label}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/6 text-gray-400 border border-white/8">
              {passo.vehicleType === 'both' ? 'Moto/Auto' : passo.vehicleType === 'motorcycle' ? 'Moto' : 'Auto'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-1.5 text-gray-400">
            <TrendingUp className="w-3.5 h-3.5 text-primary-500/70" />
            <span>{passo.elevation.toLocaleString()} m</span>
          </div>
          {passo.length && (
            <div className="flex items-center gap-1.5 text-gray-400">
              <Gauge className="w-3.5 h-3.5 text-primary-500/70" />
              <span>{passo.length} km</span>
            </div>
          )}
        </div>

        {passo.description && (
          <p className="mt-3 text-xs text-gray-500 line-clamp-2 leading-relaxed">
            {passo.description}
          </p>
        )}
      </div>
    </Link>
  );
}
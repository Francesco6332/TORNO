import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, MapPin, TrendingUp, Gauge, Calendar, Heart } from 'lucide-react';
import { usePasso } from '@/hooks/usePassi';
import { useWeather } from '@/hooks/useWeather';
import Map from '@/components/Map';
import WeatherWidget from '@/components/WeatherWidget';
import { DIFFICULTY_LEVELS } from '@/config/constants';
import { favoritesStorage, recentViewsStorage } from '@/utils/storage';
import { useState, useEffect } from 'react';
import clsx from 'clsx';
import { format } from 'date-fns';
import { it } from 'date-fns/locale/it';
import { getPassoImageUrl } from '@/utils/imageUtils';

export default function PassoDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: passo, isLoading, error } = usePasso(id || '');
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageError, setImageError] = useState(false);

  const imageUrl = passo ? getPassoImageUrl(passo) : null;

  useEffect(() => {
    if (passo) {
      setIsFavorite(favoritesStorage.has(passo.id));
      recentViewsStorage.add(passo.id);
      setImageError(false); // Reset error quando cambia passo
    }
  }, [passo]);

  const { data: weather } = useWeather(
    passo?.coordinates.lat || 0,
    passo?.coordinates.lng || 0,
    !!passo
  );

  const toggleFavorite = () => {
    if (!passo) return;
    
    if (isFavorite) {
      favoritesStorage.remove(passo.id);
    } else {
      favoritesStorage.add(passo.id);
    }
    setIsFavorite(!isFavorite);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-dark-800 rounded w-1/3"></div>
          <div className="h-64 bg-dark-800 rounded"></div>
          <div className="h-32 bg-dark-800 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !passo) {
    return <Navigate to="/passi" replace />;
  }

  const difficulty = DIFFICULTY_LEVELS[passo.difficulty.toUpperCase() as keyof typeof DIFFICULTY_LEVELS];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Link
        to="/passi"
        className="inline-flex items-center space-x-2 text-gray-400 hover:text-primary-500 transition-colors mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Torna ai passi</span>
      </Link>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-display text-white mb-2">
              {passo.name}
            </h1>
            <div className="flex items-center space-x-4 text-gray-400">
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4" />
                <span>{passo.region}</span>
              </div>
              {passo.updatedAt && (
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Aggiornato {format(passo.updatedAt, 'd MMMM yyyy', { locale: it })}
                  </span>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={toggleFavorite}
            className={clsx(
              'p-3 rounded-lg transition-colors',
              isFavorite
                ? 'bg-primary-600 text-white'
                : 'bg-dark-800 text-gray-400 hover:text-primary-500 border border-dark-700'
            )}
          >
            <Heart className={clsx('w-6 h-6', isFavorite && 'fill-current')} />
          </button>
        </div>

        {/* Difficulty Badge */}
        <div className="flex items-center space-x-2">
          <span className={clsx(
            'px-3 py-1 rounded-md text-sm font-semibold',
            difficulty.color === 'green' && 'bg-green-900/30 text-green-400',
            difficulty.color === 'yellow' && 'bg-yellow-900/30 text-yellow-400',
            difficulty.color === 'orange' && 'bg-orange-900/30 text-orange-400',
            difficulty.color === 'red' && 'bg-red-900/30 text-red-400',
          )}>
            {difficulty.icon} {difficulty.label}
          </span>
          <span className="px-3 py-1 rounded-md text-sm font-medium bg-dark-800 text-gray-400 border border-dark-700">
            {passo.vehicleType === 'both' ? 'Moto/Auto' : passo.vehicleType === 'motorcycle' ? 'Moto' : 'Auto'}
          </span>
        </div>
      </div>

      {/* Main Image */}
      {imageUrl && !imageError && (
        <div className="mb-8 rounded-lg overflow-hidden">
          <img
            src={imageUrl}
            alt={passo.name}
            className="w-full h-64 md:h-96 object-cover"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        </div>
      )}

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Description */}
          <section>
            <h2 className="text-2xl font-display text-white mb-4">Descrizione</h2>
            <p className="text-gray-300 leading-relaxed">{passo.description}</p>
          </section>

          {/* Stats */}
          <section className="bg-dark-800 rounded-lg p-6 border border-dark-700">
            <h2 className="text-2xl font-display text-white mb-4">Informazioni</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div>
                <div className="flex items-center space-x-2 text-gray-400 mb-1">
                  <TrendingUp className="w-5 h-5 text-primary-500" />
                  <span className="text-sm">Quota</span>
                </div>
                <p className="text-xl font-semibold text-white">
                  {passo.elevation.toLocaleString()} m
                </p>
              </div>
              {passo.length && (
                <div>
                  <div className="flex items-center space-x-2 text-gray-400 mb-1">
                    <Gauge className="w-5 h-5 text-primary-500" />
                    <span className="text-sm">Lunghezza</span>
                  </div>
                  <p className="text-xl font-semibold text-white">{passo.length} km</p>
                </div>
              )}
              {passo.maxGradient && (
                <div>
                  <div className="flex items-center space-x-2 text-gray-400 mb-1">
                    <TrendingUp className="w-5 h-5 text-primary-500" />
                    <span className="text-sm">Pendenza Max</span>
                  </div>
                  <p className="text-xl font-semibold text-white">{passo.maxGradient}%</p>
                </div>
              )}
              {passo.surface && (
                <div>
                  <div className="flex items-center space-x-2 text-gray-400 mb-1">
                    <MapPin className="w-5 h-5 text-primary-500" />
                    <span className="text-sm">Superficie</span>
                  </div>
                  <p className="text-xl font-semibold text-white capitalize">{passo.surface}</p>
                </div>
              )}
            </div>
          </section>

          {/* Map */}
          <section>
            <h2 className="text-2xl font-display text-white mb-4">Posizione</h2>
            <div className="h-96">
              <Map passi={[passo]} selectedPasso={passo} />
            </div>
          </section>

          {/* Tags */}
          {passo.tags && passo.tags.length > 0 && (
            <section>
              <h2 className="text-2xl font-display text-white mb-4">Tag</h2>
              <div className="flex flex-wrap gap-2">
                {passo.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-dark-800 text-gray-400 rounded-md text-sm border border-dark-700"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {weather && (
            <WeatherWidget lat={passo.coordinates.lat} lng={passo.coordinates.lng} />
          )}
        </div>
      </div>
    </div>
  );
}


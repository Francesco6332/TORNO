import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, MapPin, TrendingUp, Gauge, Calendar, Heart } from 'lucide-react';
import { usePasso } from '@/hooks/usePassi';
import Map from '@/components/Map';
import WeatherWidget from '@/components/WeatherWidget';
import { DIFFICULTY_LEVELS } from '@/config/constants';
import { favoritesStorage, recentViewsStorage } from '@/utils/storage';
import { useState, useEffect } from 'react';
import clsx from 'clsx';
import { format } from 'date-fns';
import { it } from 'date-fns/locale/it';
import { enUS } from 'date-fns/locale/en-US';
import { getPassoImageUrlCandidates } from '@/utils/imageUtils';
import { useTranslation } from '@/i18n/useTranslation';
import { useAuth } from '@/contexts/AuthContext';
import { useTogglePassoUpvote } from '@/hooks/usePassi';
import UpvoteButton from '@/components/UpvoteButton';

export default function PassoDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: passo, isLoading, error } = usePasso(id || '');
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [voteError, setVoteError] = useState(false);
  const { language, t } = useTranslation();
  const { user, signInWithGoogle } = useAuth();
  const toggleUpvoteMutation = useTogglePassoUpvote();

  const imageUrls = passo ? getPassoImageUrlCandidates(passo) : [];
  const imageUrl = imageUrls[imageIndex];

  const handleImageError = () => {
    if (imageIndex < imageUrls.length - 1) {
      setImageIndex((current) => current + 1);
      return;
    }
    setImageError(true);
  };

  useEffect(() => {
    if (passo) {
      setIsFavorite(favoritesStorage.has(passo.id));
      recentViewsStorage.add(passo.id);
      setImageError(false);
      setImageIndex(0);
    }
  }, [passo]);

  const toggleFavorite = () => {
    if (!passo) return;
    if (isFavorite) {
      favoritesStorage.remove(passo.id);
    } else {
      favoritesStorage.add(passo.id);
    }
    setIsFavorite(!isFavorite);
  };

  const handleUpvote = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setVoteError(false);

    if (!passo) return;

    try {
      if (!user) {
        await signInWithGoogle();
        return;
      }

      await toggleUpvoteMutation.mutateAsync({ passoId: passo.id, userId: user.uid });
    } catch {
      setVoteError(true);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="animate-pulse space-y-6">
          <div className="h-8 glass-card rounded-xl w-1/4" />
          <div className="h-72 glass-card rounded-2xl" />
          <div className="h-40 glass-card rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error || !passo) return <Navigate to="/passi" replace />;

  const difficulty = DIFFICULTY_LEVELS[passo.difficulty.toUpperCase() as keyof typeof DIFFICULTY_LEVELS];
  const dateLocale = language === 'it' ? it : enUS;
  const upvoteCount = passo.upvoteCount ?? passo.upvotedBy?.length ?? 0;
  const isUpvoted = user ? Boolean(passo.upvotedBy?.includes(user.uid)) : false;

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Back */}
      <Link
        to="/passi"
        className="inline-flex items-center gap-2 text-gray-500 hover:text-primary-400 transition-colors mb-8 text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        {t('detail.back')}
      </Link>

      {/* Page header */}
      <div className="mb-8">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h1 className="text-5xl md:text-6xl font-display text-white mb-2">
              {passo.name}
            </h1>
            <div className="flex items-center flex-wrap gap-4 text-gray-400 text-sm">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                <span>{passo.region}</span>
              </div>
              {passo.updatedAt && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {t('detail.updated', {
                      date: format(passo.updatedAt, 'd MMMM yyyy', { locale: dateLocale }),
                    })}
                  </span>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={toggleFavorite}
            className={clsx(
              'p-3 rounded-xl transition-all duration-200 flex-shrink-0',
              isFavorite
                ? 'btn-primary text-white'
                : 'btn-secondary text-gray-400 hover:text-primary-400'
            )}
          >
            <Heart className={clsx('w-5 h-5', isFavorite && 'fill-current')} />
          </button>
          <UpvoteButton
            count={upvoteCount}
            isUpvoted={isUpvoted}
            isLoading={toggleUpvoteMutation.isPending}
            hasError={voteError}
            onClick={handleUpvote}
          />
        </div>

        {/* Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className={clsx(
            'px-3 py-1 rounded-full text-sm font-semibold',
            difficulty.color === 'green' && 'bg-green-500/15 text-green-400 border border-green-500/20',
            difficulty.color === 'yellow' && 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/20',
            difficulty.color === 'orange' && 'bg-orange-500/15 text-orange-400 border border-orange-500/20',
            difficulty.color === 'red' && 'bg-red-500/15 text-red-400 border border-red-500/20',
          )}>
            {difficulty.icon} {t(`difficulty.${difficulty.value}`)}
          </span>
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-white/6 text-gray-400 border border-white/8">
            {passo.vehicleType === 'both'
              ? t('vehicle.bothShort')
              : passo.vehicleType === 'motorcycle'
                ? t('vehicle.motorcycle')
                : t('vehicle.car')}
          </span>
        </div>
      </div>

      {/* Hero image */}
      {imageUrl && imageUrl.length > 0 && !imageError && (
        <div className="mb-10 rounded-2xl overflow-hidden glass-card p-1">
          <img
            src={imageUrl}
            alt={passo.name}
            className="w-full h-64 md:h-[28rem] object-cover rounded-xl"
            loading="lazy"
            onError={handleImageError}
          />
        </div>
      )}

      {/* Content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main */}
        <div className="lg:col-span-2 space-y-8">
          {/* Description */}
          <section className="glass-card rounded-2xl p-6">
            <h2 className="text-2xl font-display text-white mb-4">{t('detail.description')}</h2>
            <p className="text-gray-300 leading-relaxed">{passo.description}</p>
          </section>

          {/* Stats */}
          <section className="glass-card rounded-2xl p-6">
            <h2 className="text-2xl font-display text-white mb-6">{t('detail.info')}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div>
                <div className="flex items-center gap-2 text-gray-500 mb-1.5 text-xs uppercase tracking-wider">
                  <TrendingUp className="w-4 h-4 text-primary-500/60" />
                  {t('detail.elevation')}
                </div>
                <p className="text-2xl font-display text-white">{passo.elevation.toLocaleString()} m</p>
              </div>
              {passo.length && (
                <div>
                  <div className="flex items-center gap-2 text-gray-500 mb-1.5 text-xs uppercase tracking-wider">
                    <Gauge className="w-4 h-4 text-primary-500/60" />
                    {t('detail.length')}
                  </div>
                  <p className="text-2xl font-display text-white">{passo.length} km</p>
                </div>
              )}
              {passo.maxGradient && (
                <div>
                  <div className="flex items-center gap-2 text-gray-500 mb-1.5 text-xs uppercase tracking-wider">
                    <TrendingUp className="w-4 h-4 text-primary-500/60" />
                    {t('detail.maxGradient')}
                  </div>
                  <p className="text-2xl font-display text-white">{passo.maxGradient}%</p>
                </div>
              )}
              {passo.surface && (
                <div>
                  <div className="flex items-center gap-2 text-gray-500 mb-1.5 text-xs uppercase tracking-wider">
                    <MapPin className="w-4 h-4 text-primary-500/60" />
                    {t('detail.surface')}
                  </div>
                  <p className="text-2xl font-display text-white capitalize">{passo.surface}</p>
                </div>
              )}
            </div>
          </section>

          {/* Map */}
          <section>
            <h2 className="text-2xl font-display text-white mb-4">{t('detail.position')}</h2>
            <div className="glass-card rounded-2xl p-1.5">
              <div className="h-80 rounded-xl overflow-hidden">
                <Map passi={[passo]} selectedPasso={passo} />
              </div>
            </div>
          </section>

          {/* Tags */}
          {passo.tags && passo.tags.length > 0 && (
            <section>
              <h2 className="text-2xl font-display text-white mb-4">{t('detail.tags')}</h2>
              <div className="flex flex-wrap gap-2">
                {passo.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 glass rounded-full text-gray-400 text-sm"
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
          {voteError && (
            <div className="glass-red rounded-xl p-3 text-sm text-red-300">
              {t('votes.error')}
            </div>
          )}
          <WeatherWidget lat={passo.coordinates.lat} lng={passo.coordinates.lng} />
        </div>
      </div>
    </div>
  );
}

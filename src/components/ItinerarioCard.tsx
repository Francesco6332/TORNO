import { MapPin, Clock, TrendingUp, Route, Mountain } from 'lucide-react';
import { useState } from 'react';
import { DIFFICULTY_LEVELS } from '@/config/constants';
import { getImageUrlSafe } from '@/utils/imageUtils';
import { useTranslation } from '@/i18n/useTranslation';
import type { Itinerary } from '@/types';
import clsx from 'clsx';
import { useAuth } from '@/contexts/AuthContext';
import { useToggleItineraryUpvote } from '@/hooks/useItinerari';
import UpvoteButton from './UpvoteButton';

interface ItinerarioCardProps {
  itinerary: Itinerary;
}

export default function ItinerarioCard({ itinerary }: ItinerarioCardProps) {
  const [imageError, setImageError] = useState(false);
  const [voteError, setVoteError] = useState(false);
  const difficulty = DIFFICULTY_LEVELS[itinerary.difficulty.toUpperCase() as keyof typeof DIFFICULTY_LEVELS];
  const { t } = useTranslation();
  const { user, signInWithGoogle } = useAuth();
  const toggleUpvote = useToggleItineraryUpvote();

  const imageUrl =
    itinerary.images && itinerary.images.length > 0
      ? getImageUrlSafe(itinerary.images[0])
      : null;
  const passCountKey =
    itinerary.passi.length === 1 ? 'itinerari.passCount.one' : 'itinerari.passCount.other';
  const upvoteCount = itinerary.upvoteCount ?? itinerary.upvotedBy?.length ?? 0;
  const isUpvoted = user ? Boolean(itinerary.upvotedBy?.includes(user.uid)) : false;

  const handleUpvote = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setVoteError(false);

    try {
      if (!user) {
        await signInWithGoogle();
        return;
      }

      await toggleUpvote.mutateAsync({ itineraryId: itinerary.id, userId: user.uid });
    } catch {
      setVoteError(true);
    }
  };

  return (
    <article
      className="group block glass-card rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5"
    >
      {/* Image */}
      <div className="relative h-48 bg-gradient-to-br from-dark-800 to-dark-950 overflow-hidden">
        {imageUrl && !imageError ? (
          <>
            <img
              src={imageUrl}
              alt={itinerary.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
              onError={() => setImageError(true)}
            />
            <div className="absolute inset-0 gradient-overlay pointer-events-none" />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Route className="w-14 h-14 text-white/10" />
          </div>
        )}

        {/* Passi count badge */}
        {itinerary.passi.length > 0 && (
          <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-xs text-gray-300">
            <Mountain className="w-3 h-3" />
            <span>{t(passCountKey, { count: itinerary.passi.length })}</span>
          </div>
        )}
        <div className="absolute top-3 right-3">
          <UpvoteButton
            count={upvoteCount}
            isUpvoted={isUpvoted}
            isLoading={toggleUpvote.isPending}
            hasError={voteError}
            compact
            onClick={handleUpvote}
          />
        </div>

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-xl font-display text-white text-shadow mb-0.5 line-clamp-1">
            {itinerary.title}
          </h3>
          <div className="flex items-center gap-1.5 text-xs text-gray-300/80">
            <MapPin className="w-3 h-3" />
            <span>{itinerary.region}</span>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="p-4 bg-black/20">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={clsx(
                'px-2.5 py-0.5 rounded-full text-xs font-semibold',
                difficulty.color === 'green' &&
                  'bg-green-500/15 text-green-400 border border-green-500/20',
                difficulty.color === 'yellow' &&
                  'bg-yellow-500/15 text-yellow-400 border border-yellow-500/20',
                difficulty.color === 'orange' &&
                  'bg-orange-500/15 text-orange-400 border border-orange-500/20',
                difficulty.color === 'red' &&
                  'bg-red-500/15 text-red-400 border border-red-500/20'
              )}
            >
              {difficulty.icon} {t(`difficulty.${difficulty.value}`)}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/6 text-gray-400 border border-white/8">
              {itinerary.vehicleType === 'both'
                ? t('vehicle.bothShort')
                : itinerary.vehicleType === 'motorcycle'
                  ? t('vehicle.motorcycle')
                  : t('vehicle.car')}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-sm">
          <div className="flex items-center gap-1.5 text-gray-400">
            <Route className="w-3.5 h-3.5 text-primary-500/70" />
            <span>{itinerary.totalLength} km</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-400">
            <TrendingUp className="w-3.5 h-3.5 text-primary-500/70" />
            <span>{itinerary.totalElevationGain.toLocaleString()} m</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-400">
            <Clock className="w-3.5 h-3.5 text-primary-500/70" />
            <span>{itinerary.estimatedTime}h</span>
          </div>
        </div>

        {itinerary.description && (
          <p className="mt-3 text-xs text-gray-500 line-clamp-2 leading-relaxed">
            {itinerary.description}
          </p>
        )}
      </div>
    </article>
  );
}

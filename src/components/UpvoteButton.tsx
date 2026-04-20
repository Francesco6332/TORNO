import { ThumbsUp } from 'lucide-react';
import clsx from 'clsx';
import { useTranslation } from '@/i18n/useTranslation';

interface UpvoteButtonProps {
  count?: number;
  isUpvoted?: boolean;
  isLoading?: boolean;
  compact?: boolean;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function UpvoteButton({
  count = 0,
  isUpvoted = false,
  isLoading = false,
  compact = false,
  onClick,
}: UpvoteButtonProps) {
  const { t } = useTranslation();

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isLoading}
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-full border backdrop-blur-md transition-all duration-200 disabled:opacity-60',
        compact ? 'px-2.5 py-1 text-xs' : 'px-3 py-2 text-sm',
        isUpvoted
          ? 'bg-primary-600/90 text-white border-primary-500 shadow-lg shadow-primary-900/30'
          : 'bg-black/40 text-gray-300 hover:text-primary-400 hover:bg-black/60 border-white/10'
      )}
      aria-label={isUpvoted ? t('votes.remove') : t('votes.add')}
      aria-pressed={isUpvoted}
    >
      <ThumbsUp className={compact ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
      <span>{count}</span>
    </button>
  );
}

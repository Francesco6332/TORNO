import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { User, Mail, LogOut, Heart, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePassi } from '@/hooks/usePassi';
import PassoCard from '@/components/PassoCard';
import { favoritesStorage, recentViewsStorage } from '@/utils/storage';
import { useTranslation } from '@/i18n/useTranslation';

export default function ProfilePage() {
  const { user, loading, signInWithGoogle, logout } = useAuth();
  const [error, setError] = useState('');
  const { t } = useTranslation();

  const { data: allPassi = [] } = usePassi();
  const favoriteIds = favoritesStorage.get();
  const recentIds = recentViewsStorage.get();

  const favorites = allPassi.filter(p => favoriteIds.includes(p.id));
  const recent = allPassi.filter(p => recentIds.includes(p.id));

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      await signInWithGoogle();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t('profile.googleError'));
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="animate-pulse space-y-6">
          <div className="h-36 glass-card rounded-2xl" />
          <div className="h-72 glass-card rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[70vh]">
        <div className="glass-card rounded-2xl p-10 w-full max-w-sm text-center">
          {/* Icon */}
          <div className="w-16 h-16 glass-red rounded-2xl flex items-center justify-center mx-auto mb-6">
            <User className="w-8 h-8 text-primary-400" />
          </div>

          <h1 className="text-4xl font-display text-white mb-2">{t('profile.signInTitle')}</h1>
          <p className="text-gray-400 text-sm mb-8">
            {t('profile.signInDescription')}
          </p>

          {error && (
            <div className="mb-6 p-3 glass-red rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handleGoogleSignIn}
            className="btn-secondary w-full flex items-center justify-center gap-3 px-5 py-3.5 text-white rounded-xl font-medium text-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {t('profile.googleSignIn')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      {/* User card */}
      <div className="glass-card rounded-2xl p-6 mb-10">
        <div className="flex items-center gap-4 mb-5">
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.displayName || t('profile.userAlt')}
              className="w-16 h-16 rounded-2xl ring-2 ring-white/10"
            />
          ) : (
            <div className="w-16 h-16 rounded-2xl glass-red flex items-center justify-center">
              <User className="w-8 h-8 text-primary-400" />
            </div>
          )}
          <div>
            <h1 className="text-3xl font-display text-white">
              {user.displayName || 'Utente'}
            </h1>
            <div className="flex items-center gap-1.5 text-gray-400 text-sm mt-0.5">
              <Mail className="w-3.5 h-3.5" />
              <span>{user.email}</span>
            </div>
          </div>
        </div>
        <button
          onClick={logout}
          className="btn-secondary inline-flex items-center gap-2 px-4 py-2 text-gray-300 rounded-xl text-sm font-medium"
        >
          <LogOut className="w-4 h-4" />
          {t('auth.signOut')}
        </button>
      </div>

      {/* Favorites */}
      <section className="mb-12">
        <div className="flex items-center gap-2 mb-6">
          <Heart className="w-5 h-5 text-primary-500" />
          <h2 className="text-3xl font-display text-white">{t('profile.favorites')}</h2>
          {favorites.length > 0 && (
            <span className="glass-red text-primary-400 text-xs font-semibold px-2 py-0.5 rounded-full ml-1">
              {favorites.length}
            </span>
          )}
        </div>
        {favorites.length === 0 ? (
          <div className="glass-card rounded-2xl p-10 text-center">
            <Heart className="w-10 h-10 text-white/10 mx-auto mb-4" />
            <p className="text-gray-400 mb-3">{t('profile.noFavorites')}</p>
            <Link to="/passi" className="text-primary-400 hover:text-primary-300 transition-colors text-sm">
              {t('profile.explorePasses')}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {favorites.map((passo) => (
              <PassoCard key={passo.id} passo={passo} />
            ))}
          </div>
        )}
      </section>

      {/* Recent Views */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <Clock className="w-5 h-5 text-primary-500" />
          <h2 className="text-3xl font-display text-white">{t('profile.recent')}</h2>
          {recent.length > 0 && (
            <span className="glass-red text-primary-400 text-xs font-semibold px-2 py-0.5 rounded-full ml-1">
              {recent.length}
            </span>
          )}
        </div>
        {recent.length === 0 ? (
          <div className="glass-card rounded-2xl p-10 text-center">
            <Clock className="w-10 h-10 text-white/10 mx-auto mb-4" />
            <p className="text-gray-400">{t('profile.noRecent')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {recent.map((passo) => (
              <PassoCard key={passo.id} passo={passo} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

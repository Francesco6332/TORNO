import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { User, Mail, LogOut, Heart, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePassi } from '@/hooks/usePassi';
import PassoCard from '@/components/PassoCard';
import { favoritesStorage, recentViewsStorage } from '@/utils/storage';

export default function ProfilePage() {
  const { user, loading, signIn, signUp, signInWithGoogle, logout } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { data: allPassi = [] } = usePassi();
  const favoriteIds = favoritesStorage.get();
  const recentIds = recentViewsStorage.get();

  const favorites = allPassi.filter(p => favoriteIds.includes(p.id));
  const recent = allPassi.filter(p => recentIds.includes(p.id));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (isSignUp) {
        await signUp(email, password);
      } else {
        await signIn(email, password);
      }
    } catch (err: any) {
      setError(err.message || 'Errore durante l\'autenticazione');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setError(err.message || 'Errore durante l\'autenticazione con Google');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-32 bg-dark-800 rounded"></div>
          <div className="h-64 bg-dark-800 rounded"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-md">
        <div className="bg-dark-800 rounded-lg p-8 border border-dark-700">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-display text-white mb-2">Accedi</h1>
            <p className="text-gray-400">
              {isSignUp ? 'Crea un account' : 'Accedi al tuo account'}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-900/30 border border-red-700 text-red-400 rounded-md text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="tuo@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
            >
              {isSignUp ? 'Registrati' : 'Accedi'}
            </button>
          </form>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-dark-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-dark-800 text-gray-400">oppure</span>
            </div>
          </div>

          <button
            onClick={handleGoogleSignIn}
            className="w-full px-4 py-3 bg-dark-900 hover:bg-dark-800 text-white rounded-lg font-medium transition-colors border border-dark-700 flex items-center justify-center space-x-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span>Continua con Google</span>
          </button>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-gray-400 hover:text-primary-500 transition-colors"
            >
              {isSignUp
                ? 'Hai già un account? Accedi'
                : 'Non hai un account? Registrati'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* User Info */}
      <div className="bg-dark-800 rounded-lg p-6 border border-dark-700 mb-8">
        <div className="flex items-center space-x-4 mb-4">
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.displayName || 'User'}
              className="w-16 h-16 rounded-full"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-dark-700 flex items-center justify-center">
              <User className="w-8 h-8 text-gray-400" />
            </div>
          )}
          <div>
            <h1 className="text-2xl font-display text-white">
              {user.displayName || 'Utente'}
            </h1>
            <div className="flex items-center space-x-2 text-gray-400">
              <Mail className="w-4 h-4" />
              <span>{user.email}</span>
            </div>
          </div>
        </div>
        <button
          onClick={logout}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-dark-900 hover:bg-dark-700 text-gray-300 rounded-lg transition-colors border border-dark-700"
        >
          <LogOut className="w-4 h-4" />
          <span>Esci</span>
        </button>
      </div>

      {/* Favorites */}
      <section className="mb-8">
        <div className="flex items-center space-x-2 mb-6">
          <Heart className="w-6 h-6 text-primary-500" />
          <h2 className="text-3xl font-display text-white">Preferiti</h2>
        </div>
        {favorites.length === 0 ? (
          <div className="bg-dark-800 rounded-lg p-8 border border-dark-700 text-center">
            <p className="text-gray-400 mb-4">Nessun passo nei preferiti</p>
            <Link
              to="/passi"
              className="text-primary-500 hover:text-primary-400 transition-colors"
            >
              Esplora i passi
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((passo) => (
              <PassoCard key={passo.id} passo={passo} />
            ))}
          </div>
        )}
      </section>

      {/* Recent Views */}
      <section>
        <div className="flex items-center space-x-2 mb-6">
          <Clock className="w-6 h-6 text-primary-500" />
          <h2 className="text-3xl font-display text-white">Visualizzati di Recente</h2>
        </div>
        {recent.length === 0 ? (
          <div className="bg-dark-800 rounded-lg p-8 border border-dark-700 text-center">
            <p className="text-gray-400">Nessun passo visualizzato di recente</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recent.map((passo) => (
              <PassoCard key={passo.id} passo={passo} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}


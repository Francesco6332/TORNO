import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { User, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from '@/i18n/useTranslation';

export default function Header() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useTranslation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="glass-strong sticky top-0 z-50 border-b border-white/5">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <div className="absolute inset-0 bg-primary-600 blur-xl opacity-40 group-hover:opacity-65 transition-opacity rounded-full" />
              <h1 className="text-3xl font-display text-primary-400 relative z-10 tracking-wider group-hover:text-primary-300 transition-colors">
                TORNØ
              </h1>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive('/')
                  ? 'text-primary-400 bg-white/10 border border-white/10'
                  : 'text-gray-400 hover:text-gray-100 hover:bg-white/6'
              }`}
            >
              {t('nav.home')}
            </Link>
            <Link
              to="/passi"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive('/passi')
                  ? 'text-primary-400 bg-white/10 border border-white/10'
                  : 'text-gray-400 hover:text-gray-100 hover:bg-white/6'
              }`}
            >
              {t('nav.passi')}
            </Link>
            {user && (
              <Link
                to="/profile"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive('/profile')
                    ? 'text-primary-400 bg-white/10 border border-white/10'
                    : 'text-gray-400 hover:text-gray-100 hover:bg-white/6'
                }`}
              >
                {t('nav.profile')}
              </Link>
            )}
          </nav>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-3">
            <LanguageSwitcher />
            {user ? (
              <button
                onClick={logout}
                className="btn-secondary flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-300 rounded-lg"
              >
                <LogOut className="w-4 h-4" />
                <span>{t('auth.signOut')}</span>
              </button>
            ) : (
              <Link
                to="/profile"
                className="btn-primary flex items-center space-x-2 px-4 py-2 text-white rounded-lg text-sm font-medium"
              >
                <User className="w-4 h-4" />
                <span>{t('auth.signIn')}</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden btn-secondary p-2 rounded-lg text-gray-300 hover:text-white transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/5">
            <nav className="flex flex-col space-y-1">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive('/')
                    ? 'text-primary-400 bg-white/10'
                    : 'text-gray-400 hover:text-gray-100 hover:bg-white/5'
                }`}
              >
                {t('nav.home')}
              </Link>
              <Link
                to="/passi"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive('/passi')
                    ? 'text-primary-400 bg-white/10'
                    : 'text-gray-400 hover:text-gray-100 hover:bg-white/5'
                }`}
              >
                {t('nav.passi')}
              </Link>
              {user && (
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive('/profile')
                      ? 'text-primary-400 bg-white/10'
                      : 'text-gray-400 hover:text-gray-100 hover:bg-white/5'
                  }`}
                >
                  {t('nav.profile')}
                </Link>
              )}
              <div className="pt-2">
                <div className="mb-3">
                  <LanguageSwitcher />
                </div>
                {user ? (
                  <button
                    onClick={() => { logout(); setMobileMenuOpen(false); }}
                    className="btn-secondary w-full flex items-center space-x-2 px-4 py-2.5 text-sm font-medium text-gray-300 rounded-lg"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{t('auth.signOut')}</span>
                  </button>
                ) : (
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn-primary flex items-center space-x-2 px-4 py-2.5 text-white rounded-lg text-sm font-medium"
                  >
                    <User className="w-4 h-4" />
                    <span>{t('auth.signIn')}</span>
                  </Link>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

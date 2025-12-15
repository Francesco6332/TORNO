import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { User, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-dark-900 border-b border-dark-800 sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <div className="absolute inset-0 bg-primary-600 blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <h1 className="text-3xl font-display text-primary-500 relative z-10 tracking-wider">
                TORNØ
              </h1>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/')
                  ? 'text-primary-500 bg-dark-800'
                  : 'text-gray-300 hover:text-primary-500 hover:bg-dark-800'
              }`}
            >
              Home
            </Link>
            <Link
              to="/passi"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/passi')
                  ? 'text-primary-500 bg-dark-800'
                  : 'text-gray-300 hover:text-primary-500 hover:bg-dark-800'
              }`}
            >
              Passi
            </Link>
            {user && (
              <Link
                to="/profile"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/profile')
                    ? 'text-primary-500 bg-dark-800'
                    : 'text-gray-300 hover:text-primary-500 hover:bg-dark-800'
                }`}
              >
                Profilo
              </Link>
            )}
          </nav>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <button
                onClick={logout}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-300 hover:text-primary-500 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Esci</span>
              </button>
            ) : (
              <Link
                to="/profile"
                className="flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md text-sm font-medium transition-colors"
              >
                <User className="w-4 h-4" />
                <span>Accedi</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-300 hover:text-primary-500 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-dark-800">
            <nav className="flex flex-col space-y-2">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/')
                    ? 'text-primary-500 bg-dark-800'
                    : 'text-gray-300 hover:text-primary-500'
                }`}
              >
                Home
              </Link>
              <Link
                to="/passi"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/passi')
                    ? 'text-primary-500 bg-dark-800'
                    : 'text-gray-300 hover:text-primary-500'
                }`}
              >
                Passi
              </Link>
              {user && (
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive('/profile')
                      ? 'text-primary-500 bg-dark-800'
                      : 'text-gray-300 hover:text-primary-500'
                  }`}
                >
                  Profilo
                </Link>
              )}
              {user ? (
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-300 hover:text-primary-500"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Esci</span>
                </button>
              ) : (
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-2 px-3 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md text-sm font-medium"
                >
                  <User className="w-4 h-4" />
                  <span>Accedi</span>
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}


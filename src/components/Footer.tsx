import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="glass-strong border-t border-white/5 relative z-10 mt-auto">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-display text-primary-400 mb-3">TORNØ</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              La tua guida ai passi di montagna per motociclisti e automobilisti in Italia.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Navigazione
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="text-gray-500 hover:text-gray-200 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/passi" className="text-gray-500 hover:text-gray-200 transition-colors">
                  Passi di Montagna
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-gray-500 hover:text-gray-200 transition-colors">
                  Profilo
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Legale
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#" className="text-gray-500 hover:text-gray-200 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-gray-200 transition-colors">
                  Termini di Servizio
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-gray-200 transition-colors">
                  Contatti
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-600">
            &copy; {new Date().getFullYear()} TORNØ. Tutti i diritti riservati.
          </p>
          <p className="text-xs text-gray-700">
            Fatto con passione per la montagna 🏔
          </p>
        </div>
      </div>
    </footer>
  );
}
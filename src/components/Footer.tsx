import { Link } from 'react-router-dom';
import { useTranslation } from '@/i18n/useTranslation';

export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="glass-strong border-t border-white/5 relative z-10 mt-auto">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-display text-primary-400 mb-3">TORNØ</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              {t('footer.description')}
            </p>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
              {t('footer.navigation')}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="text-gray-500 hover:text-gray-200 transition-colors">
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link to="/passi" className="text-gray-500 hover:text-gray-200 transition-colors">
                  {t('passi.title')}
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-gray-500 hover:text-gray-200 transition-colors">
                  {t('nav.profile')}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
              {t('footer.legal')}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <span className="text-gray-500">
                  {t('footer.privacy')}
                </span>
              </li>
              <li>
                <span className="text-gray-500">
                  {t('footer.terms')}
                </span>
              </li>
              <li>
                <span className="text-gray-500">
                  {t('footer.contact')}
                </span>
              </li>
            </ul>
          </div>
        </div>
        <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-600">
            {t('footer.rights', { year })}
          </p>
          <p className="text-xs text-gray-700">
            {t('footer.madeWith')}
          </p>
        </div>
      </div>
    </footer>
  );
}

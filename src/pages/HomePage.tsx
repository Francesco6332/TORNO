import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, TrendingUp, Users, ChevronDown } from 'lucide-react';
import { usePassi } from '@/hooks/usePassi';
import PassoCard from '@/components/PassoCard';
import Map from '@/components/Map';
import { useTranslation } from '@/i18n/useTranslation';

export default function HomePage() {
  const { data: passi = [], isLoading } = usePassi();
  const featuredPassi = passi.slice(0, 6);
  const { t } = useTranslation();

  return (
    <div>
      {/* ── Hero ── */}
      <section className="min-h-[92vh] flex flex-col items-center justify-center text-center px-4 relative overflow-hidden">
        {/* Extra radial glow centered behind the title */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 55% 45% at 50% 52%, rgba(185,28,28,0.14) 0%, transparent 70%)',
          }}
          aria-hidden
        />

        {/* Badge */}
        <div className="glass-red rounded-full px-4 py-1.5 inline-flex items-center gap-2 text-primary-300 text-sm font-medium mb-8 animate-fade-up relative z-10">
          <span className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-pulse" />
          {t('home.badge')}
        </div>

        {/* Main title */}
        <h1
          className="font-display leading-none tracking-widest text-white text-glow-red select-none relative z-10 mb-4"
          style={{ fontSize: 'clamp(5rem, 18vw, 16rem)' }}
        >
          TORN<span className="text-primary-500">Ø</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-gray-400 max-w-lg mb-10 relative z-10 leading-relaxed">
          {t('home.subtitle')}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 relative z-10">
          <Link
            to="/passi"
            className="btn-primary inline-flex items-center gap-2 px-8 py-3.5 text-white rounded-xl font-medium text-sm"
          >
            {t('home.explore')}
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="#stats"
            className="btn-secondary inline-flex items-center gap-2 px-8 py-3.5 text-gray-300 rounded-xl font-medium text-sm"
          >
            {t('home.learnMore')}
            <ChevronDown className="w-4 h-4" />
          </a>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gray-600 animate-bounce z-10" aria-hidden>
          <ChevronDown className="w-5 h-5" />
        </div>
      </section>

      {/* ── Stats ── */}
      <section id="stats" className="container mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="glass-red p-2.5 rounded-xl">
                <MapPin className="w-5 h-5 text-primary-400" />
              </div>
              <span className="text-3xl font-display text-white">{passi.length}</span>
            </div>
            <p className="text-gray-400 text-sm">{t('home.availablePasses')}</p>
          </div>

          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="glass-red p-2.5 rounded-xl">
                <TrendingUp className="w-5 h-5 text-primary-400" />
              </div>
              <span className="text-3xl font-display text-white">
                {Math.max(...passi.map(p => p.elevation), 0).toLocaleString()}m
              </span>
            </div>
            <p className="text-gray-400 text-sm">{t('home.maxElevation')}</p>
          </div>

          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="glass-red p-2.5 rounded-xl">
                <Users className="w-5 h-5 text-primary-400" />
              </div>
              <span className="text-3xl font-display text-white">2</span>
            </div>
            <p className="text-gray-400 text-sm">{t('home.vehicleTypes')}</p>
          </div>
        </div>
      </section>

      {/* ── Interactive Map ── */}
      {passi.length > 0 && (
        <section className="container mx-auto px-4 pb-20">
          <h2 className="text-3xl md:text-4xl font-display text-white mb-6">
            {t('home.mapTitle')}
          </h2>
          <div className="glass-card rounded-2xl p-1.5">
            <div className="h-96 rounded-xl overflow-hidden">
              <Map passi={passi} />
            </div>
          </div>
        </section>
      )}

      {/* ── Featured Passes ── */}
      <section className="container mx-auto px-4 pb-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl md:text-4xl font-display text-white">
            {t('home.featured')}
          </h2>
          <Link
            to="/passi"
            className="btn-secondary inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm text-gray-300"
          >
            {t('home.viewAll')}
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="glass-card rounded-2xl h-72 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredPassi.map((passo) => (
              <PassoCard key={passo.id} passo={passo} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

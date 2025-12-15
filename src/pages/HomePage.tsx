import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, TrendingUp, Users } from 'lucide-react';
import { usePassi } from '@/hooks/usePassi';
import PassoCard from '@/components/PassoCard';
import Map from '@/components/Map';

export default function HomePage() {
  const { data: passi = [], isLoading } = usePassi();
  const featuredPassi = passi.slice(0, 6);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center mb-12">
        <h1 className="text-5xl md:text-7xl font-display text-white mb-4 tracking-wider">
          TORNØ
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 mb-8 max-w-2xl mx-auto">
          Scopri i migliori passi di montagna per motociclisti e automobilisti
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/passi"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
          >
            <span>Esplora i Passi</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
          <div className="flex items-center space-x-3 mb-2">
            <MapPin className="w-8 h-8 text-primary-500" />
            <h3 className="text-2xl font-display text-white">{passi.length}</h3>
          </div>
          <p className="text-gray-400">Passi Disponibili</p>
        </div>
        <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
          <div className="flex items-center space-x-3 mb-2">
            <TrendingUp className="w-8 h-8 text-primary-500" />
            <h3 className="text-2xl font-display text-white">
              {Math.max(...passi.map(p => p.elevation), 0).toLocaleString()}m
            </h3>
          </div>
          <p className="text-gray-400">Quota Massima</p>
        </div>
        <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
          <div className="flex items-center space-x-3 mb-2">
            <Users className="w-8 h-8 text-primary-500" />
            <h3 className="text-2xl font-display text-white">2</h3>
          </div>
          <p className="text-gray-400">Tipi di Veicoli</p>
        </div>
      </section>

      {/* Map Section */}
      {passi.length > 0 && (
        <section className="mb-12">
          <h2 className="text-3xl font-display text-white mb-6">Mappa Interattiva</h2>
          <div className="h-96 rounded-lg overflow-hidden">
            <Map passi={passi} />
          </div>
        </section>
      )}

      {/* Featured Passi */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-display text-white">Passi in Evidenza</h2>
          <Link
            to="/passi"
            className="text-primary-500 hover:text-primary-400 transition-colors flex items-center space-x-1"
          >
            <span>Vedi tutti</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-dark-800 rounded-lg h-64 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredPassi.map((passo) => (
              <PassoCard key={passo.id} passo={passo} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}


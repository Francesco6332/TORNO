export default function Footer() {
  return (
    <footer className="bg-dark-900 border-t border-dark-800 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-display text-primary-500 mb-4">TORNØ</h3>
            <p className="text-gray-400 text-sm">
              La tua guida ai passi di montagna per motociclisti e automobilisti.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-300 mb-4">Link Utili</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="#" className="hover:text-primary-500 transition-colors">
                  Chi Siamo
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-500 transition-colors">
                  Contatti
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-500 transition-colors">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-300 mb-4">Seguici</h4>
            <p className="text-gray-400 text-sm">
              Resta aggiornato sulle nuove rotte e passi aggiunti.
            </p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-dark-800 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} TORNØ. Tutti i diritti riservati.</p>
        </div>
      </div>
    </footer>
  );
}


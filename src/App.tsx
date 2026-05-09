import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import PassiPage from './pages/PassiPage';
import NewPassoPage from './pages/NewPassoPage';
import ItinerariPage from './pages/ItinerariPage';
import NewItineraryPage from './pages/NewItineraryPage';
import PassoDetailPage from './pages/PassoDetailPage';
import ProfilePage from './pages/ProfilePage';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import I18nProvider from './i18n/I18nProvider';

function App() {
  return (
    <I18nProvider>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/passi" element={<PassiPage />} />
            <Route path="/passi/nuovo" element={<ProtectedRoute><NewPassoPage /></ProtectedRoute>} />
            <Route path="/itinerari" element={<ItinerariPage />} />
            <Route path="/itinerari/nuovo" element={<ProtectedRoute><NewItineraryPage /></ProtectedRoute>} />
            <Route path="/passi/:id" element={<PassoDetailPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </I18nProvider>
  );
}

export default App;

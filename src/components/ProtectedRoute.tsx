import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import type { ReactNode } from 'react';

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="glass-card rounded-2xl h-80 animate-pulse" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/profile" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

/**
 * Redirige selon l'état de connexion : /home si connecté, /login sinon
 */
function IndexRedirect() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-[var(--accent)] border-t-transparent" />
      </div>
    );
  }

  return <Navigate to={user ? '/onboarding' : '/login'} replace />;
}

export default IndexRedirect;

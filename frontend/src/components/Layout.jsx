import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)]">
      <header className="bg-white/80 backdrop-blur-sm border-b border-[var(--border)] px-4 py-3">
        <nav className="container mx-auto flex items-center justify-between">
          <div className="flex gap-1">
            <Link
              to="/home"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === '/home'
                  ? 'bg-[var(--accent)]/10 text-[var(--accent)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--accent)] hover:bg-[var(--accent)]/5'
              }`}
            >
              Accueil
            </Link>
            <Link
              to="/about"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === '/about'
                  ? 'bg-[var(--accent)]/10 text-[var(--accent)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--accent)] hover:bg-[var(--accent)]/5'
              }`}
            >
              À propos
            </Link>
          </div>
          {user && (
            <button
              type="button"
              onClick={handleLogout}
              className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
            >
              Déconnexion
            </button>
          )}
        </nav>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="py-4 px-4 border-t border-[var(--border)] bg-[var(--bg-secondary)] text-center">
        <p className="text-sm text-[var(--text-secondary)]">© 2025 Apprentissage</p>
      </footer>
    </div>
  );
}

export default Layout;
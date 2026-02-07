import { useState, useCallback } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { BrainModal, BRAIN_ICON } from './BrainModal';

function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [brainModalOpen, setBrainModalOpen] = useState(false);

  const handleBrainOpen = useCallback(() => setBrainModalOpen(true), []);
  const handleBrainClose = useCallback(() => setBrainModalOpen(false), []);
  const handleBrainSelect = useCallback((id) => {
    console.log('Brain section sélectionnée:', id);
    // TODO: navigation vers les sections
  }, []);

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

      {/* Bouton cerveau fixe (FAB) - visible quand connecté */}
      {user && (
        <>
          <button
            type="button"
            onClick={handleBrainOpen}
            className="fixed bottom-8 right-8 z-[150] w-14 h-14 rounded-full bg-[var(--accent)] text-white shadow-lg hover:bg-[var(--accent-hover)] hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center"
            aria-label="Ouvrir le menu assistant"
          >
            {BRAIN_ICON}
          </button>
          <BrainModal
            isOpen={brainModalOpen}
            onClose={handleBrainClose}
            onSelect={handleBrainSelect}
          />
        </>
      )}

      <footer className="py-4 px-4 border-t border-[var(--border)] bg-[var(--bg-secondary)] text-center">
        <p className="text-sm text-[var(--text-secondary)]">© 2025 Apprentissage</p>
      </footer>
    </div>
  );
}

export default Layout;
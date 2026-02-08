import { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import PasswordInput from '../../components/PasswordInput';
import { isPasswordValid } from '../../utils/passwordValidation';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const passwordMatch = password === confirmPassword && confirmPassword.length > 0;
  const canSubmit = username.trim().length >= 3 && email.trim().length > 0 && isPasswordValid(password) && passwordMatch;

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setError(null);
      if (!canSubmit) return;

      setLoading(true);

      try {
        await register(username.trim(), email.trim(), password);
        navigate('/onboarding', { replace: true });
      } catch (err) {
        const msg = err.response?.data?.error || err.message || 'Erreur lors de l\'inscription';
        setError(msg);
      } finally {
        setLoading(false);
      }
    },
    [username, email, password, canSubmit, register, navigate]
  );

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[var(--bg-primary)]">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-[var(--text-primary)] mb-1">
            Créer un compte
          </h1>
          <p className="text-[var(--text-secondary)]">
            Rejoignez-nous pour gérer vos apprentissages
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3 rounded-lg bg-amber-50/80 border border-amber-300 text-amber-800 text-sm">
              {error}
            </div>
          )}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              Nom d&apos;utilisateur
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Votre pseudo"
              required
              minLength={3}
              autoComplete="username"
              className="w-full px-4 py-3 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/40 focus:border-[var(--accent)] placeholder:text-[var(--text-secondary)]/60 text-[var(--text-primary)]"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vous@exemple.com"
              required
              autoComplete="email"
              className="w-full px-4 py-3 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/40 focus:border-[var(--accent)] placeholder:text-[var(--text-secondary)]/60 text-[var(--text-primary)]"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              Mot de passe
            </label>
            <PasswordInput
              id="password"
              value={password}
              onChange={setPassword}
              placeholder="Créez un mot de passe"
              showValidation
              error={null}
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              Confirmer le mot de passe
            </label>
            <PasswordInput
              id="confirmPassword"
              value={confirmPassword}
              onChange={setConfirmPassword}
              placeholder="Confirmez le mot de passe"
              showValidation={false}
              error={
                confirmPassword.length > 0 && !passwordMatch
                  ? 'Les mots de passe ne correspondent pas'
                  : null
              }
            />
          </div>

          <button
            type="submit"
            disabled={loading || !canSubmit}
            className="w-full py-3 px-4 rounded-lg bg-[var(--accent)] text-white font-medium hover:bg-[var(--accent-hover)] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Inscription...' : 'S\'inscrire'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[var(--text-secondary)]">
          Déjà un compte ?{' '}
          <Link to="/login" className="text-[var(--accent)] font-medium hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;

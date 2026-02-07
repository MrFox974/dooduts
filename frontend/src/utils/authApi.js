import api from '../../utils/api';

/**
 * Inscription
 * @param {string} username
 * @param {string} email
 * @param {string} password
 */
export const register = async (username, email, password) => {
  try {
    const { data } = await api.post('/api/auth/register', { username, email, password });
    return data;
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    throw error;
  }
};

/**
 * Connexion
 * @param {string} email
 * @param {string} password
 */
export const login = async (email, password) => {
  try {
    const { data } = await api.post('/api/auth/login', { email, password });
    return data;
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    throw error;
  }
};

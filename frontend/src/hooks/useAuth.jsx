import { useState, useCallback, useEffect, createContext, useContext } from 'react';
import { login as apiLogin, register as apiRegister } from '../utils/authApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const saveSession = useCallback((accessToken, userData, refreshToken) => {
    localStorage.setItem('accessToken', accessToken);
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
  }, []);

  const login = useCallback(async (email, password) => {
    const { accessToken, user: userData, refreshToken } = await apiLogin(email, password);
    saveSession(accessToken, userData, refreshToken);
    return userData;
  }, [saveSession]);

  const register = useCallback(async (username, email, password) => {
    const { accessToken, user: userData, refreshToken } = await apiRegister(username, email, password);
    saveSession(accessToken, userData, refreshToken);
    return userData;
  }, [saveSession]);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.exp && payload.exp * 1000 > Date.now()) {
          setUser({ id: payload.user_id });
        } else {
          logout();
        }
      } catch {
        logout();
      }
    }
    setLoading(false);
  }, [logout]);

  const value = { user, loading, login, register, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
}

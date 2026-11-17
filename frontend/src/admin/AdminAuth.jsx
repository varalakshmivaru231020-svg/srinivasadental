import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import * as api from './adminApi';

const AuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [state, setState] = useState({ checking: true, user: null });

  useEffect(() => {
    api.me()
      .then((res) => setState({ checking: false, user: res.data }))
      .catch(() => setState({ checking: false, user: null }));
    const onExpired = () => setState({ checking: false, user: null });
    window.addEventListener('sdc-admin-unauthorized', onExpired);
    return () => window.removeEventListener('sdc-admin-unauthorized', onExpired);
  }, []);

  const login = useCallback(async (username, password) => {
    const res = await api.login(username, password);
    setState({ checking: false, user: res.data });
  }, []);

  const logout = useCallback(async () => {
    try { await api.logout(); } catch { /* already signed out */ }
    setState({ checking: false, user: null });
  }, []);

  const value = useMemo(() => ({ ...state, login, logout }), [state, login, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAdminAuth = () => useContext(AuthContext);

export function RequireAdmin({ children }) {
  const { checking, user } = useAdminAuth();
  const location = useLocation();
  if (checking) return <div className="adm-center"><span className="adm-spinner" /></div>;
  if (!user) return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  return children;
}

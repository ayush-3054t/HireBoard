import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => ({
    token: localStorage.getItem('token'),
    role: localStorage.getItem('role'),
    account: (() => {
      try {
        return JSON.parse(localStorage.getItem('account') || 'null');
      } catch {
        return null;
      }
    })()
  }));
  const [loading, setLoading] = useState(Boolean(auth.token));

  useEffect(() => {
    const load = async () => {
      if (!auth.token) return setLoading(false);
      try {
        const { data } = await api.get('/auth/me');
        setAuth((prev) => ({ ...prev, role: data.role, account: data.account }));
        localStorage.setItem('account', JSON.stringify(data.account));
      } catch {
        logout(false);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const persist = (data) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('role', data.role);
    localStorage.setItem('account', JSON.stringify(data.account));
    setAuth(data);
  };

  const login = async (payload) => {
    const { data } = await api.post('/auth/login', payload);
    persist(data);
    toast.success('Signed in');
    return data.role;
  };

  const register = async (payload) => {
    const { data } = await api.post('/auth/register', payload);
    persist(data);
    toast.success('Account created');
    return data.role;
  };

  const logout = (notify = true) => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('account');
    setAuth({ token: null, role: null, account: null });
    if (notify) toast.success('Signed out');
  };

  const value = useMemo(() => ({ ...auth, loading, login, register, logout, setAuth }), [auth, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

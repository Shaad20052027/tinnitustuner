import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('tt_token'));
  const [user, setUser]   = useState(() => localStorage.getItem('tt_user'));

  const login = (token, name) => {
    localStorage.setItem('tt_token', token);
    localStorage.setItem('tt_user', name);
    setToken(token);
    setUser(name);
  };

  const logout = () => {
    localStorage.removeItem('tt_token');
    localStorage.removeItem('tt_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};

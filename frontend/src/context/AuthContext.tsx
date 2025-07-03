import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

interface AuthContextProps {
  token: string | null;
  setToken: (token: string | null) => void;
}

const AuthContext = createContext<AuthContextProps>({
  token: null,
  setToken: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, internalSetToken] = useState<string | null>(() => localStorage.getItem('auth_token'));

  const setToken = (newToken: string | null) => {
    if (newToken) {
      localStorage.setItem('auth_token', newToken);
    } else {
      localStorage.removeItem('auth_token');
    }
    internalSetToken(newToken);
  };

  useEffect(() => {
    axios.defaults.headers.common['Authorization'] = token ? `Bearer ${token}` : '';
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};

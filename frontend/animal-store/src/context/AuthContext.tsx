import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../types';
import type { ReactNode } from 'react';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User, remember?: boolean) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Load user and token from storage on mount
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token') || sessionStorage.getItem('token');

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const login = (newToken: string, newUser: User, remember = true) => {
    // Store token based on remember preference
    if (remember) {
      localStorage.setItem('token', newToken);
    } else {
      sessionStorage.setItem('token', newToken);
    }

    // Always store user in localStorage
    localStorage.setItem('user', JSON.stringify(newUser));

    // Update state
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    // Clear all storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');

    // Update state
    setToken(null);
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth.api';
import type { AuthUser } from '../api/types/auth';

type User = AuthUser;

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const getErrorMessage = useCallback((err: any): string => {
    if (err?.response?.data?.message) return String(err.response.data.message);
    if (err?.response?.data?.error) return String(err.response.data.error);
    if (err?.message) return String(err.message);
    if (typeof err === 'string') return err;
    return 'Terjadi kesalahan. Silakan coba lagi.';
  }, []);

  const checkAuth = useCallback(async () => {
    try {
      setIsLoading(true);
      clearError();
      
      const response = await authApi.getCurrentUser();
      const userData = response.data;

      if (userData && typeof userData === 'object') {
        setUser(userData);
      } else {
        setUser(null);
      }
    } catch (err: any) {
      const message = getErrorMessage(err);
      
      if (import.meta.env.DEV) {
        console.log(`[Auth Check] ${message}`);
      }
      
      setUser(null);
      
      if (err?.response?.status === 401) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
    } finally {
      setIsLoading(false);
    }
  }, [clearError, getErrorMessage]);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setIsLoading(true);
      clearError();
      
      const response = await authApi.login({ email, password });
      const responseData = response.data;

      if (responseData?.accessToken) {
        localStorage.setItem('accessToken', String(responseData.accessToken));
      }

      const meResponse = await authApi.getCurrentUser();
      setUser(meResponse.data);
      navigate('/admin/dashboard', { replace: true });
    } catch (err: any) {
      const message = getErrorMessage(err);
      setError(message);
      
      if (import.meta.env.DEV) {
        console.log(`[Login] ${message}`);
      }
      
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, [navigate, clearError, getErrorMessage]);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch (err: any) {
      const message = getErrorMessage(err);
      if (import.meta.env.DEV) {
        console.log(`[Logout] ${message}`);
      }
    } finally {
      setUser(null);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      navigate('/admin/login', { replace: true });
    }
  }, [navigate, getErrorMessage]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    isAdmin: user?.role === 'ADMIN',
    login,
    logout,
    error,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
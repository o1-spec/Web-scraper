'use client';

import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { AuthContextType, AuthState, User } from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setAuthState({
          user,
          isLoading: false,
          isAuthenticated: true,
        });
      } catch (error) {
        localStorage.removeItem('user');
        setAuthState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
        });
      }
    } else {
      setAuthState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Mock validation
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      const mockUser: User = {
        id: '1',
        email,
        firstName: 'John',
        lastName: 'Doe',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
      };

      localStorage.setItem('user', JSON.stringify(mockUser));
      setAuthState({
        user: mockUser,
        isLoading: false,
        isAuthenticated: true,
      });
    } catch (error) {
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
      }));
      throw error;
    }
  }, []);

  const signup = useCallback(async (email: string, password: string, firstName: string, lastName: string) => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock validation
      if (!email || !password || !firstName || !lastName) {
        throw new Error('All fields are required');
      }

      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      const mockUser: User = {
        id: Date.now().toString(),
        email,
        firstName,
        lastName,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${firstName}`,
      };

      localStorage.setItem('user', JSON.stringify(mockUser));
      setAuthState({
        user: mockUser,
        isLoading: false,
        isAuthenticated: true,
      });
    } catch (error) {
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
      }));
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('user');
    setAuthState({
      user: null,
      isLoading: false,
      isAuthenticated: false,
    });
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      if (!email) {
        throw new Error('Email is required');
      }

      // Mock success response
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
      }));
    } catch (error) {
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
      }));
      throw error;
    }
  }, []);

  const value: AuthContextType = {
    ...authState,
    login,
    signup,
    logout,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

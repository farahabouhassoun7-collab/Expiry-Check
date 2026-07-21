import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { getMeApi } from '../services/auth';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  loading: boolean;
  login: (token: string, user: User) => Promise<void>;
  register: (token: string, user: User) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'expiry_check_token';
const USER_KEY = 'expiry_check_user';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStoredAuth() {
      try {
        const storedToken = await SecureStore.getItemAsync(TOKEN_KEY);
        const storedUserJson = await SecureStore.getItemAsync(USER_KEY);

        if (storedToken && storedUserJson) {
          try {
            const meResponse = await getMeApi(storedToken);
            if (meResponse && meResponse.success && meResponse.user) {
              setToken(storedToken);
              setUser(meResponse.user);
            } else {
              await clearAuthStorage();
            }
          } catch (apiErr) {
            // If it's an authorization failure (401), clear credentials.
            // If it's a network issue, keep stored info so offline usage works.
            if (apiErr && (apiErr as any).status === 401) {
              await clearAuthStorage();
            } else {
              setToken(storedToken);
              setUser(JSON.parse(storedUserJson));
            }
          }
        }
      } catch (err) {
        console.error('Error loading stored credentials:', err);
      } finally {
        setLoading(false);
      }
    }

    loadStoredAuth();
  }, []);

  async function clearAuthStorage() {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(USER_KEY);
    setToken(null);
    setUser(null);
  }

  async function login(newToken: string, newUser: User) {
    try {
      await SecureStore.setItemAsync(TOKEN_KEY, newToken);
      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(newUser));
      setToken(newToken);
      setUser(newUser);
    } catch (err) {
      console.error('Error saving login session:', err);
      throw err;
    }
  }

  async function register(newToken: string, newUser: User) {
    await login(newToken, newUser);
  }

  async function logout() {
    try {
      await clearAuthStorage();
    } catch (err) {
      console.error('Error clearing login session:', err);
    }
  }

  return (
    <AuthContext.Provider value={{ token, user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

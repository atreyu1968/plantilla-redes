import { create } from 'zustand';
import axios from 'axios';
import { SERVER_CONFIG } from '../config';
import { persist } from 'zustand/middleware';

interface User {
  id: number;
  email: string;
  role: string;
  role_id: number;
  firstName?: string;
  lastName?: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User | null, token: string | null) => void;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      
      setAuth: (user, token) => set({ user, token, isAuthenticated: !!user }),
      
      login: async (username, password) => {
        try {
          const response = await axios.post<AuthResponse>(`${SERVER_CONFIG.BASE_URL}/api/users/login`, {
            username,
            password,
          });
          
          const { token, user } = response.data;
          
          // Configure axios defaults for future requests
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          set({ user, token, isAuthenticated: true });
        } catch (error) {
          if (axios.isAxiosError(error)) {
            const message = error.response?.data?.error || 'Error de autenticación';
            throw new Error(message);
          }
          throw new Error('Error al intentar iniciar sesión');
        }
      },
      
      logout: () => {
        // Clear axios default headers
        delete axios.defaults.headers.common['Authorization'];
        set({ user: null, token: null, isAuthenticated: false });
      }
    }),
    {
      name: 'auth-storage',
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          try {
            return JSON.parse(str);
          } catch {
            return null;
          }
        },
        setItem: (name, value) => {
          try {
            localStorage.setItem(name, JSON.stringify(value));
          } catch (err) {
            console.error('Error saving auth state:', err);
          }
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);
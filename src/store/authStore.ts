import { create } from 'zustand';
import { User } from '../types';
import supabaseService from '../services/supabase';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;

  // Actions
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,

  signIn: async (email: string, password: string) => {
    set({ isLoading: true, error: null });

    const response = await supabaseService.signIn(email, password);

    if (response.success && response.data) {
      set({
        user: response.data,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      return true;
    } else {
      set({
        error: response.error || 'Sign in failed',
        isLoading: false,
      });
      return false;
    }
  },

  signUp: async (email: string, password: string) => {
    set({ isLoading: true, error: null });

    const response = await supabaseService.signUp(email, password);

    if (response.success && response.data) {
      set({
        user: response.data,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      return true;
    } else {
      set({
        error: response.error || 'Sign up failed',
        isLoading: false,
      });
      return false;
    }
  },

  signOut: async () => {
    set({ isLoading: true });

    await supabaseService.signOut();

    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  },

  checkAuth: async () => {
    set({ isLoading: true });

    const response = await supabaseService.getCurrentUser();

    if (response.success && response.data) {
      set({
        user: response.data,
        isAuthenticated: true,
        isLoading: false,
      });
    } else {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  clearError: () => set({ error: null }),
}));

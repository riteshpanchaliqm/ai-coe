import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { api } from '../lib/api';

interface User {
  id: string;
  email: string;
  name: string;
  roles: string[];
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  initialize: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  error: null,

  initialize: async () => {
    try {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        const { user } = await api.get<{ user: User }>('/auth/me');
        set({ user, loading: false });
      } else {
        set({ user: null, loading: false });
      }
    } catch {
      set({ user: null, loading: false });
    }

    // Listen for auth changes
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        try {
          const { user } = await api.get<{ user: User }>('/auth/me');
          set({ user, loading: false });
        } catch {
          set({ user: null, loading: false });
        }
      } else if (event === 'SIGNED_OUT') {
        set({ user: null, loading: false });
      }
    });
  },

  signInWithGoogle: async () => {
    set({ error: null });
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        queryParams: {
          hd: 'iqm.com', // Restrict to IQM domain
        },
      },
    });
    if (error) {
      set({ error: error.message });
    }
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null });
  },
}));

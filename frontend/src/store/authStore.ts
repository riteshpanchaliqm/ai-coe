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

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: true,
  error: null,

  initialize: async () => {
    try {
      // First try getting existing session
      let { data: { session } } = await supabase.auth.getSession();

      // If session exists but might be stale, force refresh
      if (session) {
        const expiresAt = session.expires_at || 0;
        const now = Math.floor(Date.now() / 1000);
        if (expiresAt - now < 300) {
          // Token expires within 5 minutes — refresh it
          const { data: refreshed } = await supabase.auth.refreshSession();
          session = refreshed.session;
        }
      }

      if (session) {
        try {
          const { user } = await api.get<{ user: User }>('/auth/me');
          set({ user, loading: false });
        } catch {
          // API call failed — try refreshing session
          const { data: refreshed } = await supabase.auth.refreshSession();
          if (refreshed.session) {
            try {
              const { user } = await api.get<{ user: User }>('/auth/me');
              set({ user, loading: false });
            } catch {
              set({ user: null, loading: false });
            }
          } else {
            set({ user: null, loading: false });
          }
        }
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
      } else if (event === 'TOKEN_REFRESHED' && session) {
        // Token was refreshed — if we don't have a user yet, fetch it
        if (!get().user) {
          try {
            const { user } = await api.get<{ user: User }>('/auth/me');
            set({ user, loading: false });
          } catch {
            set({ user: null, loading: false });
          }
        }
      }
    });
  },

  signInWithGoogle: async () => {
    set({ error: null });
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        queryParams: {
          hd: 'iqm.com',
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

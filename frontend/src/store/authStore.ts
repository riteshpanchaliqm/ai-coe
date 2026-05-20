import { create } from 'zustand';
import { supabase } from '../lib/supabase';

const API_BASE = import.meta.env.VITE_API_BASE_PATH || '/api/v1/ai-coe';
const STORAGE_KEY = 'aicoe-auth';

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

function getTokenFromStorage(): string | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    const parsed = JSON.parse(stored);
    return parsed?.access_token || null;
  } catch {
    return null;
  }
}

async function fetchMe(token: string): Promise<User | null> {
  try {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.user;
  } catch {
    return null;
  }
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  error: null,

  initialize: async () => {
    // Read token directly from localStorage — no Supabase client call
    const token = getTokenFromStorage();

    if (!token) {
      set({ user: null, loading: false });
      return;
    }

    // Fetch user profile from our backend
    const user = await fetchMe(token);

    if (user) {
      set({ user, loading: false });
    } else {
      // Token might be expired — try refresh
      try {
        const { data } = await supabase.auth.refreshSession();
        if (data.session?.access_token) {
          const refreshedUser = await fetchMe(data.session.access_token);
          set({ user: refreshedUser, loading: false });
        } else {
          set({ user: null, loading: false });
        }
      } catch {
        set({ user: null, loading: false });
      }
    }

    // Listen for future auth changes (sign in/out from other tabs)
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const u = await fetchMe(session.access_token);
        set({ user: u, loading: false });
      } else if (event === 'SIGNED_OUT') {
        set({ user: null, loading: false });
      } else if (event === 'TOKEN_REFRESHED' && session) {
        // Token refreshed in background — update if needed
        const stored = getTokenFromStorage();
        if (!stored) {
          // Storage was cleared somehow
          set({ user: null, loading: false });
        }
      }
    });
  },

  signInWithGoogle: async () => {
    set({ error: null });
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        queryParams: { hd: 'iqm.com' },
      },
    });
    if (error) {
      set({ error: error.message });
    }
  },

  signOut: async () => {
    await supabase.auth.signOut();
    localStorage.removeItem(STORAGE_KEY);
    set({ user: null });
  },
}));

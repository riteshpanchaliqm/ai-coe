import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storageKey: 'aicoe-auth',
    flowType: 'pkce',
    // Disable navigator.locks which causes hangs after tab inactivity
    lock: async (_name: string, _acquireTimeout: number, fn: () => Promise<any>) => {
      // Skip the lock entirely — just run the function directly
      return fn();
    },
  } as any,
});

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { config } from '../config';

let _adminClient: SupabaseClient | null = null;

/**
 * Server-side Supabase client with service role key.
 * Bypasses RLS for admin operations.
 */
export function getSupabaseAdmin(): SupabaseClient {
  if (!_adminClient) {
    _adminClient = createClient(config.supabaseUrl, config.supabaseServiceRoleKey);
  }
  return _adminClient;
}

/**
 * Proxy export for convenience — lazily creates the client on first property access.
 */
export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getSupabaseAdmin();
    const value = (client as any)[prop];
    if (typeof value === 'function') {
      return value.bind(client);
    }
    return value;
  },
});

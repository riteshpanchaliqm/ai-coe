import { supabase } from './supabase';

const API_BASE = import.meta.env.VITE_API_BASE_PATH || '/api/v1/ai-coe';
const STORAGE_KEY = 'aicoe-auth';

/**
 * Get access token - tries multiple approaches to avoid hanging.
 */
async function getAccessToken(): Promise<string | null> {
  // Approach 1: Read directly from localStorage (instant, no async)
  try {
    const stored = localStorage.getItem(`sb-${STORAGE_KEY}-auth-token`);
    if (!stored) {
      // Try the default key format
      const keys = Object.keys(localStorage).filter(k => k.includes('auth-token'));
      for (const key of keys) {
        const val = localStorage.getItem(key);
        if (val) {
          try {
            const parsed = JSON.parse(val);
            if (parsed?.access_token) {
              // Check if expired
              const expiresAt = parsed.expires_at || 0;
              const now = Math.floor(Date.now() / 1000);
              if (expiresAt > now) {
                return parsed.access_token;
              }
            }
          } catch { /* not JSON */ }
        }
      }
    } else {
      const parsed = JSON.parse(stored);
      if (parsed?.access_token) {
        const expiresAt = parsed.expires_at || 0;
        const now = Math.floor(Date.now() / 1000);
        if (expiresAt > now) {
          return parsed.access_token;
        }
      }
    }
  } catch { /* localStorage read failed */ }

  // Approach 2: Use Supabase client with a timeout
  try {
    const result = await Promise.race([
      supabase.auth.getSession(),
      new Promise<null>((resolve) => setTimeout(() => resolve(null), 3000)),
    ]);

    if (result && 'data' in result && result.data.session?.access_token) {
      return result.data.session.access_token;
    }
  } catch { /* getSession failed */ }

  // Approach 3: Force refresh
  try {
    const { data } = await supabase.auth.refreshSession();
    return data.session?.access_token || null;
  } catch {
    return null;
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  retry = true
): Promise<T> {
  const token = await getAccessToken();

  if (!token) {
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
    throw new Error('No session');
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (res.status === 401 && retry) {
    try {
      const { data } = await supabase.auth.refreshSession();
      if (data.session) {
        return request<T>(path, options, false);
      }
    } catch { /* refresh failed */ }
    window.location.href = '/login';
    throw new Error('Session expired');
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: { message: 'Request failed' } }));
    throw new Error(error.error?.message || `HTTP ${res.status}`);
  }

  return res.json();
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  patch: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'DELETE', body: body ? JSON.stringify(body) : undefined }),
};

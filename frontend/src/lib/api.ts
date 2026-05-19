import { supabase } from './supabase';

const API_BASE = import.meta.env.VITE_API_BASE_PATH || '/api/v1/ai-coe';

async function getAccessToken(): Promise<string | null> {
  // Always get a fresh session — this handles auto-refresh internally
  const { data: { session }, error } = await supabase.auth.getSession();

  if (error || !session) {
    // Try explicit refresh
    const { data: refreshed } = await supabase.auth.refreshSession();
    return refreshed.session?.access_token || null;
  }

  // Check if token is about to expire (within 60 seconds)
  const expiresAt = session.expires_at || 0;
  const now = Math.floor(Date.now() / 1000);
  if (expiresAt - now < 60) {
    const { data: refreshed } = await supabase.auth.refreshSession();
    return refreshed.session?.access_token || session.access_token;
  }

  return session.access_token;
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  retry = true
): Promise<T> {
  const token = await getAccessToken();

  if (!token) {
    window.location.href = '/login';
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

  // If 401 and we haven't retried, force refresh and retry once
  if (res.status === 401 && retry) {
    const { data: refreshed } = await supabase.auth.refreshSession();
    if (refreshed.session) {
      return request<T>(path, options, false);
    }
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

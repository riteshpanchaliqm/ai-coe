const API_BASE = import.meta.env.VITE_API_BASE_PATH || '/api/v1/ai-coe';
const STORAGE_KEY = 'aicoe-auth';

/**
 * Get access token synchronously from localStorage.
 * Never calls Supabase client — avoids all async hanging issues.
 */
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

async function request<T>(
  path: string,
  options: RequestInit = {},
  isRetry = false
): Promise<T> {
  const token = getTokenFromStorage();

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

  if (res.status === 401 && !isRetry) {
    // Token rejected — try refreshing via Supabase and retry
    try {
      const { supabase } = await import('./supabase');
      const { data } = await supabase.auth.refreshSession();
      if (data.session) {
        return request<T>(path, options, true);
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

const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';

export interface AuthResponse {
  token: string;
  user: { id: number; email: string };
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? 'Request failed');
  return data as T;
}

export function loginRequest(email: string, password: string) {
  return post<AuthResponse>('/api/auth/login', { email, password });
}

export function registerRequest(email: string, password: string) {
  return post<AuthResponse>('/api/auth/register', { email, password });
}

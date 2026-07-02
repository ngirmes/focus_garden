import type { Plant } from './types';

const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';

function authHeaders(token: string) {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

async function request<T>(path: string, token: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: authHeaders(token),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? 'Request failed');
  return data as T;
}

export interface GardenState {
  plant: Plant;
  coins: number;
}

export interface SessionResult {
  plant: Plant;
  pointsEarned: number;
  evolved: boolean;
}

export interface SellResult {
  coins: number;
  newPlant: Plant;
}

export function getGarden(token: string): Promise<GardenState> {
  return request<GardenState>('/api/garden', token);
}

export function completeSession(token: string, durationMinutes: number): Promise<SessionResult> {
  return request<SessionResult>('/api/sessions', token, {
    method: 'POST',
    body: JSON.stringify({ duration_minutes: durationMinutes }),
  });
}

export function sellPlant(token: string): Promise<SellResult> {
  return request<SellResult>('/api/garden/sell', token, { method: 'POST' });
}

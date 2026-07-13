import type { GardenState, SessionResult, SellResult } from "./types";
import { request } from "./client";

export function getGarden(token: string): Promise<GardenState> {
  return request<GardenState>("/api/garden", token);
}

export function completeSession(
  token: string,
  durationMinutes: number,
): Promise<SessionResult> {
  return request<SessionResult>("/api/sessions", token, {
    method: "POST",
    body: JSON.stringify({ duration_minutes: durationMinutes }),
  });
}

export function sellPlant(token: string): Promise<SellResult> {
  return request<SellResult>("/api/garden/sell", token, { method: "POST" });
}

import { request } from "./client";

export interface SeedEntry {
  id: string;
  name: string;
  quantity: number;
  image?: string;
}

interface UserSeedRow {
  id: number;
  name: string;
  quantity: number;
}

export async function getSeedInventory(token: string): Promise<SeedEntry[]> {
  const rows = await request<UserSeedRow[]>("/api/inventory/seeds", token);
  return rows.map((row) => ({ id: String(row.id), name: row.name, quantity: row.quantity }));
}

interface PurchaseSeedResult {
  coins: number;
  quantity: number;
}

export function purchaseSeed(token: string, seedTypeId: string): Promise<PurchaseSeedResult> {
  return request<PurchaseSeedResult>(`/api/shop/seeds/${seedTypeId}/purchase`, token, {
    method: "POST",
  });
}

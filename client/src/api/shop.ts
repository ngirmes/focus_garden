import type { ShopItem } from "./types";
import { request } from "./client";

interface SeedTypeRow {
  id: number;
  name: string;
  price: number;
}

export async function getShopSeeds(token: string): Promise<ShopItem[]> {
  const rows = await request<SeedTypeRow[]>("/api/shop", token);
  return rows.map((row) => ({ id: String(row.id), name: row.name, price: row.price }));
}

// Placeholder catalog until decorations have real sprites and a backend shop endpoint.
export const DECORATION_SHOP_ITEMS: ShopItem[] = [
  { id: "stone-lantern", name: "Stone Lantern", price: 30 },
  { id: "garden-gnome", name: "Garden Gnome", price: 45 },
  { id: "wind-chime", name: "Wind Chime", price: 55 },
];

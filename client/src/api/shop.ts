import type { ShopItem } from "./types";

// Placeholder catalog until seeds have real sprites and a backend shop endpoint.
export const SHOP_ITEMS: ShopItem[] = [
  { id: "basic-seed", name: "Basic Seed", price: 20 },
  { id: "sunflower-seed", name: "Sunflower Seed", price: 40 },
  { id: "rare-seed", name: "Rare Seed", price: 100 },
];

// Placeholder catalog until decorations have real sprites and a backend shop endpoint.
export const DECORATION_SHOP_ITEMS: ShopItem[] = [
  { id: "stone-lantern", name: "Stone Lantern", price: 30 },
  { id: "garden-gnome", name: "Garden Gnome", price: 45 },
  { id: "wind-chime", name: "Wind Chime", price: 55 },
];

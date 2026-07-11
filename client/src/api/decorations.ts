export interface DecorationEntry {
  id: string;
  name: string;
  quantity: number;
  image?: string;
}

// ids match a subset of DECORATION_SHOP_ITEMS in ./shop.ts, mirroring how
// INITIAL_INVENTORY's ids match SHOP_ITEMS.
export const INITIAL_DECORATIONS: DecorationEntry[] = [
  { id: "stone-lantern", name: "Stone Lantern", quantity: 1 },
];

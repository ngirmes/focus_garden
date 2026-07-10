export interface SeedEntry {
  id: string;
  name: string;
  quantity: number;
  image?: string;
}

// Mock starting inventory for the frontend-only prototype.
// ids intentionally match SHOP_ITEMS in ./shop.ts so a future purchase-flow
// wire-up can look up name/image by id consistently.
export const INITIAL_INVENTORY: SeedEntry[] = [
  { id: "basic-seed", name: "Basic Seed", quantity: 2 },
];

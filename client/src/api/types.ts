export interface AuthResponse {
  token: string;
  user: { id: number; email: string };
}

export interface Plant {
  id: number;
  user_id: number;
  stage: number;
  points: number;
  created_at: string;
  sold_at: string | null;
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

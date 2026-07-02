export interface Plant {
  id: number;
  user_id: number;
  stage: number;
  points: number;
  created_at: string;
  sold_at: string | null;
}
